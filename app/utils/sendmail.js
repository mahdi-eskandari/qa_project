import nodemailer from "nodemailer"
export async function sendEmail(email, verifiLink) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("EMAIL_USER or EMAIL_PASS is not defined in env");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
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
      <div>
        <h2>Verify your email</h2>
        <p>Please click the link below to verify your account:</p>
        <a href="${verifiLink}">Verify your account</a>
      </div>
    `,
  });

  return info;
}

