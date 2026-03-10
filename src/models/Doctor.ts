import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  email: string;
  designation: string;
  hospital: string;
  image: string;
  education: string[];
  experience: string[];
  interests: string[];
  createdAt: Date;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  designation: { type: String, required: true },
  hospital: { type: String, required: true },
  image: { type: String, required: true },
  education: [{ type: String }],
  experience: [{ type: String }],
  interests: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
