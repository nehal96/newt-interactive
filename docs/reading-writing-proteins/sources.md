# Reading and Writing Proteins: sources and verified facts

Facts the series quotes, with journal page numbers. Everything in the five
paper sections below was checked against the page images of the PDFs on
2026-10-12. Anything not yet checked is marked ⚠.

## Papers for piece 1

| Paper | DOI | Role | Checked |
|---|---|---|---|
| Needleman & Wunsch (1970), "A general method applicable to the search for similarities in the amino acid sequence of two proteins", J. Mol. Biol. 48:443–453 | 10.1016/0022-2836(70)90057-4 | The spine of piece 1 | ✓ |
| Gibbs & McIntyre (1970), "The diagram, a method for comparing sequences", Eur. J. Biochem. 16:1–11 | 10.1111/j.1432-1033.1970.tb01046.x | The dot plot | ✓ |
| Fitch (1966), "An improved method of testing for evolutionary homology", J. Mol. Biol. 16:9–16 | 10.1016/S0022-2836(66)80258-9 | Fixed windows and minimum mutations | ✓ |
| Eddy (2004), "What is dynamic programming?", Nat. Biotechnol. 22:909–910 | 10.1038/nbt0704-909 | DP primer | ✓ |
| Hagen (2000), "The origins of bioinformatics", Nat. Rev. Genet. 1:231–236 | 10.1038/35042090 | History, to 1970 | ✓ |
| Strasser (2010), J. Hist. Biol. 43:623 | 10.1007/s10739-009-9221-0 | Dayhoff's Atlas | ⚠ not uploaded |

Still to read: Sankoff (1972) PNAS 10.1073/pnas.69.1.4; Sellers (1974) SIAM
10.1137/0126070 (paywalled); Smith, Waterman & Fitch (1981)
10.1007/BF01733210; Kruskal (1983) SIAM Rev. 10.1137/1025045; Needleman &
Blair (1969) PNAS 63:1227, 10.1073/pnas.63.4.1227 (N&W print the page as
"1127"); Fitch (1969) Biochem. Genet. 3:99, which carries Needleman's
suggestion; Fitch (1966) J. Mol. Biol. 16:17, the hemoglobin repeat paper
Gibbs & McIntyre criticise; Zuckerkandl & Pauling (1965) J. Theor. Biol.
8:357; Braunitzer (1965), in *Evolving Genes and Proteins*, p. 183; Reeck et
al. (1987) Cell 50:667.

Asimov already published Ella Watkins-Dulaney's "A Brief History of
Bioinformatics Software" (April 2026), which covers Dayhoff, the Atlas,
Needleman–Wunsch and Feng–Doolittle in prose. Link to it for the people.

## Needleman & Wunsch (1970)

### Dates and machine

- "(Received 21 July 1969)" (p. 443). The paper prints only "(1970)"; the
  month of publication is not in it.
- "The FORTRAN programs used in this study were written for the CDC3400
  computer." (p. 447). No run time is given.

### Definitions

- "The maximum match can be defined as the largest number of amino acids of
  one protein that can be matched with those of another protein while
  allowing for all possible deletions." (p. 443)
- "While the interruptions give rise to a very large number of comparisons,
  the method efficiently excludes from consideration those comparisons that
  cannot contribute to the maximum match." (abstract, p. 443)
- "Because the method of visual comparison is tedious and because the
  determination of the significance of a given result usually is left to
  intuitive rationalization, computer-based statistical approaches have been
  proposed (Fitch, 1966; Needleman & Blair, 1969)." (p. 443). The phrase is
  about judging significance, so it belongs with the shuffle test.
- "Allowance for gaps (Braunitzer, 1965) greatly multiplies the number of
  comparisons that can be made but introduces unnecessary and partial
  comparisons." (p. 443)

### The array and pathways

- Protein A runs across the columns (index *j*), protein B down the rows
  (index *i*) (p. 444).
- "A necessary pathway through MAT is defined as one which begins at a cell in
  the first column or the first row. Both i and j must increase in value;
  either i or j must increase by only one but the other index may increase by
  one or more." (p. 444)
