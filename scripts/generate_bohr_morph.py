#!/usr/bin/env python3
"""Generate a synthetic Bohr salt-bridge morph as a multi-MODEL PDB.

Reads the vendored deoxy-hemoglobin structure (2HHB) and isolates ONE Bohr
clasp — the β-chain C-terminal His146 (HC3) and its partner Asp94 (FG1), whose
imidazole↔carboxylate salt bridge helps lock the tense (T) state. It then
synthesizes the "an incoming proton makes the clasp" story as a frame-by-frame
trajectory:

  - an H⁺ flies in from the solvent side and docks onto the His imidazole
    (protonating it — the charge that makes the bridge), and
  - the His side chain swings about its Cβ from a slightly-open start pose into
    the crystallographic clasp with Asp94, closing the salt bridge.

The His backbone and the whole Asp residue are held fixed; only the imidazole
ring (Cγ, Nδ1, Cδ2, Cε1, Nε2) swings, and the proton flies. In-between frames
are linearly interpolated — "cartoon-honest", not crystallographic, the same
convention as generate_heme_morph.py. Mol*'s AnimateModelIndex plays multi-model
trajectories frame-by-frame WITHOUT tweening, so every frame is baked here.

Output:
  public/structures/bohr-salt-bridge-morph.pdb
"""

import math
import os

# --- which clasp to extract (β-chain His146 + its Asp94 partner) ------------
HIS_CHAIN, HIS_RESSEQ = "B", 146  # β His146 (HC3) — protonates, swings to clasp
ASP_CHAIN, ASP_RESSEQ = "B", 94   # β Asp94 (FG1) — the carboxylate it bridges to

# The imidazole ring atoms that swing (the side chain past Cβ). Cβ and the
# backbone stay fixed, so the ring rotates about Cβ like a real χ2 wag.
RING_NAMES = ["CG", "ND1", "CD2", "CE1", "NE2"]
HIS_N_NAMES = ["ND1", "NE2"]  # the two protonatable ring nitrogens

# --- tuning knobs (legibility vs. fidelity) ---------------------------------
N_FRAMES = 31           # baked frames in the trajectory
SWING_DEG = 26.0        # how far open the imidazole starts, swung off the clasp
H_BOND = 1.0            # docked N–H distance (Angstrom)
H_START_OUT = 3.4       # how far out along the solvent axis the proton starts

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "public", "structures", "2HHB.pdb")
OUT = os.path.join(ROOT, "public", "structures", "bohr-salt-bridge-morph.pdb")


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


def rotate_about(point, pivot, axis, ang):
    """Rodrigues rotation of `point` about `axis` (unit) through `pivot`."""
    p = sub(point, pivot)
    c, s = math.cos(ang), math.sin(ang)
    term1 = scale(p, c)
    term2 = scale(cross(axis, p), s)
    term3 = scale(axis, dot(axis, p) * (1 - c))
    return add(pivot, add(add(term1, term2), term3))


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


def read_residue(chain, resseq, resname):
    atoms = []
    with open(SRC) as fh:
        for line in fh:
            if line[:6] not in ("ATOM  ", "HETATM"):
                continue
            if line[17:20].strip() != resname or line[21] != chain:
                continue
            try:
                if int(line[22:26]) != resseq:
                    continue
            except ValueError:
                continue
            atoms.append(Atom(line))
    return atoms


def build_proton(serial, xyz):
    """A lone H⁺, its own residue so the player can isolate + track it."""
    return (
        "HETATM"
        + ("%5d" % serial)
        + " "
        + (" %-3s" % "H1")    # cols 13-16
        + " "                 # altLoc
        + "HPL"               # resName (the proton)
        + " "
        + HIS_CHAIN
        + ("%4d" % 300)       # resSeq
        + "    "              # iCode + pad
        + "%8.3f%8.3f%8.3f" % (xyz[0], xyz[1], xyz[2])
        + "%6.2f%6.2f" % (1.0, 20.0)
        + "          "
        + " H"                # element (cols 77-78)
    )


