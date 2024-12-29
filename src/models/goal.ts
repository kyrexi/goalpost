import mongoose, { Schema, Document, model, models } from "mongoose";

// Define the Goal interface
interface IGoal extends Document {
  email: string;
  goal: string; // Encrypted text
  reminderDate: Date;
  createdAt: Date;
}

// Create the Mongoose schema
const GoalSchema: Schema = new Schema<IGoal>(
  {
    email: { type: String, required: true },
    goal: { type: String, required: true }, // Encrypted goal
    reminderDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Use existing model if already defined
const Goal = models.Goal || model<IGoal>("Goal", GoalSchema);

export default Goal;
