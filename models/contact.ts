import mongoose, { Schema, Model } from "mongoose";

export interface IContact {
  userName: string;
  email: string;
  message: string;
}

const contactSchema = new Schema<IContact>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Model name kept as "contact" (lowercase) to preserve the original collection.
const Contact =
  (mongoose.models.contact as Model<IContact>) ||
  mongoose.model<IContact>("contact", contactSchema);

export default Contact;
