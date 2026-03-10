import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConsultation extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  age: number;
  address: string;
  symptoms: string;
  medications: string;
  allergies: string;
  chronicCondition: string;
  medicalReportUrl?: string;
  consultationDate: string;
  consultationTime: string;
  consultationType: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  status: 'pending' | 'assigned' | 'completed';
  assignedDoctor?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ConsultationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  symptoms: { type: String, required: true },
  medications: { type: String, required: true },
  allergies: { type: String, required: true },
  chronicCondition: { type: String, required: true },
  medicalReportUrl: { type: String },
  consultationDate: { type: String, required: true },
  consultationTime: { type: String, required: true },
  consultationType: { type: String, required: true },
  emergencyContactName: { type: String, required: true },
  emergencyContactNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  assignedDoctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Consultation: Model<IConsultation> = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);

export default Consultation;
