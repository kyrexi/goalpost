import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "@/lib/dbConnect";
import Goal from "@/models/goal";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // Must match the key used for encryption
if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required");
}

function decrypt(encryptedText: string): string {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedData = Buffer.from(textParts[1], "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export async function POST(req: Request) {
  try {
    // Extract and validate the Authorization token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (token !== process.env.AUTH_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // End of day

    // Find reminders for today
    const reminders = await Goal.find({
      reminderDate: { $gte: today, $lt: tomorrow },
    });

    if (reminders.length === 0) {
      return NextResponse.json({ message: "No reminders for today" });
    }

    // Send emails concurrently using Promise.all
    const emailPromises = reminders.map(async (reminder) => {
      try {
        // Decrypt the goal before sending
        const decryptedGoal = decrypt(reminder.goal);

        // Send email using Resend
        const { data, error } = await resend.emails.send({
          from: "GoalPost <goalpost@updates.kyrexi.tech>",
          to: reminder.email,
          subject: "Your Goal Reminder 🚀",
          react: EmailTemplate({
            email: reminder.email,
            goal: decryptedGoal,
          }),
        });

        if (error) {
          throw new Error(error.message);
        }
        console.log(`Email sent to ${reminder.email}:`, data);
      } catch (error: any) {
        console.error(`Error sending email to ${reminder.email}:`, error);
        return { success: false, email: reminder.email, error: error.message };
      }
    });
    const emailResults = await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: "Reminders processed",
      results: emailResults,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
