import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  businessName: string;
  businessAddress?: string;
  businessIndustry?: string;
  email: string;
  password?: string; // Optional because we might not want to send it back
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  businessName: { type: String, required: true },
  businessAddress: { type: String },
  businessIndustry: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