- "When MATij and MATmn are part of a pathway, i − m ≠ j − n is a sufficient,
  but not necessary condition for a gap to occur." (p. 444)
- Reordering is forbidden: other relationships "represent permutations of one
  or both amino acid sequences which cannot be allowed since this destroys the
  significance of a sequence." (p. 444)
- The paper never says end gaps are free. It follows from pathways starting
  anywhere on the first row or column and ending when either index reaches its
  limit, and p. 446 adds that the operation "can begin at any of a number of
  points along the borders of the array… the maximum match will be the same."
  Say "follows from"; don't quote the paper as saying it.

### Filling the array

- "The maximum-match pathway can be obtained by beginning at the terminals of
  the sequences (i = y, j = z) and proceeding toward the origins, first by
  adding to the value of each cell possessing indices i = y − 1 and/or j = z −
  1, the maximum value from among all the cells which lie on a pathway to it."
  (p. 444)
- Fig. 1 caption: "The operation of successive summations was begun at the
  last row of the array and proceeded row-by-row towards the first row… The
  enclosed cell in this row is the site of the cell operation which consists
  of a search along the subrow and subcolumn indicated by borders for the
  largest value, 4 in subrow C. This value is added to the cell from which the
  search began." (p. 445)
- Precisely: cell (*i*, *j*) adds the maximum over row *i*+1 from column *j*+1
  onward and column *j*+1 from row *i*+1 onward. This reproduces Fig. 2 cell
  for cell. The text describes an L-shaped order and the figure goes row by
  row; both give the same array.
- The maximum match is the largest number in the first row or column (pp.
  444–445; Fig. 2 caption, p. 445).
- Traceback: "The cells of the array which contributed to the maximum match,
  may be determined by recording the origin of the number that was added to
  each cell when the array was operated upon." (p. 446). It runs from the
  N-termini toward the C-termini.
- The paper gives no tie-breaking rule. Fig. 2 draws both tied pathways.

### Fig. 1 and Fig. 2 (p. 445)

Columns (protein A): `A B C N J R Q C L C R P M`. Rows (protein B):
`A J C J N R C K C R B P`. Maximum match 8. Fig. 1 is a snapshot partway
through the fill, with the working cell at row R, column R. The completed
array (Fig. 2):

```
     A B C N J R Q C L C R P M
A    8 7 6 6 5 4 4 3 3 2 1 0 0
J    7 7 6 6 6 4 4 3 3 2 1 0 0
C    6 6 7 6 5 4 4 4 3 3 1 0 0
J    6 6 6 5 6 4 4 3 3 2 1 0 0
N    5 5 5 6 5 4 4 3 3 2 1 0 0
R    4 4 4 4 4 5 4 3 3 2 2 0 0
C    3 3 4 3 3 3 3 4 3 3 1 0 0
K    3 3 3 3 3 3 3 3 3 2 1 0 0
C    2 2 3 2 2 2 2 3 2 3 1 0 0
R    2 1 1 1 1 2 1 1 1 1 2 0 0
B    1 2 1 1 1 1 1 1 1 1 1 0 0
P    0 0 0 0 0 0 0 0 0 0 0 1 0
```

The two tied pathways, as (row, column): (1,1) → (3,3) → (4,5) or (5,4) →
(6,6) → (7,8) → (9,10) → (10,11) → (12,12).

### The penalty

- "A penalty factor, a number subtracted for every gap made, may be assessed
  as a barrier to allowing the gap. The penalty factor could be a function of
  the size and/or direction of the gap. No gap would be allowed in the
  operation unless the benefit from allowing that gap would exceed the
  barrier." (p. 444)
- "If the value of the penalty were zero, all possible gaps could be allowed.
  If the value were equal to the theoretical value for the maximum match
  between two proteins, it would be impossible to allow a gap and the maximum
  match would be the largest of the values found by simply summing along the
  diagonals of the array; this is the simple frame-shift method." (p. 447).
  Set 7 (penalty 25) is that case.
