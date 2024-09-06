// pages/api/auth/signup.js
// pages/api/auth/signup.js
import { auth, db } from "../../../lib/firebase";  // Use relative path if alias isn't set
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, mobile } = req.body;

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      // Store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        mobile,
        createdAt: new Date().toISOString(),
      });
    
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
