#!/usr/bin/env python3
"""Vectorise Kendrew's printed Fourier sections into stackable sheets.

Bodo, Dintzis, Kendrew & Wyckoff, Proc. R. Soc. A 253, 70 (1959) print eight
sections of the 6 A synthesis as figure 18 — (a) y = +4/16 b down to
(h) y = -3/16 b. The remaining eight sheets of the physical model are these
rotated through 180 degrees, which is what the screw axis does.

Each panel is one unit cell in the a/c plane. The plate draws it with the
acute angle, 180 - beta, and prints it sideways, so the page is rotated
upright first. Panel corners are found from the drawn cell edges rather than
guessed, everything outside the parallelogram is masked away (neighbouring
panels overlap its bounding box), the contours are traced, and pixel
coordinates are mapped onto a and c so the output is in angstroms and the
sheets stack at the true b/16 spacing.

  uv run --with pypdfium2 --with potracer --with numpy --with pillow \
      --with opencv-python-headless python scripts/kendrew_sheets.py <pdf> [panel ...]
"""
import math
import pathlib
import sys

import cv2
import numpy as np
import potrace
import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageFilter

A, B, C = 64.5, 30.9, 34.7
BETA = 106.0
GAMMA = 180.0 - BETA
N_SECTIONS = 16

# figure 18 runs across two plates, four panels each, read left-then-right.
PLATES = {26: ["a", "b", "c", "d"], 27: ["e", "f", "g", "h"]}
HEIGHTS = {"a": 4, "b": 3, "c": 2, "d": 1, "e": 0, "f": -1, "g": -2, "h": -3}

SCALE = 6.0
THRESHOLD = 175
OUT = pathlib.Path(__file__).resolve().parent.parent / "public/images/first-structures"


def page_image(pdf, index):
    im = pdfium.PdfDocument(pdf)[index].render(scale=SCALE).to_pil()
    return im.rotate(-90, expand=True).convert("RGB")


def ink_mask(rgb):
    a = np.array(rgb)
    r, g, b = a[:, :, 0].astype(int), a[:, :, 1].astype(int), a[:, :, 2].astype(int)
    # the scan's journal furniture is blue; the plate itself is neutral.
    return (abs(r - b) < 40) & (abs(r - g) < 40) & (r < 170)


def order_quad(pts):
    """Corners as bottom-left, bottom-right, top-right, top-left."""
    top, bottom = sorted(sorted(pts, key=lambda p: p[1])[:2]), sorted(
        sorted(pts, key=lambda p: p[1])[2:]
    )
    return [bottom[0], bottom[1], top[1], top[0]]


def find_panels(dark):
    """Locate the four ruled parallelograms as closed outlines.

    The two plates are inked differently and the a-d scan is slightly skewed,
    so the panels in a band do not share a row. Tracing each border as its own
    closed contour sidesteps both problems.
    """
    h, w = dark.shape
    img = (dark * 255).astype(np.uint8)
    # Faint rules on the a-d plate come through broken; bridge the gaps.
    img = cv2.morphologyEx(img, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    cnts, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    panels = []
    for c in cnts:
        if cv2.contourArea(c) < 0.05 * h * w:
            continue
        peri = cv2.arcLength(c, True)
        quad = None
        for eps in np.arange(0.005, 0.06, 0.005):
            ap = cv2.approxPolyDP(c, eps * peri, True)
            if len(ap) == 4:
                quad = ap.reshape(4, 2)
                break
        if quad is None:
            quad = cv2.boxPoints(cv2.minAreaRect(c))
        panels.append(order_quad([(float(x), float(y)) for x, y in quad]))

    if len(panels) != 4:
        raise SystemExit(f"expected 4 panels on this plate, found {len(panels)}")
    # reading order: top band left to right, then bottom band
    panels.sort(key=lambda q: (round(sum(p[1] for p in q) / 4 / 200), q[0][0]))
    return panels


def trace_panel(gray, corners, pad=10, inset=7):
    xs = [p[0] for p in corners]
    ys = [p[1] for p in corners]
    box = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad)

    # Panels are ruled at slightly different heights across the plate, so a
    # mask on the rule itself catches the printed border on some sheets and
    # not others. Pull inside it and let the emitted frame be the border.
    cx = sum(xs) / 4.0
    cy = sum(ys) / 4.0
    shrunk = []
    for x, y in corners:
        dx, dy = cx - x, cy - y
        n = math.hypot(dx, dy) or 1.0
        shrunk.append((x + dx / n * inset, y + dy / n * inset))

    mask = Image.new("L", gray.size, 0)
    ImageDraw.Draw(mask).polygon(shrunk, fill=255)
    clean = Image.new("L", gray.size, 255)
    clean.paste(gray, mask=mask)

    crop = clean.crop(box).filter(ImageFilter.MedianFilter(3))
    ink = np.array(crop) < THRESHOLD
    # potracer treats True as background, so the ink mask goes in inverted.
    paths = potrace.Bitmap(~ink).trace(
        turdsize=4, alphamax=1.0, opticurve=True, opttolerance=0.45
    )
    return paths, (box[0], box[1]), crop.size


