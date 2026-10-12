# Reading and Writing Proteins: sources and verified facts

Facts the series quotes, with page references. Anything not yet checked
against the paper is marked ⚠. Page references come from the claude.ai
learning sessions (Oct 9–11, 2026); re-check each against the PDF before it
goes into prose.

## Papers for piece 1

| Paper | DOI | Role |
|---|---|---|
| Needleman & Wunsch (1970), J. Mol. Biol. 48:443 | 10.1016/0022-2836(70)90057-4 | The spine of piece 1 |
| Gibbs & McIntyre (1970), Eur. J. Biochem. 16:1 | 10.1111/j.1432-1033.1970.tb01046.x | The dot plot ("diagram"). Received May 1970 |
| Fitch (1966), J. Mol. Biol. 16:9 | 10.1016/S0022-2836(66)80258-9 | Fixed windows and minimum mutations |
| Eddy (2004), Nat. Biotechnol. 22:909 | 10.1038/nbt0704-909 | DP primer with a C reference implementation |
| Hagen (2000), Nat. Rev. Genet. 1:231 | 10.1038/35042090 | Origins of bioinformatics |
| Strasser (2010), J. Hist. Biol. 43:623 | 10.1007/s10739-009-9221-0 | Dayhoff's Atlas; the best history source |

Still to read: Sankoff (1972) PNAS 10.1073/pnas.69.1.4; Sellers (1974) SIAM
10.1137/0126070 (paywalled); Smith, Waterman & Fitch (1981)
10.1007/BF01733210; Kruskal (1983) SIAM Rev. 10.1137/1025045; Needleman &
Blair (1969) 10.1073/pnas.63.4.1227; Zuckerkandl & Pauling (1965) J. Theor.
Biol. 8:357; Reeck et al. (1987) Cell 50:667 (homology versus similarity).

Asimov already published Ella Watkins-Dulaney's "A Brief History of
Bioinformatics Software" (April 2026), which covers Dayhoff, the Atlas,
Needleman–Wunsch and Feng–Doolittle in prose. Link to it for the people.

## Needleman & Wunsch (1970)

- Received 21 July 1969, published March 1970. FORTRAN on a CDC 3400 (p. 447).
- Pathway rule: both indices increase, one by exactly 1, the other by 1 or
  more. A larger jump is a gap (p. 444). Pathways may start anywhere on the
  first row or column, so end gaps are free (p. 444).
- The grid is filled backward from the C-terminus. Each cell adds the maximum
  over its whole sub-row and sub-column (Fig. 1, p. 445). This is not the
  modern three-neighbour recurrence.
- The gap penalty is "a number subtracted for every gap made… a barrier"
  (p. 444).
- Four pair types by shared codon bases (3/2/1/0); type 3 = 1.0, type 0 = 0
  (pp. 446–447). Seven "variable sets" (Table 1, p. 449).
- Shuffle test: only β (and ribonuclease) randomized, 10 times, because of
  computer time (p. 448). Significance cutoff X > 3 (p. 448).
- Set 1, no penalty: 63 matched with at least 35 gaps. Braunitzer's two-gap
  hand alignment matched 37. Set 2, penalty 1: 38 (42 matched − 4 gaps), where
  Braunitzer's alignment would score 35 (p. 450).
- Set 4: Braunitzer 88.6 against the method's 89.63. Minimum of 166 point
  mutations (pp. 450–451).
- Ribonuclease against lysozyme: not significant in 6 of 7 sets (Table 2,
  p. 450).
- "no a priori best set of cell and operation values" (p. 452), the handoff to
  piece 2.
- "intuitive rationalization" (p. 443), describing alignment before 1970.
- ⚠ Fig. 1 letters: OCR reads the columns as `ABCNJROCLCRPM` (the "O" may be a
  "Q") and the rows as `AJCJNRCKCRBP`, with a maximum match of 8.

## Gibbs & McIntyre (1970)

- Sequences on adjacent edges, N-termini at the top left, a dot at every
  identical pair. Similar stretches show as diagonal runs. "Can be done by hand
  if necessary." MATCH program in FORTRAN IV (p. 1).
- Credits the idea to "a method for detecting parts missing from sequences
  suggested to Fitch by Dr. Saul Needleman" (p. 1).
- Human against *R. rubrum* cytochrome c: matches on three diagonals, so parts
  of one sequence are missing from the other (p. 1).
