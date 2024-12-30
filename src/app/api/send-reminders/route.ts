import dbConnect from "@/lib/dbConnect";
import Goal from "@/models/goal";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Encryption setup
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // Must match the key used for encryption
if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required");
}
const IV_LENGTH = 16;

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

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email provider (e.g., Gmail, SendGrid, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address (e.g., your-email@gmail.com)
    pass: process.env.EMAIL_PASS, // Your email password or app password (e.g., Gmail App Password)
  },
});

export async function GET(req: Request) {
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

    // Get today's date
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

    // Send emails using Nodemailer
    for (const reminder of reminders) {
      // Decrypt the goal before sending
      const decryptedGoal = decrypt(reminder.goal);

      // Create email options
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: reminder.email, // Recipient address
        subject: "Your Goal Reminder 🚀", // Subject line
        text: `Hi! Here's your reminder:\n\n${decryptedGoal}\n\nDid you achieve your goal?`, // Plain text body
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: "Reminders sent" });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
