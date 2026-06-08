#!/usr/bin/env python3
"""Generate a synthetic heme-oxygenation morph as a multi-MODEL PDB.

Reads the vendored deoxy-hemoglobin structure (2HHB), isolates ONE heme
pocket — HEM A 142 + its proximal histidine (HIS A 87) — and synthesizes the
deoxy -> oxy "tightening" as a frame-by-frame trajectory:

  - the Fe snaps from out-of-plane (domed, pulled toward the proximal His)
    DOWN INTO the porphyrin plane,
  - the macrocycle core flattens,
  - the proximal His is dragged along with the Fe (the mechanical tug that
    propagates the T -> R quaternary change), and
  - an O2 molecule flies in from the distal face and docks onto the Fe.

The in-between frames are linearly interpolated — "cartoon-honest", not
crystallographic. Mol*'s AnimateModelIndex plays multi-model trajectories
frame-by-frame WITHOUT tweening, so every intermediate frame is baked here.

Output: public/structures/heme-oxygenation-morph.pdb
"""

import math
import os

# --- which pocket to extract (chain A heme + its proximal His) --------------
HEM_CHAIN, HEM_RESSEQ = "A", 142
HIS_CHAIN, HIS_RESSEQ = "A", 87

# --- tuning knobs (legibility vs. fidelity) ---------------------------------
N_FRAMES = 31            # baked frames in the trajectory
FLATTEN_FRAC = 0.6       # how far the domed core relaxes toward planar (0..1)
O2_DOCK_FE = 1.8         # docked Fe–O distance (Angstrom)
O2_BOND = 1.21           # O=O distance (Angstrom)
O2_BEND_DEG = 30.0       # tilt of the distal O off the Fe–O axis
O2_START_FE = 6.0        # how far out the O2 starts (approaching, unbound)

# The 24 atoms of the porphyrin macrocycle core that flatten. Peripheral
# substituents (methyls, vinyls, propionates) are left static.
CORE_NAMES = {
    "NA", "NB", "NC", "ND",
    "C1A", "C2A", "C3A", "C4A",
    "C1B", "C2B", "C3B", "C4B",
    "C1C", "C2C", "C3C", "C4C",
    "C1D", "C2D", "C3D", "C4D",
    "CHA", "CHB", "CHC", "CHD",
}
RING_N_NAMES = ["NA", "NB", "NC", "ND"]

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "public", "structures", "2HHB.pdb")
OUT = os.path.join(ROOT, "public", "structures", "heme-oxygenation-morph.pdb")


