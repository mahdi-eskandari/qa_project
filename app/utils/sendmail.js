import nodemailer from "nodemailer";

export async function sendEmail(email, verifyLink) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  console.log("SEND EMAIL CALLED");
  console.log("EMAIL_USER exists?", !!emailUser);
  console.log("EMAIL_PASS exists?", !!emailPass);

  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER or EMAIL_PASS is missing");
  }

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

  try {
    console.log("VERIFYING SMTP...");
    await transporter.verify();
    console.log("SMTP VERIFIED");

    const result = await transporter.sendMail({
      from: `"QA Platform" <${emailUser}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Verify your email</h2>
        <p>Click below:</p>
        <a href="${verifyLink}">Verify account</a>
      `,
    });

    console.log("MAIL SENT:", result.messageId);
    return result;
  } catch (error) {
    console.error("SEND MAIL ERROR MESSAGE:", error?.message);
    console.error("SEND MAIL ERROR CODE:", error?.code);
    console.error("SEND MAIL ERROR COMMAND:", error?.command);
    console.error("SEND MAIL ERROR RESPONSE:", error?.response);
    console.error("SEND MAIL FULL ERROR:", error);
    throw error;
  }
}
