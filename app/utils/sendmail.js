import nodemailer from "nodemailer";

export async function sendEmail(email, verifiLink) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log("SEND EMAIL CALLED");
  console.log("EMAIL_USER exists?", !!user);
  console.log("EMAIL_PASS exists?", !!pass);

  if (!user || !pass) {
    throw new Error("EMAIL_USER or EMAIL_PASS is not defined in env");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user,
      pass,
    },
  });

  try {
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

    console.log("SEND MAIL SUCCESS:", info.messageId);
    return info;
  } catch (error) {
    console.error("SEND MAIL ERROR FULL:", error);
    throw error;
  }
}
