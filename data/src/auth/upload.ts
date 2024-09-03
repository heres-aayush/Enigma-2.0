import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import sharp from 'sharp'; // Remove the unused import statement
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import Formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase-admin/app';
import User from '../../models/user';

const app = initializeApp(); 
// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: 'enigma2-6fb1d.appspot.com'
  });
}

const bucket = getStorage().bucket();

export const config = {
  api: {
    bodyParser: false, // Disallow Next.js body parsing to handle form data with Formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const form = new Formidable.IncomingForm({
      uploadDir: path.join(__dirname, '/tmp'), // Temporary directory for file uploads
      keepExtensions: true,
    });

    form.parse(req, async (err: Error, fields: any, files: any) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.file[0]; // Adjust if you expect multiple files or different field names
      const filePath = file.filepath;
      const fileName = file.originalFilename;

      const imageBuffer = await fs.promises.readFile(filePath);


      try {
        // Upload file to Firebase Cloud Storage
        const blob = bucket.file(`uploads/${decodedToken.uid}/${fileName}`);
        await bucket.upload(filePath, {
          destination: blob,
          metadata: {
            contentType: file.mimetype,
          },
        });

        const user = await User.findOne({ email: decodedToken.email });
        if (user) {
          user.files = user.files || [];
          user.files.push({
            filename: fileName,
            fileUrl: blob.publicUrl(),
            uploadedAt: new Date(),
          });
          await user.save();
        }

        // Cleanup temporary file
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'File uploaded successfully' });
      } catch (uploadError) {
        res.status(500).json({ error: 'File upload error' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
