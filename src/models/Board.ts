import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description: string;
  columns: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    columns: {
      type: [String],
      default: ["Por hacer", "En progreso", "En revisión", "Completado"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
