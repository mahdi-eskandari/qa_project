import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, verifiLink) {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [to],
    subject: "Verify your email",
    html: `
      <p>برای تأیید ایمیل روی لینک زیر کلیک کنید:</p>
      <a href="${verifiLink}">${verifiLink}</a>
    `,
  });

  console.log("RESEND FULL RESPONSE:", JSON.stringify(response));

  if (response.error) {
    throw new Error(
      `Resend ${response.error.name || "Error"}: ${
        response.error.message || "Unknown error"
      }`
    );
  }

  return response.data;
}
