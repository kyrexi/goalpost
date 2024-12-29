import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import crypto from "crypto";
import Goal from "@/models/goal";

// Encryption setup
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // Must be 32 chars
console.log("ENCRYPTION_KEY:", ENCRYPTION_KEY);
if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required");
}
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export async function POST(req: Request) {
  try {
    const { email, goal, reminderDate } = await req.json();

    if (!email || !goal || !reminderDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Encrypt the goal
    const encryptedGoal = encrypt(goal);

    // Connect to MongoDB
    await dbConnect();

    // Save the document using Mongoose
    const newGoal = new Goal({
      email,
      goal: encryptedGoal,
      reminderDate: new Date(reminderDate),
    });

    await newGoal.save();

    return NextResponse.json({ success: true, id: newGoal._id });
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json({ error: "Failed to save goal" }, { status: 500 });
  }
}
