// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  confirmPassword: string;
  password: string;
  email: string;
  files?: Array<{
    filename: string;
    fileUrl: string;
    uploadedAt: Date;
  }>;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  files: [{
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
