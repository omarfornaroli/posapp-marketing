import mongoose, { Schema, Document } from 'mongoose';

export interface IDeployment extends Document {
  app_port: number;
  db_port: number;
  status: 'funcionando' | 'parado' | 'reiniciando';
}

const DeploymentSchema: Schema = new Schema({
  app_port: { type: Number, required: true },
  db_port: { type: Number, required: true },
  status: { type: String, enum: ['funcionando', 'parado', 'reiniciando'], required: true },
});

export default mongoose.models.Deployment || mongoose.model<IDeployment>('Deployment', DeploymentSchema);
