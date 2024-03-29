import mailchimp from "@mailchimp/mailchimp_marketing";
import type { NextApiRequest, NextApiResponse } from "next";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, firstName } = req.body;

  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: "pending",
      merge_fields: {
        FNAME: firstName,
      },
    });

    return res.status(201).json({ error: "" });
  } catch (error) {
    const getNiceErrorMessage = (error) => {
      if (error.response?.body?.title) {
        switch (error.response.body.title) {
          case "Member Exists":
            return `${email} is already a member.`;
          default:
            return (
              error.response?.body?.title || error.message || error.toString()
            );
        }
      } else {
        return error.message || error.toString();
      }
    };

    return res.status(500).json({ error: getNiceErrorMessage(error) });
  }
};
