import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  column: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    column: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: { type: String, default: "" },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
