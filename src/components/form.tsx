"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function Form() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !text || !email) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          goal: text,
          reminderDate: date.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEmail("");
        setText("");
        setDate(new Date());
        toast.success("Goal submitted successfully!");
      } else {
        toast.error("Failed to save goal. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit goal:", err);
      toast.error("Failed to save goal. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      id="create"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>What's the Goal? 🎯</CardTitle>
          <CardDescription>
            Enter details and select a date you want to get it done by. We'll
            mail you a reminder on that day.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 h-[600px]">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="goal"
                className="text-sm font-medium text-gray-700"
              >
                Goal Details
              </Label>
              <Textarea
                id="goal"
                placeholder="Enter goal details here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Reminder Date
              </Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                required
                className="rounded-md border h-80"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse md:flex-row justify-between items-center gap-2">
            <Button variant={"outline"} className="w-full">
              <Link href={"https://github.com/kyrexi/goalpost"}>
                ⭐ Star us on github
              </Link>
            </Button>
            <Button type="submit" className="w-full">
              Submit Event
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
