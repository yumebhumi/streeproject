import mongoose, { Schema, Model, Types } from "mongoose";

export type IncidentCategory =
  | "mistreatment"
  | "hooligans"
  | "cat-calling"
  | "shady-area";

export type IncidentStatus = "submitted" | "published" | "rejected";

export interface IIncident {
  user: Types.ObjectId;
  location: {
    type: "Point";
    coordinates: number[];
  };
  description: string;
  category: IncidentCategory;
  date: Date;
  time: string;
  name: string;
  isAnonymous: boolean;
  status: IncidentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["mistreatment", "hooligans", "cat-calling", "shady-area"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["submitted", "published", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true },
);

IncidentSchema.index({ location: "2dsphere" });

const Incident =
  (mongoose.models.Incident as Model<IIncident>) ||
  mongoose.model<IIncident>("Incident", IncidentSchema);

export default Incident;