- The penalty "will exclude from consideration any possible pathway that
  leaves and returns to a principal diagonal, thereby needing two gaps, in
  order to add only one or two amino acids to the maximum match." (p. 450)
- One penalty per gap, whatever its length, in every set.

### Scoring

- Pair types by shared codon bases, defined on p. 447: type 3 identical, type
  2 two shared bases, type 1 one, type 0 none. "The value for type 3 pairs was
  1·0 and the value for type 0 pairs was zero for all variable sets."
- Codons from Marshall et al. (1967); "The UGA, UAA and UAG codons were not
  used, but UUG was used as a codon for leucine." (pp. 447–448)

### Table 1: β-hemoglobin against whale myoglobin (p. 449)

| Set | Type 2 | Type 1 | Penalty | Real | Random mean | s | X | Gaps, real | Gaps, random |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 63·00 | 55·60 | 1·80 | 4·11 | 35 | 36·2 |
| 2 | 0 | 0 | 1·00 | 38·00 | 27·80 | 2·09 | 4·88 | 4 | 5·5 |
| 3 | 0·67 | 0·33 | 0 | 97·00 | 91·47 | 1·55 | 3·57 | 18 | 24·3 |
| 4 | 0·67 | 0·33 | 1·03 | 89·63 | 80·25 | 1·11 | 8·46 | 1 | 3·6 |
| 5 | 0·25 | 0·05 | 0 | 71·55 | 64·78 | 1·59 | 4·27 | 46 | 45·0 |
| 6 | 0·25 | 0·05 | 1·05 | 51·95 | 40·54 | 1·46 | 7·80 | 3 | 7·5 |
| 7 | 0·25 | 0·05 | 25 | 47·30 | 33·80 | 1·52 | 8·87 | 0 | 0 |

The gap columns are headed "Minimum deletions".

- Set 1: "63 amino acids in β-hemoglobin and myoglobin can be matched. To
  attain this match, however, it is necessary to permit at least 35 gaps. In
  contrast, when two gaps are allowed according to Braunitzer (1965), it is
  possible to match only 37 of the amino acids." (pp. 448–450). The paper does
  not say how Braunitzer made his alignment.
- Set 2: the text prints "30 + 4 = 42" (p. 450), a misprint for 38 + 4. Quote
  it only with [sic]. "Braunitzer's comparison would have a value of 37 − 2 =
  35 using this variable set, hence it was not selected by the method." (p.
  450)
- Set 4: "a maximum of 3(89·63 + 1·03) = 272 bases matched, indicating a
  minimum of 438 − 272 = 166 point mutations… placing gaps according to
  Braunitzer, a score of 88·6 was obtained" (p. 451).
- Free gaps inflate chance: under set 1 the shuffles average 55·6, using 36·2
  gaps, against the real 63.
- "the gaps that are allowed are at the N-terminal ends so that about 85% of
  the comparison can be made without gaps." (p. 451)
- Human myoglobin against human β-hemoglobin under set 1 "was not
  significant" (p. 450).

### Table 2: ribonuclease against lysozyme (p. 450)

| Set | Real | Random mean | s | X | Gaps, real | Gaps, random |
|---|---|---|---|---|---|---|
| 1 | 48·00 | 44·20 | 2·56 | 1·48 | 34 | 29·2 |
| 2 | 23·00 | 22·00 | 1·73 | 0·58 | 5 | 5·2 |
| 3 | 78·33 | 76·17 | 0·82 | 2·64 | 21 | 18·8 |
| 4 | 67·93 | 67·37 | 1·27 | 0·43 | 2 | 2·2 |
| 5 | 56·00 | 52·26 | 2·12 | 1·77 | 35 | 35·5 |
| 6 | 33·70 | 33·02 | 1·66 | 0·41 | 8 | 6·8 |
| 7 | 28·15 | 27·67 | 1·75 | 0·22 | 0 | 0 |

None of the seven sets passes the paper's X > 3 cutoff. The paper's own words:
"Set 3 is the only variable set in Table 2 that shows a possible difference"
and "the relationship of ribonuclease to lysozyme in six of the seven
variable sets appears to be truly a random one. It should be noted, however,
that the standard value of the real maximum-match is positive in each
variable set" (p. 451).

