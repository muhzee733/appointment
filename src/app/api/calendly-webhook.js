import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const eventData = req.body;

    // Store webhook event in Firebase Firestore
    const docRef = await db.collection("calendly-webhooks").add(eventData);

    console.log("Webhook Data Saved with ID:", docRef.id);

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error saving webhook data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}