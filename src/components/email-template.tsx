import * as React from "react";

interface EmailTemplateProps {
  email: string;
  goal: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  goal,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      color: "#333",
    }}
  >
    <h1 style={{ color: "#0056b3" }}>Hello, {email.toString()}!</h1>

    <p>It's time to check in on your goal:</p>
    <p
      style={{
        padding: "12px",
        background: "#f5f5f5",
        borderLeft: "4px solid #0056b3",
        margin: "16px 0",
      }}
    >
      "{goal}"
    </p>

    <p>Have you made progress toward achieving this goal?</p>
    <p>Remember, even small steps forward count as success!</p>

    <p>Wishing you continued success,</p>
    <p>The Goalpost Team</p>

    <div
      style={{
        fontSize: "0.8em",
        marginTop: "30px",
        borderTop: "1px solid #eee",
        paddingTop: "10px",
        color: "#666",
      }}
    >
      This is an automated reminder from goalpost.
    </div>
    <a
      href="https://goalpost.kyrexi.tech"
      style={{
        display: "inline-block",
        marginTop: "10px",
        textDecoration: "none",
        color: "#0056b3",
        fontSize: "0.8em",
      }}
    >
      Visit Goalpost
    </a>
  </div>
);