### The shuffle test (pp. 446, 448)

- "the amino acid sequence of only one member of the protein pair was
  randomized and the match was repeated. The sequences of β-hemoglobin and
  ribonuclease were the ones randomized… A cycle of sequence
  randomization–maximum-match determination was repeated ten times" (p. 448)
- "The use of a small random sample size (ten) was necessary to hold the
  computer time to a reasonable level. The maximum probable error in a
  standard deviation estimate for a sample this small is quite large and the
  results should be judged with this fact in mind." (p. 448)
- "For this sample size all deviations greater than 3·0 were assumed to
  include less than 1% of the true random population and to indicate a
  significant difference." (p. 448). X is "(real − random)/s" (table
  footnotes, pp. 449–450), with "random" the mean of ten samples.
- The null hypothesis: "that any sequence relationship manifested by the two
  proteins is a random one" (p. 446). Random sequences keep each protein's
  composition (p. 446).

### The limit (p. 452)

"there is no *a priori* best set of cell and operation values for maximizing
the significance of a maximum-match value of homologous proteins… whether the
sequence relationship between proteins is significant depends solely upon the
cell and operation values chosen."

### Their sequences (p. 447, references p. 453)

| Protein | Source |
|---|---|
| Human β-hemoglobin | Konigsberg, Goldstein & Hill (1963), J. Biol. Chem. 238:2028 |
| Whale myoglobin | Edmundson (1965), Nature 205:883 (sperm whale ⚠, the paper says only "whale") |
| Bovine pancreatic ribonuclease | Smyth, Stein & Moore (1963), J. Biol. Chem. 238:227 |
| Hen egg lysozyme | Canfield (1963), J. Biol. Chem. 238:2698 |

Reproducing 38 exactly needs these sequences, not today's UniProt entries.

## Gibbs & McIntyre (1970)

### Dates

- "(Received May 4, 1970)" (p. 1). Note added in proof dated 29 July 1970
  (p. 11).
- Needleman & Wunsch is not cited.

### The method (p. 1)

- The paper calls it "the 'diagonal-match' or diagram method". It never says
  "dot plot".
- "the two sequences are recorded along adjacent sides of a rectangular
  matrix, the diagram." With proteins, "N-terminal amino acids in the top
  left-hand corner". "a dot is put wherever a row and column with the same
  amino acid… intersect." "Similarities of the two sequences are then clearly
  indicated by diagonal rows of matches (Fig. 1)."
- "it is basically simple (can be done by hand if necessary), and shows
  directly all the possible similarities between the sequences."
- "A composite program, MATCH (written in CDC & ASA FORTRAN IV)".
- "The diagram method is similar in principle to a method for detecting parts
  missing from sequences suggested to Fitch [2] by Dr. Saul Needleman." Ref. 2
  is Fitch (1969), Biochem. Genet. 3:99. The paper says "similar in
  principle"; it does not say the idea came from Needleman.

### Cytochrome c (pp. 1–4)

- Human against *R. rubrum*: the line of matches "is, at different parts of
  the sequences, on three different diagonals, indicating that parts of one
  sequence are not present in the other." Monkey and fish "do so over their
  entire length" (p. 1).
- Two tests (p. 1): unbroken diagonal runs against runs "expected by chance and
  calculated directly (Appendix 1)", and the total matches in every diagonal
  against "the numbers expected in each diagonal if the sequences show no
  similarity."
- Chance is computed from composition, without shuffling: the probability of a
  match in a cell is p = NMATCH/(N₁N₂), with NMATCH the sum over amino acids of
  the product of the two proteins' counts (p. 10).
- Run length convention: "A run of S − 1 is defined as S contiguous matches on
  a diagonal" (p. 10). Don't write "29 residues in a row" for a run of 29.
- 25 cytochromes (24 cytochromes c and cow cytochrome B5) classified by both
  indices (pp. 3–4).
