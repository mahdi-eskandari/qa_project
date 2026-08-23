import nodemailer from "nodemailer";

export async function sendEmail(email, verifiLink) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("EMAIL_USER or EMAIL_PASS is not defined in env");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // برای پورت 587 باید false باشد
    family: 4,     // 👈 این خط حیاتی است: اجبار نودمیلیر به استفاده از IPv4
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Q&A Platform" <${user}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Verify your email</h2>
        <p>Please click the link below to verify your account:</p>
        <a href="${verifiLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Verify your account</a>
      </div>
    `,
  });

  return info;
}
