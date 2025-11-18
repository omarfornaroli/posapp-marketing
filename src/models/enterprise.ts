import mongoose, { Schema, Document } from 'mongoose';
import { IDeployment } from './deployment';
import { ISubscription } from './subscription';

export interface IEnterprise extends Document {
  businessName: string;
  businessAddress?: string;
  businessIndustry?: string;
  email: string;
  password?: string;
  deployment: IDeployment['_id'];
  subscription: ISubscription['_id'];
  createdAt: Date;
}

const EnterpriseSchema: Schema = new Schema({
  businessName: { type: String, required: true },
  businessAddress: { type: String },
  businessIndustry: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  deployment: { type: Schema.Types.ObjectId, ref: 'Deployment' },
  subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Enterprise || mongoose.model<IEnterprise>('Enterprise', EnterpriseSchema);