- "Both classifications show the close similarity between rattlesnake and
  primate cytochromes c… A similarity like this must make one seriously
  question the value of interpreting classifications of this sort strictly in
  terms of phylogeny" (p. 4).
- Silkworm against screw-worm: "runs of 29, 20, 7(×3), 6 and 5" (p. 4).
- Table 2 (p. 3), matches on the principal diagonal against human: monkey 103,
  rattlesnake 90, dog 93, whale 94, kangaroo 94, chicken 91, bullfrog 86, fish
  83, silkworm 39, wheat 7, *Saccharomyces* 8, *Rhodospirillum* 21,
  *Pseudomonas* 4; random about 8·4. Off-diagonal peaks: silkworm 45 four
  diagonals over, wheat 69 eight over, *Saccharomyces* 64 five over. The text
  says the table covers 35 adjacent diagonals; it prints 25.

### Windows and smoothing

- Every identity gets a dot; nothing filters the dots.
- Fig. 6B (p. 7) does smooth: "running sums of five adjacent diagonals are
  plotted at the position of the central diagonal of the five", over the
  diagonal totals, against the expectation if matches were spread uniformly.
- The paper never counts matches in a fixed-length stretch of a diagonal. The
  windowed dot filter is usually credited to Maizel & Lenk (1981) and Staden
  (1982) ⚠.
- For faint runs the paper relies on the eye: "These runs can be seen most
  clearly by looking along the line of each arrow at a shallow angle to the
  page" (Fig. 6A caption, p. 7).

### Other findings

- Chicken lysozyme against bovine α-lactalbumin (Fig. 4, p. 5): no visible
  line, but "a runs index of 0.139, and a diagonals index of 0.032 with a
  probability of 0.00025 of occurring by chance." The statistics find what the
  eye cannot.
- 2α-haptoglobin against itself (Fig. 5, p. 5): two parallel lines off the main
  diagonal show its two near-identical halves.
- "few of the claimed repetitions have been tested statistitically [sic], and
  many rely on the addition of gaps to parts of the sequence, and this has
  inherent dangers [14]." (p. 5)
- The criticism of minimum-mutation scoring on p. 8 targets Fitch's hemoglobin
  repeat paper (J. Mol. Biol. 16:17), not 16:9: the measure "will treat as
  similar not only sequences with the same amino acids but also sequences with
  amino acids with similar properties". On p. 4 they "doubt the value of using
  the 'minimum mutational distance' measure used by Fitch [2,10]".

### Figures

| Fig. | Page | What it shows |
|---|---|---|
| 1 | 2 | Human cytochrome c (down) against monkey, fish and *R. rubrum* (across). A clean diagonal, a gappier one, and offset fragments on three diagonals. The background noise has the same horizontal banding in all three, because common residues in the human sequence make dense rows. |
| 2, 3 | 4 | Trees of the 25 cytochromes from each index |
| 4 | 5 | Lysozyme against α-lactalbumin: no visible line, p = 0·00025 |
| 5 | 5 | 2α-haptoglobin against itself: internal repeat |
| 6A, 6B | 7 | Immunoglobulin heavy against light chain, and the running-sum profile of diagonal totals |
| 7 | 9 | An RNA fragment against its complement, showing base pairings |

## Fitch (1966)

- Received 28 June 1965.
- "a deletion in the middle of one protein would throw the homologous relation
  out of register at that point" (p. 9). LSE is his "length of sequence to be
  examined".
- "If LSE is set at 30, a comparison of α- and β-hemoglobins, the lengths of
  which are 141 and 146 respectively, produces 112×117 = 13,104 total pairs of
  sequences examined for homology." (p. 10)
- Scoring: "find the sum of the minimum mutations required (MR) for every pair
  of amino acids in the region being tested for homology and to compare the
  sum with that expected by chance." (p. 9). Lower is closer. Each window
  comparison has no gaps.
- Significance is computed from composition, without shuffling (p. 12). For α
  against β the expected average is 1·45 mutations per pair, so the most
  probable MR for 30 residues is 43·5. The cutoff is MR ≤ 34, about a 1%
  chance (p. 14).
