import nodemailer from "nodemailer";

export async function sendEmail(email, verifyLink) {
  console.log("SEND EMAIL CALLED");
  console.log("EMAIL_USER exists?", Boolean(process.env.EMAIL_USER));
  console.log("EMAIL_PASS exists?", Boolean(process.env.EMAIL_PASS));

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

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
    console.log("CHECKING SMTP CONNECTION...");

    await transporter.verify();

    console.log("SMTP CONNECTION VERIFIED");

    const result = await transporter.sendMail({
      from: `"QA Platform" <${emailUser}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your account:</p>

          <a
            href="${verifyLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Verify account
          </a>
        </div>
      `,
    });

    console.log("EMAIL SENT:", result.messageId);

    return result;
  } catch (error) {
    console.error("SMTP ERROR MESSAGE:", error?.message);
    console.error("SMTP ERROR CODE:", error?.code);
    console.error("SMTP ERROR COMMAND:", error?.command);
    console.error("SMTP ERROR RESPONSE:", error?.response);
    console.error("FULL SMTP ERROR:", error);

    throw error;
  }
}
