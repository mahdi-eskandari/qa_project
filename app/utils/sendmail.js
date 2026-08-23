import nodemailer from "nodemailer";

export async function sendEmail(email, verifyLink) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: `"QA Platform" <${emailUser}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Click the link below to verify your account:</p>
      <a href="${verifyLink}">Verify account</a>
    `,
  });
}
