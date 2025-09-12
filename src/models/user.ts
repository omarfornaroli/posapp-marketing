import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  businessName: string;
  businessAddress?: string;
  businessIndustry?: string;
  userName: string;
  password?: string; // Optional because we might not want to send it back
  cardInfo: {
    holderName: string;
    last4: string;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  businessName: { type: String, required: true },
  businessAddress: { type: String },
  businessIndustry: { type: String },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  cardInfo: {
    holderName: { type: String, required: true },
    last4: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
