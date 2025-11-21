import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  status: 'Activa' | 'Inactiva' | 'Pendiente';
  preapproval_id?: string;
}

const SubscriptionSchema: Schema = new Schema({
  status: { type: String, enum: ['Activa', 'Inactiva', 'Pendiente'], required: true },
  preapproval_id: { type: String },
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
