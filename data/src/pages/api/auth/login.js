// pages/api/auth/login.js
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: Generate a session token here if needed
      // const token = await user.getIdToken();

      res.status(200).json({ message: "Login successful", uid: user.uid });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
