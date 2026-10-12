// Mature chains (initiator Met removed), from UniProt.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

export type Chain = {
  name: string;
  species: string;
  uniprot: string;
  seq: string;
};

export const BETA: Chain = {
  name: "β-hemoglobin",
  species: "human",
  uniprot: "P68871",
  seq: "VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH",
};

export const MYOGLOBIN: Chain = {
  name: "myoglobin",
  species: "sperm whale",
  uniprot: "P02185",
  seq: "VLSEGEWQLVLHVWAKVEADVAGHGQDILIRLFKSHPETLEKFDRFKHLKTEAEMKASEDLKKHGVTVLTALGAILKKKGHHEAELKPLAQSHATKHKIPIKYLEFISEAIIHVLHSRHPGDFGADAQGAMNKALELFRKDIAAKYKELGYQG",
};

export const ALPHA: Chain = {
  name: "α-hemoglobin",
  species: "human",
  uniprot: "P69905",
  seq: "VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR",
};

// 1-based, inclusive, as residues are numbered in papers.
export const fragment = (chain: Chain, from: number, to: number) => chain.seq.slice(from - 1, to);

export const CYT_C_HUMAN: Chain = {
  name: "cytochrome c",
  species: "human",
  uniprot: "P99999",
  seq: "GDVEKGKKIFIMKCSQCHTVEKGGKHKTGPNLHGLFGRKTGQAPGYSYTAANKNKGIIWGEDTLMEYLENPKKYIPGTKMIFVGIKKKEERADLIAYLKKATNE",
};

export const CYT_C_MONKEY: Chain = {
  name: "cytochrome c",
  species: "rhesus monkey",
  uniprot: "P00002",
  seq: "GDVEKGKKIFIMKCSQCHTVEKGGKHKTGPNLHGLFGRKTGQAPGYSYTAANKNKGITWGEDTLMEYLENPKKYIPGTKMIFVGIKKKEERADLIAYLKKATNE",
};

export const CYT_C_TUNA: Chain = {
  name: "cytochrome c",
  species: "albacore tuna",
  uniprot: "P81459",
  seq: "GDVAKGKKTFVQKCAQCHTVENGGKHKVGPNLWGLFGRKTGQAEGYSYTDANKSKGIVWNNDTLMEYLENPKKYIPGTKMIFAGIKKKGERQDLVAYLKSATS",
};

// Dus, Sletten and Kamen (1968), the sequence Gibbs and McIntyre cite.
export const CYT_C2_RRUBRUM: Chain = {
  name: "cytochrome c2",
  species: "Rhodospirillum rubrum",
  uniprot: "P0C189",
  seq: "EGDAAAGEKVSKKCLACHTFDQGGANKVGPNLFGVFENTAAHKDNYAYSESYTEMKAKGLTWTEANLAAYVKNPKAFVLEKSGDPKAKSKMTFKLTKDDEIENVIAYLKTLK",
};