- 179 of the 13,104 pairs fell under the cutoff. Table 2 (p. 14) sorts them by
  register shift (Cα − Cβ): −5 (81 hits, β 37 to 117), +1 (38, β 1 to 38), −1
  (10, β 2 to 11), plus 12 scattered chance shifts.
- "The register shift of − 1 occurs because the β-chain has an extra amino acid
  at the beginning. A deletion of two β-chain amino acids between 20 and 21
  (Ingram, 1963) now gives the α-chain the extra amino acid and the register
  shift becomes + 1. A subsequent deletion of six amino acids in the α-chain
  produces a net shift of − 5." (p. 14)
- "one does not expect to see the low MR values continue over a considerable
  portion of the two sequences if these values are the result of random
  events." (p. 14)
- The window method never inserts gaps; deletions appear as changes of
  register. A follow-up program did place one: "the β-chain deletion should
  really be between amino acids 18 and 19 so that asparagine (β) will coincide
  with histidine (α)." (p. 15)
- "Finding the homologous regions is not simply the result of observing those
  identical amino acid pairings that can be seen visually." (p. 15)
- Control: human cytochrome c against α-hemoglobin, 9,375 pairs, 54 expected
  under MR ≤ 36 by chance, 37 found (p. 13).

## Eddy (2004)

- Says nothing about Needleman–Wunsch or the history of alignment. Don't cite
  it for that.
- Bellman named dynamic programming to shield his work from Secretary of
  Defense Charles Wilson: "thus 'dynamic' and 'programming' (note, nothing
  particularly to do with computer programming)." (p. 909)
- The modern recurrence, with a penalty per gap position and end gaps
  penalised (S(i,0) = γi) (p. 910). Both differ from N&W 1970.
- "a dynamic programming algorithm memorizes [sic] the solutions of optimal
  subproblems in an organized, tabular form… so that each subproblem is solved
  just once." (p. 910)
- "Dynamic programming is guaranteed to give you a mathematically optimal
  (highest scoring) solution. Whether that corresponds to the biologically
  correct alignment is a problem for your scoring system, not for the
  algorithm." (p. 910)
- "the dynamic programming algorithm will happily align unrelated sequences."
  Its Fig. 1 pair (TTCATA / TGCTCGTA, +5/−2/−6, optimum 11) are random DNA
  (pp. 909–910).
- "whenever two or more cases are equally optimal, dynamic programming
  implementations usually choose one case arbitrarily." (Fig. 1 caption)
- Counting: "about 2^2N/√(2πN) different alignments for two sequences of
  length N; for two sequences of length 300, that's about 10^179" (p. 909).
  This counts C(2N, N), which differs from the Delannoy counts in "Computed
  numbers" below.

## Hagen (2000)

- Fitch's method: "comparing all possible combinations of sequences of a given
  length (say 30 amino acids) along two protein molecules… The computer was
  instructed to print out all sequences whose similarity could not be
  accounted for by chance." (p. 235)
- "Fitch's approach was further elaborated by others, notably Saul Needleman
  and Christian Wunsch, whose algorithm remains one of the standard methods
  for sequence alignment" (p. 235).
- Dayhoff: "Trained in quantum chemistry and mathematics, she became
  interested in proteins and molecular evolution around 1960." Her FORTRAN
  programs found the sequence of ribonuclease "within a few minutes. The same
  feat had taken a team of humans many months" (p. 234). She worked on the IBM
  7090 (Fig. 4, p. 235).
- The Atlas "served as the first database for molecular biology" (p. 234).
  Critics noted most entries "were interspecific variations of a few
  well-studied proteins such as cytochrome c" (p. 235).
- Zuckerkandl and Pauling called proteins and nucleic acids "semantides" and
  imagined "paleogenetics" (p. 233).
- "by 1960, scarcity of computers was no longer a serious stumbling block for
  the development of computational biology." (p. 232)
- Hagen places PAM in the late 1960s; PAM matrices are usually dated to the
  1978 Atlas. Don't date PAM from Hagen. His timeline gives β-hemoglobin as 145
  residues; use 146.

