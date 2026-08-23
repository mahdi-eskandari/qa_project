import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email, verifyLink) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is missing");
  }

  if (!email || !verifyLink) {
    throw new Error("Email recipient or verification link is missing");
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject: "Verify your QA Platform account",
    text: `Verify your account by opening this link: ${verifyLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your QA Platform account</h2>
        <p>Click the button below to verify your email address.</p>

        <p>
          <a
            href="${verifyLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Verify account
          </a>
        </p>

        <p>This link will expire in 15 minutes.</p>

        <p style="color: #666; font-size: 13px;">
          If you did not create an account, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND API ERROR:", {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });

    throw new Error(error.message || "Resend failed to send email");
  }

  console.log("RESEND EMAIL SENT:", data?.id);

  return data;
}