# --- tiny vector helpers (no numpy dependency) ------------------------------
def sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def add(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def scale(a, s):
    return (a[0] * s, a[1] * s, a[2] * s)


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def norm(a):
    return math.sqrt(dot(a, a))


def unit(a):
    n = norm(a)
    return (a[0] / n, a[1] / n, a[2] / n) if n else (0.0, 0.0, 0.0)


def lerp(a, b, t):
    return add(scale(a, 1 - t), scale(b, t))


# --- PDB parsing (preserve the raw line; only coordinates change) -----------
class Atom:
    __slots__ = ("raw", "name", "xyz")

    def __init__(self, raw):
        self.raw = raw.rstrip("\n").ljust(80)
        self.name = self.raw[12:16].strip()
        self.xyz = (
            float(self.raw[30:38]),
            float(self.raw[38:46]),
            float(self.raw[46:54]),
        )

    def line_at(self, xyz, serial=None):
        head = self.raw[:30]
        if serial is not None:
            head = head[:6] + ("%5d" % serial) + head[11:]
        return "%s%8.3f%8.3f%8.3f%s" % (head, xyz[0], xyz[1], xyz[2], self.raw[54:])


def read_pocket():
    hem, his = [], []
    with open(SRC) as fh:
        for line in fh:
            rec = line[:6]
            if rec not in ("ATOM  ", "HETATM"):
                continue
            res = line[17:20].strip()
            chain = line[21]
            try:
                resseq = int(line[22:26])
            except ValueError:
                continue
            if res == "HEM" and chain == HEM_CHAIN and resseq == HEM_RESSEQ:
                hem.append(Atom(line))
            elif res == "HIS" and chain == HIS_CHAIN and resseq == HIS_RESSEQ:
                his.append(Atom(line))
    return hem, his


def newell_normal(points):
    """Robust plane normal of a (roughly planar) polygon."""
    nx = ny = nz = 0.0
    m = len(points)
    for i in range(m):
        a, b = points[i], points[(i + 1) % m]
        nx += (a[1] - b[1]) * (a[2] + b[2])
        ny += (a[2] - b[2]) * (a[0] + b[0])
        nz += (a[0] - b[0]) * (a[1] + b[1])
    return unit((nx, ny, nz))


def build_o2_atom(name, serial, xyz):
    return (
        "HETATM"
        + ("%5d" % serial)
        + " "
        + (" %-3s" % name)   # cols 13-16
        + " "                # altLoc
        + "OXY"              # resName
        + " "
        + "A"                # chainID
        + ("%4d" % 200)      # resSeq
        + "    "             # iCode + pad
        + "%8.3f%8.3f%8.3f" % (xyz[0], xyz[1], xyz[2])
        + "%6.2f%6.2f" % (1.0, 20.0)
        + "          "
        + " O"               # element (cols 77-78)
    )


def main():
    hem, his = read_pocket()
    by_name = {a.name: a for a in hem}

    fe = by_name["FE"].xyz
    ring_pts = [by_name[n].xyz for n in RING_N_NAMES]
    centroid = scale((sum(p[0] for p in ring_pts),
                      sum(p[1] for p in ring_pts),
                      sum(p[2] for p in ring_pts)), 1.0 / 4.0)
    n = newell_normal(ring_pts)

    # Orient the normal toward the proximal His (the side the deoxy Fe is
    # pulled to). The distal face — where O2 binds — is then -n.
    his_ne2 = next(a.xyz for a in his if a.name == "NE2")
    if dot(sub(his_ne2, centroid), n) < 0:
        n = scale(n, -1.0)
    distal = scale(n, -1.0)

    # Fe's out-of-plane displacement (signed, along n). Target = in-plane.
    d_fe = dot(sub(fe, centroid), n)
    fe_target = sub(fe, scale(n, d_fe))
    fe_disp = sub(fe_target, fe)          # inward pull applied to Fe AND His

    print("Fe out-of-plane displacement: %.3f A (toward proximal His)" % d_fe)

    # O2 geometry: dock on the distal face, slightly bent off the Fe–O axis.
    # Pick any unit vector perpendicular to the distal axis for the bend.
    seed = (1.0, 0.0, 0.0) if abs(distal[0]) < 0.9 else (0.0, 1.0, 0.0)
    perp = unit(cross(distal, seed))
    bend = math.radians(O2_BEND_DEG)
    bent = unit(add(scale(distal, math.cos(bend)), scale(perp, math.sin(bend))))

    o1_dock = add(fe_target, scale(distal, O2_DOCK_FE))
    o2_dock = add(o1_dock, scale(bent, O2_BOND))
    o1_start = add(fe, scale(distal, O2_START_FE))
    o2_start = add(o1_start, scale(bent, O2_BOND))

    # Precompute each atom's per-frame endpoints (start -> end).
    moves = []  # (atom, start_xyz, end_xyz)
    for a in hem:
        if a.name == "FE":
            moves.append((a, a.xyz, fe_target))
        elif a.name in CORE_NAMES:
            perp_d = dot(sub(a.xyz, centroid), n)
            flat = sub(a.xyz, scale(n, FLATTEN_FRAC * perp_d))
            moves.append((a, a.xyz, flat))
        else:
            moves.append((a, a.xyz, a.xyz))  # substituents static
    for a in his:
        moves.append((a, a.xyz, add(a.xyz, fe_disp)))  # His dragged with Fe

    lines = [
        "REMARK  Synthetic heme-oxygenation morph (deoxy -> oxy).",
        "REMARK  Generated by scripts/generate_heme_morph.py from 2HHB (HEM A 142).",
        "REMARK  Frames are interpolated for teaching; not crystallographic.",
    ]
    for f in range(N_FRAMES):
        t = f / (N_FRAMES - 1)
        lines.append("MODEL     %4d" % (f + 1))
        serial = 1
        for a, p0, p1 in moves:
            lines.append(a.line_at(lerp(p0, p1, t), serial=serial))
            serial += 1
        lines.append(build_o2_atom("O1", serial, lerp(o1_start, o1_dock, t)))
        serial += 1
        lines.append(build_o2_atom("O2", serial, lerp(o2_start, o2_dock, t)))
        serial += 1
        lines.append("ENDMDL")
    lines.append("END")

    with open(OUT, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print("Wrote %d frames (%d atoms each) -> %s"
          % (N_FRAMES, len(moves) + 2, os.path.relpath(OUT, ROOT)))


if __name__ == "__main__":
    main()
