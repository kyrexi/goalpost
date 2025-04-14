import { schedules } from "@trigger.dev/sdk/v3";

export const sendMail = schedules.task({
  id: "send-mail",
  cron: {
    pattern: "0 9 * * *", // Every day at 9 AM
    timezone: "Asia/Calcutta",
  },
  run: async (payload: any, { ctx }) => {
    try {
      // URL selection - use production URL or localhost
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://goalpost.kyrexi.tech"
          : "http://localhost:3000";

      const url = `${baseUrl}/api/send`;

      console.log(`Making POST request to ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send request: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response:", data);

      return { success: true, data };
    } catch (error: any) {
      console.error("Error sending scheduled request:", error);
      return { success: false, error: error.message };
    }
  },
});
