// src/pages/api/auth/forgot-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbconnect from '../../../lib/dbconnect';
import User from '../../../models/user';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbconnect();

  if (req.method === 'POST') {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Save the reset token and its expiry time to the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send the reset link via email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) have requested to reset your password. Please click on the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error: Error | null) => {
      if (error) {
        return res.status(500).json({ message: 'Email could not be sent', error });
      }
      return res.status(200).json({ message: 'Password reset email sent' });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
