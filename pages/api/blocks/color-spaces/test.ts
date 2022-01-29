import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  console.log(body);
  return res.status(200).json({ message: "test" });
};
