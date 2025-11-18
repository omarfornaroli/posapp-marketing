import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  status: 'Activa' | 'Inactiva' | 'Pendiente';
}

const SubscriptionSchema: Schema = new Schema({
  status: { type: String, enum: ['Activa', 'Inactiva', 'Pendiente'], required: true },
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
