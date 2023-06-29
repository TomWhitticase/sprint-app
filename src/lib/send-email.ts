import nodemailer from "nodemailer";

type SendEmailParams = {
  recipientEmail: string;
  subject: string;
  body: string;
};

export async function sendEmail({
  recipientEmail,
  subject,
  body,
}: SendEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Verify connection configuration
  await transporter.verify();

  const mailData = {
    from: process.env.EMAIL_USERNAME,
    to: recipientEmail,
    subject: subject,
    text: body,
    html: `<div>${body}</div>`,
  };

  // Send mail
  await transporter.sendMail(mailData);
}

export default sendEmail;
