#!/usr/bin/env python3
"""Lift the heme's contours out of the traced Kendrew sheets as overlays.

Bodo, Dintzis, Kendrew & Wyckoff (1959) identify the heme as the highest peak
of the synthesis, seen in section y = -1/16 b and its neighbours, figures
18(e) to (g). Each contour ring that encloses that peak and stays within the
heme disk's ~9 A is copied into kendrew-sheet-<panel>-heme.svg.

  python3 scripts/kendrew_heme.py
"""
import pathlib
import re

DIR = pathlib.Path(__file__).resolve().parent.parent / "public/images/first-structures"
PANELS = "efg"
# In angstroms on the sheet, read off figure 18(f).
PEAK = (51.0, 21.5)
MAX_EXTENT = 10.0
RED = "#E11D48"


def rings(d):
    for sub in re.findall(r"M[^M]+", d):
        nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", sub)]
        xs, ys = nums[0::2], nums[1::2]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        encloses = x0 < PEAK[0] < x1 and y0 < PEAK[1] < y1
        if encloses and max(x1 - x0, y1 - y0) <= MAX_EXTENT:
            yield sub.strip()


for panel in PANELS:
    src = (DIR / f"kendrew-sheet-{panel}-solids.svg").read_text(encoding="utf8")
    view = re.search(r'viewBox="([^"]+)"', src).group(1)
    ink = re.findall(r'<path fill="#1A1825"[^>]*d="([^"]+)"', src)[0]
    d = "".join(rings(ink))
    out = DIR / f"kendrew-sheet-{panel}-heme.svg"
    out.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}">'
        f'<path fill="{RED}" stroke="{RED}" stroke-width="0.13" '
        f'fill-rule="evenodd" d="{d}"/></svg>',
        encoding="utf8",
    )
    print(out.name, d.count("M"), "subpaths")
