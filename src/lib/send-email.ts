import nodemailer from "nodemailer";

type SendEmailParams = {
  recipientEmail: string;
  subject: string;
  body: string;
};

export function sendEmail({
  recipientEmail,
  subject,
  body,
}: SendEmailParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection configuration
    transporter.verify((error) => {
      if (error) {
        console.error("Error verifying transporter:", error);
        return reject();
      }

      const mailData = {
        from: process.env.EMAIL_USERNAME,
        to: recipientEmail,
        subject: subject,
        text: body,
        html: `<div>${body}</div>`,
      };

      // Send mail
      transporter.sendMail(mailData, (error) => {
        if (error) {
          console.error("Error sending mail:", error);
          return reject();
        }
        return resolve();
      });
    });
  });
}

export default sendEmail;
