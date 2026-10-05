#!/usr/bin/env python3
"""Rebuild Perutz's sliced hemoglobin model from human deoxyhemoglobin (2HHB).

Perutz (Nature 185, 416, 1960) built his model by cutting, from each section of
the 5.5 A map, every region where the density exceeds 0.54 electron/A^3, then
stacking the pieces and attaching the haems as disks. This does the same with
the modern structure: a density map is made from the atoms with flat bulk
solvent around them, cut off at 5.5 A, sliced perpendicular to the molecule's
two-fold axis, and outlined per chain at that level. His sections were 2 A
apart, normal to b, which in his horse crystals is the molecule's two-fold
axis. Each haem becomes a disk at its iron, normal to its ring, as wide as the
haem without its propionate tails.

  uv run --with numpy --with scikit-image python scripts/hemoglobin_slabs.py
"""
import json
import math
import pathlib

import numpy as np
from skimage import measure

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDB = ROOT / "public/structures/2HHB.pdb"
OUT = ROOT / "public/structures/hemoglobin-slabs.json"

RESOLUTION = 5.5
LEVEL = 0.54
SOLVENT = 0.335
SPACING = 2.0
GRID = 0.75
PAD = 12.0
# Electrons per heavy atom with its riding hydrogens folded in.
ELECTRONS = {"C": 7.0, "N": 7.5, "O": 8.5, "S": 16.5, "FE": 26.0}
CHAINS = "ABCD"
RING = {"NA", "NB", "NC", "ND", "CHA", "CHB", "CHC", "CHD"} | {
    f"C{i}{r}" for i in range(1, 5) for r in "ABCD"
}


def read_pdb():
    atoms, haem = [], {c: [] for c in CHAINS}
    for line in PDB.read_text().splitlines():
        if not line.startswith(("ATOM", "HETATM")):
            continue
        if line[16] not in " A":
            continue
        res, chain, name = line[17:20].strip(), line[21], line[12:16].strip()
        xyz = [float(line[30:38]), float(line[38:46]), float(line[46:54])]
        el = (line[76:78].strip() or name[0]).upper()
        if res == "HEM":
            haem[chain].append((name, xyz))
            continue
        if res in ("HOH", "PO4") or chain not in CHAINS:
            continue
        b = float(line[60:66])
        atoms.append((chain, name, el, xyz, b))
    return atoms, haem


def kabsch(p, q):
    pc, qc = p - p.mean(0), q - q.mean(0)
    u, _, vt = np.linalg.svd(pc.T @ qc)
    d = np.sign(np.linalg.det(vt.T @ u.T))
    return vt.T @ np.diag([1, 1, d]) @ u.T


def dyad_frame(atoms):
    """Rotation putting the two-fold axis (alpha1beta1 -> alpha2beta2) along z."""
    ca = {}
    for chain, name, _, xyz, _ in atoms:
        if name == "CA":
            ca.setdefault(chain, []).append(xyz)
    p = np.array(ca["A"] + ca["B"])
    q = np.array(ca["C"] + ca["D"])
    r = kabsch(p, q)
    w, v = np.linalg.eig(r)
    axis = np.real(v[:, np.argmin(abs(w - 1))])
    axis /= np.linalg.norm(axis)
    # x along alpha1 -> beta1 projected off the axis, so the frame is repeatable.
    ab = np.mean(ca["B"], 0) - np.mean(ca["A"], 0)
    x = ab - axis * (ab @ axis)
    x /= np.linalg.norm(x)
    y = np.cross(axis, x)
    return np.array([x, y, axis])


def density(coords, electrons, sigmas, origin, shape):
    rho = np.zeros(shape)
    for (cx, cy, cz), e, s in zip(coords, electrons, sigmas):
        r = int(math.ceil(3 * s / GRID))
        i0 = np.round((np.array([cx, cy, cz]) - origin) / GRID).astype(int)
        sl = tuple(slice(max(0, i - r), min(n, i + r + 1)) for i, n in zip(i0, shape))
        ax = [origin[k] + GRID * np.arange(sl[k].start, sl[k].stop) for k in range(3)]
        gx, gy, gz = np.meshgrid(*ax, indexing="ij")
        d2 = (gx - cx) ** 2 + (gy - cy) ** 2 + (gz - cz) ** 2
        rho[sl] += e * np.exp(-d2 / (2 * s * s)) / ((2 * math.pi * s * s) ** 1.5)
    return rho


def low_pass(rho):
    f = np.fft.fftn(rho)
    freqs = [np.fft.fftfreq(n, d=GRID) for n in rho.shape]
    sx, sy, sz = np.meshgrid(*freqs, indexing="ij")
    f[np.sqrt(sx**2 + sy**2 + sz**2) > 1 / RESOLUTION] = 0
    return np.real(np.fft.ifftn(f))