def main():
    his = read_residue(HIS_CHAIN, HIS_RESSEQ, "HIS")
    asp = read_residue(ASP_CHAIN, ASP_RESSEQ, "ASP")
    if not his or not asp:
        raise SystemExit("Could not find His146/Asp94 in %s" % SRC)

    his_by = {a.name: a for a in his}
    asp_by = {a.name: a for a in asp}
    cb = his_by["CB"].xyz
    asp_os = [asp_by[n].xyz for n in ("OD1", "OD2") if n in asp_by]

    # The bridging His N + Asp O are the closest N/O pair; the proton docks onto
    # the OTHER ring N (the solvent-facing one).
    pairs = [
        (his_by[n].xyz, o, n) for n in HIS_N_NAMES if n in his_by for o in asp_os
    ]
    bridge_n_xyz, bridge_o, bridge_n_name = min(
        pairs, key=lambda t: norm(sub(t[0], t[1]))
    )
    proton_n_name = next(n for n in HIS_N_NAMES if n != bridge_n_name)
    proton_n_xyz = his_by[proton_n_name].xyz

    # Swing axis: rotate the ring about Cβ so the bridging N moves toward/away
    # from the Asp carboxylate. Pick the sign that OPENS the clasp at the start.
    axis = unit(cross(sub(bridge_n_xyz, cb), sub(bridge_o, bridge_n_xyz)))
    open_ang = math.radians(SWING_DEG)
    moved = rotate_about(bridge_n_xyz, cb, axis, open_ang)
    if norm(sub(moved, bridge_o)) < norm(sub(bridge_n_xyz, bridge_o)):
        open_ang = -open_ang  # that sign closed it; flip to open

    print(
        "Bridge: His %s ... Asp O  (%.2f A in crystal); proton docks on His %s"
        % (bridge_n_name, norm(sub(bridge_n_xyz, bridge_o)), proton_n_name)
    )

    # Proton path: from out along the solvent axis (away from Asp) in to an N–H
    # bond off the solvent-facing ring N. Computed against the CLOSED ring; the
    # ring barely moves near the proton N, so this reads fine.
    solvent_dir = unit(sub(proton_n_xyz, bridge_o))
    h_end = add(proton_n_xyz, scale(solvent_dir, H_BOND))
    h_start = add(proton_n_xyz, scale(solvent_dir, H_START_OUT))

    # Per-atom endpoints. The ring swings open→closed; everything else is fixed.
    ring = set(RING_NAMES)
    moves = []  # (atom, start_xyz, end_xyz)
    for a in his:
        if a.name in ring:
            start = rotate_about(a.xyz, cb, axis, open_ang)
            moves.append((a, start, a.xyz))
        else:
            moves.append((a, a.xyz, a.xyz))
    for a in asp:
        moves.append((a, a.xyz, a.xyz))

    lines = [
        "REMARK  Synthetic Bohr salt-bridge morph (proton makes the clasp).",
        "REMARK  Generated by scripts/generate_bohr_morph.py from 2HHB",
        "REMARK    (His %s %d + Asp %s %d)." % (HIS_CHAIN, HIS_RESSEQ, ASP_CHAIN, ASP_RESSEQ),
        "REMARK  Frames are interpolated for teaching; not crystallographic.",
    ]
    for f in range(N_FRAMES):
        t = f / (N_FRAMES - 1)
        lines.append("MODEL     %4d" % (f + 1))
        serial = 1
        for a, p0, p1 in moves:
            lines.append(a.line_at(lerp(p0, p1, t), serial=serial))
            serial += 1
        lines.append(build_proton(serial, lerp(h_start, h_end, t)))
        lines.append("ENDMDL")
    lines.append("END")

    with open(OUT, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print(
        "Wrote %d frames (%d atoms each) -> %s"
        % (N_FRAMES, len(moves) + 1, os.path.relpath(OUT, ROOT))
    )


if __name__ == "__main__":
    main()
