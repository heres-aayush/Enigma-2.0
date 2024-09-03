// src/pages/api/auth/reset-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbconnect';
import User from '../../../models/user';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { id, token, password } = req.body;

    // Find the user by ID and check the token and expiration
    const user = await User.findById(id);
    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
