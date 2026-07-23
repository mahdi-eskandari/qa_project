const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "mahdizendegi0000@gmail.com",
        pass: "xniz sfmz feen ucjy",
    },
});

export async function sendEmail(email, link) {
    const mailOptions = {
        from: "mahdizendegi0000@gmail.com",
        to: email,
        subject: "Verify your email",
        html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email</p>
      <a href="${link}">Verify Email</a>
    `
    };


    console.log("Verify link:");
    console.log(link);
    console.log("====================================");

    return transporter.sendMail(mailOptions);
};




// export async function sendEmail(email, link) {
//     console.log("====================================");
//     console.log("Email should be sent to:", email);
//     console.log("Verify link:");
//     console.log(link);
//     console.log("====================================");

//     return {
//         success: true,
//         message: "Development mode: email logged in terminal",
//     };
// }


