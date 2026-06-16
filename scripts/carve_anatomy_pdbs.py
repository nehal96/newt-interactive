#!/usr/bin/env python3
"""Carve the later anatomy build-up structures out of deoxy-hemoglobin (2HHB).

The early beats (iron, iron-pyrrole, iron-porphyrin) were carved by hand with
coordinates preserved; this script carves the *later* beats the same way so they
stay spatially aligned with them (proximal His below the ring, distal His
hovering above, the real chain-A pocket geometry):

  - porphyrin-proximal-his.pdb : porphyrin core + Fe + the proximal His (F8).
  - porphyrin-both-his.pdb     : porphyrin core + Fe + proximal AND distal His.
  - heme-pocket.pdb            : the FULL heme (side chains included) + both His
                                 — "this whole thing makes the heme group".
  - four-heme-pockets.pdb      : all FOUR pockets (heme + both His) in their real
                                 2HHB positions — "a hemoglobin has four of these".

Atoms are copied verbatim from 2HHB (raw line, only the serial is renumbered)
so element columns and naming survive untouched. Bonds are emitted as CONECT
records from distance-based detection (covalent-radius sum + tolerance, with Fe
wide enough to catch its ~2.0-2.1 A coordinate bonds), matching the explicit
CONECT style of the hand-carved iron-pyrrole / iron-porphyrin files. Bonds are
computed per pocket so the four-pocket file never bonds across subunits.

Output: public/structures/{porphyrin-proximal-his,porphyrin-both-his,
heme-pocket,four-heme-pockets}.pdb
"""

import math
import os

# --- the chain-A pocket the single-pocket beats are carved from -------------
HEM_CHAIN, HEM_RESSEQ = "A", 142
PROX_CHAIN, PROX_RESSEQ = "A", 87  # proximal His (F8) — the Fe's 5th ligand
DIST_CHAIN, DIST_RESSEQ = "A", 58  # distal His (E7) — hovers over the binding site

# All four pockets, in their real 2HHB positions. Alpha chains (A, C) number the
# heme 142 with His 87 (proximal) / 58 (distal); beta chains (B, D) number it 148
# with His 92 (proximal) / 63 (distal).
POCKETS = [
    {"chain": "A", "hem": 142, "prox": 87, "dist": 58},  # alpha 1
    {"chain": "B", "hem": 148, "prox": 92, "dist": 63},  # beta 1
    {"chain": "C", "hem": 142, "prox": 87, "dist": 58},  # alpha 2
    {"chain": "D", "hem": 148, "prox": 92, "dist": 63},  # beta 2
]

# The porphyrin core (no peripheral substituents): 4 pyrrole rings + 4 methine
# bridges + the four ring nitrogens + Fe. Same set as iron-porphyrin.pdb.
CORE_NAMES = {
    "FE",
    "NA", "NB", "NC", "ND",
    "C1A", "C2A", "C3A", "C4A",
    "C1B", "C2B", "C3B", "C4B",
    "C1C", "C2C", "C3C", "C4C",
    "C1D", "C2D", "C3D", "C4D",
    "CHA", "CHB", "CHC", "CHD",
}

# Covalent radii (Cordero et al., Angstrom) + a generous tolerance. Fe's radius
# is wide enough that Fe-N coordinate bonds (~2.0-2.1 A) register as bonds while
# Fe-C(meso) (~3.4 A) does not.
COVALENT_R = {"H": 0.31, "C": 0.76, "N": 0.71, "O": 0.66, "FE": 1.32, "S": 1.05}
BOND_TOL = 0.45

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "public", "structures", "2HHB.pdb")
OUT_DIR = os.path.join(ROOT, "public", "structures")


class Atom:
    __slots__ = ("raw", "name", "element", "xyz")

    def __init__(self, raw):
        self.raw = raw.rstrip("\n").ljust(80)
        self.name = self.raw[12:16].strip()
        self.element = self.raw[76:78].strip().upper() or self.name[0].upper()
        self.xyz = (
            float(self.raw[30:38]),
            float(self.raw[38:46]),
            float(self.raw[46:54]),
        )

    def line(self, serial):
        head = self.raw[:6] + ("%5d" % serial) + self.raw[11:]
        return head


def read_residues(wanted):
    """Read 2HHB once; return {(chain, resseq): [Atom, ...]} for wanted keys."""
    out = {key: [] for key in set(wanted)}
    with open(SRC) as fh:
        for line in fh:
            if line[:6] not in ("ATOM  ", "HETATM"):
                continue
            chain = line[21]
            try:
                resseq = int(line[22:26])
            except ValueError:
                continue
            key = (chain, resseq)
            if key in out:
                out[key].append(Atom(line))
    return out


def dist(a, b):
    return math.sqrt(
        (a.xyz[0] - b.xyz[0]) ** 2
        + (a.xyz[1] - b.xyz[1]) ** 2
        + (a.xyz[2] - b.xyz[2]) ** 2
    )


def bonded(a, b):
    ra = COVALENT_R.get(a.element, 0.77)
    rb = COVALENT_R.get(b.element, 0.77)
    d = dist(a, b)
    # Guard against degenerate (overlapping) atoms.
    return 0.4 < d <= ra + rb + BOND_TOL