## History (Strasser 2010) ⚠

Not uploaded. Pages 623–630 were exact in the earlier session; later pages are
approximate.

- Comparing sequences began with function (active sites): Sanger's insulins
  (p. 626), Tuppy, the Blombäcks' 22 mammals, Anfinsen (pp. 626–627). Tuppy's
  distance idea, around 1958 (p. 628).
- The 1965 Atlas: just under 100 pages, about 70 proteins, punch cards. The
  one-letter code was adopted for memory and for fixed-width printers
  (~pp. 638–642).
- Dayhoff & Eck's 1966 cytochrome c tree came before Fitch & Margoliash (1967)
  (~p. 647). Hagen calls the two "concurrently devised". Braunitzer: "I am not
  a theorizer" (~p. 648).

## Order of events

- Fitch's window method: received June 1965, published 1966.
- Needleman & Wunsch: received 21 July 1969, published 1970.
- Gibbs & McIntyre: received 4 May 1970. They don't cite N&W.
- Gibbs & McIntyre call their diagram "similar in principle" to a method
  Needleman suggested to Fitch (Fitch 1969). That Needleman's suggestion
  underlies both papers is our inference.
- Piece 1 teaches the diagram first because it is simpler. The prose must not
  call it earlier.

## Sequences used here

Mature chains from UniProt, initiator Met removed:

| Chain | UniProt | Length | Structure |
|---|---|---|---|
| Human β-hemoglobin | P68871 | 146 | 4HHB (deoxy Hb) |
| Sperm whale myoglobin | P02185 | 153 | 1A6M |
| Human α-hemoglobin | P69905 | 141 | 4HHB |

## Computed numbers

Computed on today's sequences; these are illustrations, not paper figures.

- Possible alignments, as Delannoy numbers (counting the order of adjacent
  gaps): 6 × 6 gives 8,989; 20 × 20 about 2.6 × 10¹⁴; 146 × 153 about 10¹¹³.
  Under Eddy's convention, C(n+m, n), the same cases give 924, about 1.4 ×
  10¹¹ and about 10⁸⁹. Pick one and say which.
- β against myoglobin, best single slide: 30 identical pairs.
- The 1970 rule (identity scoring, one penalty per gap, free end gaps): 63
  matches with no penalty, the same as the paper; with penalty 1, 37 from 40
  matches and 3 gaps, against the paper's 38 from 42 and 4; with penalty 2, 34
  from 36 and 1 gap. The difference is expected from the 1963/1965
  sequences.
- β against α, penalty 1: 60 (63 matches, 3 gaps).
- 100 shuffles of β against myoglobin: no gaps 16.6 on average (real 30); gap
  cost 1, 27.5 (real 36 with one gap); free gaps 55.9 (real 63; the paper's
  ten gave 55.6).
- Diagonal runs of 3 or more: real 6, shuffled mean 6.4. α against β, runs of
  4 or more: 3 against 0.6.
- Dot plot of β against myoglobin: 1,533 dots for the real pair and every
  shuffle. With a window of 20 and threshold 7: 21 hits within 2 diagonals of
  the main one, against about 5.5 scattered hits for shuffles.
- Phone-length fragments (10–12 β residues): the best β/myoglobin fragments
  score 3 for a slide and 4 with one gap. β 11–30 against myoglobin 10–31
  scores 6 for the best slide, 7 with gap cost 1 and 11 with free gaps.

## Open items

- ⚠ Window-filter attribution (Maizel & Lenk 1981; Staden 1982).
- ⚠ Cytochrome c difference counts (human–chimp 0, rhesus 1, horse 12) come
  from teaching materials. Recompute from UniProt.
- ⚠ The "F8" label for myoglobin His93 is from memory.
- ⚠ Ingram (1961), "Gene Evolution and the Hæmoglobins", not read. Fitch
  cites Ingram (1963), *Hemoglobins in Genetics and Evolution*.
- ⚠ Strasser facts, until the paper is uploaded.
- ⚠ The 1963 β-hemoglobin and 1965 myoglobin sequences, to reproduce Table 1.
