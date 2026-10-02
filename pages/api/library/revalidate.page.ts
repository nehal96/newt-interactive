import type { NextApiRequest, NextApiResponse } from "next";

/* Regenerates /nehals-library. Called by the library connector after each write. */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.LIBRARY_MCP_SECRET;
  if (req.method !== "POST" || !secret || req.headers["x-library-secret"] !== secret) {
    return res.status(404).end();
  }
  await res.revalidate("/nehals-library");
  return res.json({ revalidated: true });
}