def conect_records(atoms, base=0):
    """Distance-based CONECT lines for one atom group (serials offset by `base`)."""
    n = len(atoms)
    neighbors = {i: [] for i in range(n)}
    for i in range(n):
        for j in range(i + 1, n):
            if bonded(atoms[i], atoms[j]):
                neighbors[i].append(j)
                neighbors[j].append(i)
    lines = []
    for i in range(n):
        if not neighbors[i]:
            continue
        # PDB allows up to 4 bonded serials per CONECT; wrap if a hub (Fe) has more.
        partners = sorted(neighbors[i])
        for k in range(0, len(partners), 4):
            chunk = partners[k : k + 4]
            lines.append(
                "CONECT"
                + ("%5d" % (base + i + 1))
                + "".join("%5d" % (base + p + 1) for p in chunk)
            )
    return lines


def write_pdb(path, header, remarks, groups):
    """Write atom groups to a PDB. Serials run sequentially across all groups,
    but CONECT bonds are computed *within* each group, so multi-pocket files
    never bond across subunits."""
    atom_lines, conect_lines, serial = [], [], 0
    for group in groups:
        base = serial
        for a in group:
            serial += 1
            atom_lines.append(a.line(serial))
        conect_lines += conect_records(group, base=base)
    body = (
        ["HEADER    " + header]
        + ["REMARK    " + r for r in remarks]
        + atom_lines
        + conect_lines
        + ["END"]
    )
    with open(path, "w") as fh:
        fh.write("\n".join(body) + "\n")
    print(
        "Wrote %3d atoms in %d group(s) -> %s"
        % (serial, len(groups), os.path.relpath(path, ROOT))
    )


def main():
    # The single chain-A pocket the build-up beats are carved from.
    res = read_residues(
        [
            (HEM_CHAIN, HEM_RESSEQ),
            (PROX_CHAIN, PROX_RESSEQ),
            (DIST_CHAIN, DIST_RESSEQ),
        ]
    )
    heme_full = res[(HEM_CHAIN, HEM_RESSEQ)]
    prox = res[(PROX_CHAIN, PROX_RESSEQ)]
    dist_his = res[(DIST_CHAIN, DIST_RESSEQ)]
    heme_core = [a for a in heme_full if a.name in CORE_NAMES]
    assert heme_core and prox and dist_his, "chain-A pocket not found in 2HHB.pdb"

    write_pdb(
        os.path.join(OUT_DIR, "porphyrin-proximal-his.pdb"),
        "PORPHYRIN + PROXIMAL HISTIDINE (chain-A pocket from 2HHB, anatomy build-up)",
        [
            "Porphyrin core (Fe + 4 pyrroles + 4 methine bridges) + the proximal",
            "histidine (HIS A 87, F8) carved from 2HHB, coordinates preserved.",
            "The Fe-NE2 link is the ~2.1A coordinate bond to the protein chain.",
        ],
        [heme_core + prox],
    )
    write_pdb(
        os.path.join(OUT_DIR, "porphyrin-both-his.pdb"),
        "PORPHYRIN + PROXIMAL & DISTAL HISTIDINES (chain-A pocket from 2HHB)",
        [
            "Porphyrin core + proximal His (HIS A 87, below) + distal His",
            "(HIS A 58, hovering above the binding site) carved from 2HHB,",
            "coordinates preserved. The distal His is unbonded — it only hovers.",
        ],
        [heme_core + prox + dist_his],
    )
    write_pdb(
        os.path.join(OUT_DIR, "heme-pocket.pdb"),
        "HEME GROUP + BOTH HISTIDINES (full chain-A pocket from 2HHB)",
        [
            "The complete heme (porphyrin core + methyl/vinyl/propionate side",
            "chains) plus the proximal and distal histidines, carved from 2HHB",
            "chain-A, coordinates preserved. This is the assembled heme pocket.",
        ],
        [heme_full + prox + dist_his],
    )

    # All four pockets in their real quaternary positions.
    wanted = []
    for p in POCKETS:
        wanted += [(p["chain"], p["hem"]), (p["chain"], p["prox"]), (p["chain"], p["dist"])]
    res4 = read_residues(wanted)
    groups = []
    for p in POCKETS:
        group = (
            res4[(p["chain"], p["hem"])]
            + res4[(p["chain"], p["prox"])]
            + res4[(p["chain"], p["dist"])]
        )
        assert all(
            res4[(p["chain"], r)] for r in (p["hem"], p["prox"], p["dist"])
        ), ("pocket %s incomplete in 2HHB.pdb" % p["chain"])
        groups.append(group)
    write_pdb(
        os.path.join(OUT_DIR, "four-heme-pockets.pdb"),
        "FOUR HEME POCKETS (whole-molecule quaternary arrangement from 2HHB)",
        [
            "All four heme groups (full heme + proximal & distal His) in their",
            "real 2HHB positions: alpha 1 (A), beta 1 (B), alpha 2 (C), beta 2 (D).",
            "Bonds are computed per pocket, so none cross between subunits.",
        ],
        groups,
    )


if __name__ == "__main__":
    main()
