import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, firstName } = req.body;

  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.CONVERTKIT_API_KEY}`,
    "X-Kit-Api-Key": process.env.CONVERTKIT_API_KEY,
  };

  const body = {
    email_address: email,
    first_name: firstName,
    state: "inactive",
  };

  try {
    const response = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

    if (response.status === 422) {
      return res.status(422).json({ error: "Email address is invalid" });
    }

    if (!response.ok) {
      throw new Error("Failed to subscribe. Please try again later.");
    }

    const data = await response.json();

    if (data?.subscriber?.state === "active") {
      throw new Error(`${email} is already subscribed.`);
    }

    await fetch(
      `https://api.kit.com/v4/forms/${process.env.CONVERTKIT_FORM_ID}/subscribers`,
      {
        method: "POST",
        body: JSON.stringify({ email_address: email }),
        headers: headers,
      }
    );

    return res.status(201).json({ error: "" });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong. Please try again later.",
    });
  }
};
