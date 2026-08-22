import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  email: string,
  verifiLink: string
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const { data, error } = await resend.emails.send({
    from: "Q&A <onboarding@resend.dev>",
    to: [email],
    subject: "Verify your email",
    html: `
      <div>
        <h2>Verify your email</h2>
        <p>Please click the link below to verify your account:</p>
        <a href="${verifiLink}">${verifiLink}</a>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