def loops_to_shapes(loops):
    def area(p):
        x, y = p[:, 0], p[:, 1]
        return 0.5 * (x @ np.roll(y, 1) - y @ np.roll(x, 1))

    def inside(pt, poly):
        x, y = pt
        c = False
        for (x1, y1), (x2, y2) in zip(poly, np.roll(poly, 1, 0)):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                c = not c
        return c

    loops = [p for p in loops if abs(area(p)) > 2.0]
    depth = [sum(inside(p[0], q) for q in loops if q is not p) for p in loops]
    shapes = []
    for p, d in zip(loops, depth):
        if d % 2:
            continue
        holes = [
            q for q, dq in zip(loops, depth) if dq == d + 1 and inside(q[0], p)
        ]
        shapes.append({"outer": p, "holes": holes})
    return shapes


def main():
    atoms, haem = read_pdb()
    frame = dyad_frame(atoms)
    coords = np.array([a[3] for a in atoms])
    centre = coords.mean(0)
    coords = (coords - centre) @ frame.T
    chains = np.array([a[0] for a in atoms])
    electrons = np.array([ELECTRONS.get(a[2], 7.0) for a in atoms])
    sigmas = np.array([math.sqrt(a[4] / (8 * math.pi**2) + 0.25) for a in atoms])

    origin = coords.min(0) - PAD
    shape = tuple(np.ceil((coords.max(0) + PAD - origin) / GRID).astype(int) + 1)

    per_chain = {}
    for c in CHAINS:
        m = chains == c
        per_chain[c] = density(coords[m], electrons[m], sigmas[m], origin, shape)
    protein = sum(per_chain.values())
    # Flat solvent wherever no atom is within 3 A.
    occupied = density(coords, np.ones(len(coords)), np.full(len(coords), 1.2), origin, shape)
    solvent = SOLVENT * np.clip(1 - occupied / occupied.max() * 40, 0, 1)
    total = low_pass(protein + solvent)
    smooth = {c: low_pass(per_chain[c]) for c in CHAINS}
    print(f"density: protein interior mean {total[occupied > occupied.max() / 4].mean():.3f}, "
          f"solvent {total[occupied < 1e-6].mean():.3f}, max {total.max():.3f} e/A^3")

    zs = origin[2] + GRID * np.arange(shape[2])
    lo, hi = coords[:, 2].min(), coords[:, 2].max()
    levels = np.arange(math.ceil(lo / SPACING) * SPACING, hi + 1e-6, SPACING)
    slices = []
    for z in levels:
        k = (z - origin[2]) / GRID
        k0 = int(math.floor(k))
        t = k - k0
        lerp = lambda a: (1 - t) * a[:, :, k0] + t * a[:, :, k0 + 1]
        tz = lerp(total)
        own = {c: lerp(smooth[c]) for c in CHAINS}
        for c in CHAINS:
            rival = np.max([own[o] for o in CHAINS if o != c], axis=0)
            field = np.minimum(tz - LEVEL, own[c] - rival)
            if field.max() <= 0:
                continue
            loops = []
            for path in measure.find_contours(field, 0.0):
                path = measure.approximate_polygon(path, tolerance=0.35)
                xy = origin[:2] + path * GRID
                loops.append(xy)
            shapes = loops_to_shapes(loops)
            if shapes:
                slices.append({
                    "z": round(float(z), 2),
                    "chain": c,
                    "shapes": [
                        {
                            "outer": np.round(s["outer"], 1).tolist(),
                            "holes": [np.round(h, 1).tolist() for h in s["holes"]],
                        }
                        for s in shapes
                    ],
                })

    disks = []
    for c in CHAINS:
        fe = (np.array(next(xyz for n, xyz in haem[c] if n == "FE")) - centre) @ frame.T
        ring = (np.array([xyz for n, xyz in haem[c] if n in RING]) - centre) @ frame.T
        _, _, vt = np.linalg.svd(ring - ring.mean(0))
        normal = vt[2]
        body = (np.array([
            xyz for n, xyz in haem[c] if not n.startswith(("O", "CG")) and n != "FE"
        ]) - centre) @ frame.T - fe
        radius = np.linalg.norm(body - np.outer(body @ normal, normal), axis=1).max()
        disks.append({
            "chain": c,
            "centre": np.round(fe, 2).tolist(),
            "normal": np.round(normal, 4).tolist(),
            "radius": round(float(radius), 2),
        })

    OUT.write_text(json.dumps({
        "source": "2HHB",
        "resolution": RESOLUTION,
        "level": LEVEL,
        "spacing": SPACING,
        "chains": {"A": "alpha", "B": "beta", "C": "alpha", "D": "beta"},
        "slices": slices,
        "haems": disks,
    }, separators=(",", ":")))
    print(f"{OUT.name}: {len(slices)} chain slices over {len(levels)} levels, "
          f"{OUT.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
