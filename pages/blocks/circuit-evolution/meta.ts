import { definePiece } from "@lib/piece";

export default definePiece({
  href: "/blocks/circuit-evolution",
  kind: "block",
  title: "Circuit Evolution Simulator",
  subtitle: "A basic model of how genetic circuits can evolve",
  description:
    "An interactive circuit evolution simulator: mutate a network of NAND gates step by step, or select the fittest of each generation, and watch fitness climb.",
  keywords: "circuit evolution, simulation, graph theory, probability",
  published: "2024-11-26",
  updated: "2024-12-02",
  art: "generations",
});
