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
export const fragment = (chain: Chain, from: number, to: number) =>
  chain.seq.slice(from - 1, to);
