import { connectDataBase, insertDocument } from "../../helpers/db-util";

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid email address." });
      return;
    }
    let client;
    try {
      client = await connectDataBase();
    } catch (error) {
      res.status(500).json({ message: "Connecting to the database falied!" });
      return;
    }
    try {
      await insertDocument(client, "comments", { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting data falied!" });
      return;
    }

    res.status(201).json({ message: "Signed Up!" });
  }
}

export default handler;
