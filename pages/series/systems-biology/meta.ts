import { definePiece } from "@lib/piece";

export default definePiece({
  href: "/series/systems-biology",
  kind: "series",
  title: "Systems Biology",
  subtitle:
    "Dive deep into complex biological systems through interactive explainers",
  description:
    "Work through systems biology with interactive explainers: transcription networks, activators and repressors, response time, and negative autoregulation.",
  keywords:
    "systems biology, interactive explainers, transcription networks, gene expression, biological systems",
  published: "2024-09-23",
  art: "network-layered",
  ogType: "website",
  parts: [
    {
      href: "/series/systems-biology/transcription-network-basics-1",
      title: "Transcription Network Basics",
      published: "2024-09-26",
      section: "Introduction to Transcription Networks",
    },
    {
      href: "/series/systems-biology/transcription-network-basics-2",
      title: "Activators and Repressors",
      published: "2024-10-06",
      section: "Introduction to Transcription Networks",
    },
    {
      href: "/series/systems-biology/transcription-network-basics-3",
      title: "Dynamics and Response Time",
      published: "2024-10-27",
      section: "Introduction to Transcription Networks",
    },
    {
      href: "/series/systems-biology/autoregulation-1",
      title: "Autoregulation as a Network Motif",
      published: "2024-11-02",
      section: "Autoregulation",
    },
    {
      href: "/series/systems-biology/autoregulation-2",
      title: "Dynamics of Negative Autoregulation",
      published: "2024-12-15",
      section: "Autoregulation",
    },
  ],
});