def to_angstrom(corners, offset):
    (bx, by), (rx, ry), _, (tx, ty) = corners
    ox, oy = offset
    ax_, ay_ = rx - bx, ry - by
    cx_, cy_ = tx - bx, ty - by
    det = ax_ * cy_ - ay_ * cx_
    g = math.radians(GAMMA)

    def f(px, py):
        dx, dy = (px + ox) - bx, (py + oy) - by
        fa = (dx * cy_ - dy * cx_) / det
        fc = (ax_ * dy - ay_ * dx) / det
        return fa * A + fc * C * math.cos(g), fc * C * math.sin(g)

    return f


def write_svg(paths, f, out, min_diag=0.0):
    shear = C * math.cos(math.radians(GAMMA))
    w, h = A + shear, C * math.sin(math.radians(GAMMA))

    def pt(p):
        x, z = f(p.x, p.y)
        return x, h - z

    d, n = [], 0
    for curve in paths:
        pts, seg = [], []
        p = pt(curve.start_point)
        pts.append(p)
        seg.append(f"M{p[0]:.2f} {p[1]:.2f}")
        for s in curve:
            if s.is_corner:
                for q in (pt(s.c), pt(s.end_point)):
                    pts.append(q)
                    seg.append(f"L{q[0]:.2f} {q[1]:.2f}")
            else:
                a1, a2, a3 = pt(s.c1), pt(s.c2), pt(s.end_point)
                pts += [a1, a2, a3]
                seg.append(
                    f"C{a1[0]:.2f} {a1[1]:.2f} {a2[0]:.2f} {a2[1]:.2f} "
                    f"{a3[0]:.2f} {a3[1]:.2f}"
                )
        xs = [q[0] for q in pts]
        ys = [q[1] for q in pts]
        # The size distribution is sharply bimodal: dots and dashes fall well
        # under 0.6 A across, the above-mean contours all run past 1.2 A.
        if math.hypot(max(xs) - min(xs), max(ys) - min(ys)) < min_diag:
            continue
        n += 1
        d.append("".join(seg) + "Z")

    frame = f"M0 {h:.2f}L{A} {h:.2f}L{A + shear:.2f} 0L{shear:.2f} 0Z"
    out.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}">'
        f'<path fill="none" stroke="#B1AFC0" stroke-width="0.12" d="{frame}"/>'
        # Traced outlines are ~0.15 A wide and go sub-pixel when a sheet is
        # rendered small; the stroke keeps them visible.
        f'<path fill="#1A1825" stroke="#1A1825" stroke-width="0.13" '
        f'fill-rule="evenodd" d="{"".join(d)}"/>'
        "</svg>"
    )
    return n


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    pdf = sys.argv[1]
    args = sys.argv[2:]
    solids = "--solids" in args
    wanted = [a for a in args if not a.startswith("-")] or ["f"]
    min_diag = 1.2 if solids else 0.0
    suffix = "-solids" if solids else ""
    OUT.mkdir(parents=True, exist_ok=True)

    for index, labels in PLATES.items():
        todo = [l for l in labels if l in wanted]
        if not todo:
            continue
        rgb = page_image(pdf, index)
        gray = rgb.convert("L")
        panels = find_panels(ink_mask(rgb))
        for label, corners in zip(labels, panels):
            if label not in todo:
                continue
            paths, offset, size = trace_panel(gray, corners)
            dest = OUT / f"kendrew-sheet-{label}{suffix}.svg"
            n = write_svg(paths, to_angstrom(corners, offset), dest, min_diag)

            (bx, by), (rx, ry), _, (tx, ty) = corners
            a_px = math.hypot(rx - bx, ry - by)
            c_px = math.hypot(tx - bx, ty - by)
            ang = math.degrees(math.atan2(by - ty, tx - bx))
            kb = dest.stat().st_size / 1024
            print(
                f"  ({label}) y = {HEIGHTS[label]}/16 b | {size[0]}x{size[1]} px | "
                f"a/c {a_px / c_px:.3f} (true {A / C:.3f}) | angle {ang:.1f} deg "
                f"(true {GAMMA:.1f}) | {n} subpaths | {kb:.0f} kB"
            )
    print(f"  sheet {A + C * math.cos(math.radians(GAMMA)):.1f} x "
          f"{C * math.sin(math.radians(GAMMA)):.1f} A, spacing b/16 = {B / N_SECTIONS:.2f} A")


if __name__ == "__main__":
    main()