- Two tests, run lengths against chance and diagonal totals against chance,
  used to classify 25 cytochromes (pp. 1, 3–4). The rattlesnake–primate
  oddity (p. 4).
- Insect cytochromes: unbroken runs of 29 and 20 (p. 4).
- Warns about repeat claims that "rely on the addition of gaps" (p. 5).
  Criticises Fitch's mutation scoring for catching polar/non-polar patterns
  (p. 8).
- No window filter in this paper. The filter is usually credited to Maizel &
  Lenk (1981) and Staden (1982) ⚠.

## Fitch (1966)

- "throw the homologous relation out of register" (p. 9).
- Window length 30. α (141) against β (146) gives 112 × 117 = 13,104 window
  pairs (p. 10).
- Register shifts −5 (81 hits), +1 (38), −1 (10) (Table 2, p. 14). β has one
  extra N-terminal residue; a 2-residue β deletion near 20 shifts to +1, and a
  later 6-residue α deletion gives −5 (p. 14).
- Gaps were inferred from where the shift changed. They were never placed.

## History (Strasser 2010)

Pages 623–630 are exact; later pages are approximate.

- Comparing sequences began with function (active sites): Sanger's insulins
  (p. 626), Tuppy, the Blombäcks' 22 mammals, Anfinsen (pp. 626–627). Tuppy's
  distance idea, around 1958 (p. 628).
- The 1965 Atlas: just under 100 pages, about 70 proteins, punch cards. The
  one-letter code was adopted for memory and for fixed-width printers
  (~pp. 638–642).
- Dayhoff & Eck's 1966 cytochrome c tree came before Fitch & Margoliash (1967)
  (~p. 647). Braunitzer: "I am not a theorizer" (~p. 648).

## Order of events

The dot plot (submitted May 1970) did not come before Needleman–Wunsch
(received July 1969, published March 1970). The two were parallel, and both
trace back to Needleman's suggestion to Fitch. Piece 1 teaches the dot plot
first because it is simpler, and the prose must not call it earlier.

## Sequences

Mature chains from UniProt, initiator Met removed:

| Chain | UniProt | Length | Structure |
|---|---|---|---|
| Human β-hemoglobin | P68871 | 146 | 4HHB (deoxy Hb) |
| Sperm whale myoglobin | P02185 | 153 | 1A6M |
| Human α-hemoglobin | P69905 | 141 | 4HHB |

The sequences used in the 1960s differ in places, so exact agreement with
1970 numbers is not expected.

## Computed numbers

Illustrations computed on today's sequences, not figures from the papers.

- Possible alignments: 6 × 6 gives 8,989; 20 × 20 about 2.6 × 10¹⁴;
  146 × 153 about 10¹¹³.
- β against myoglobin, best single slide: 30 identical pairs.
- The 1970 algorithm (identity scoring, a penalty per gap of any length, free
  end gaps): 63 matches with no penalty (36 gaps on the path found); with
  penalty 1, a score of 37 from 40 matches and 3 gaps; with penalty 2, 34 from
  36 matches and 1 gap. The paper's penalty-1 result is 38 (42 − 4). Gap
  counts depend on how ties are broken.
- β against α, penalty 1: 60 (63 matches, 3 gaps).
- 100 shuffles of β against myoglobin: best with no gaps 16.6 on average (real
  30); gap cost 1, 27.5 (real 36 with one gap); free gaps, 55.9 (real 63; the
  paper reported 55.6 against 63).
- Diagonal runs of 3 or more: real 6, shuffled mean 6.4. α against β, runs of
  4 or more: 3 against 0.6.
- Dot plot of β against myoglobin: 1,533 dots at window 1 for the real pair
  and every shuffle. At w = 20, t = 7: 21 hits, all within 2 diagonals of the
  main one, against about 5.5 scattered hits for shuffles.
- Phone-length fragments (10–12 β residues): the best β/myoglobin fragments
  score 3 for a slide and 4 with one gap. The β 11–30 / myoglobin 10–31
  fragment scores 6 for the best slide, 7 with gap cost 1 and 11 with free
  gaps.

## Open items

- ⚠ Cytochrome c difference counts (human–chimp 0, rhesus 1, horse 12) come
  from teaching materials. Recompute from UniProt.
- ⚠ The "F8" label for myoglobin His93 is from memory.
- ⚠ Ingram (1961), "Gene Evolution and the Hæmoglobins": title confirmed,
  paper not read.
- ⚠ Window-filter attribution (above).
