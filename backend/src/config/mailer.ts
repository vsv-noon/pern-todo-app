import nodemailer from 'nodemailer';

type SendMailProps = {
  email: string;
  url: string;
  subject: string;
  text: string;
  linkMessage: string;
};

// Send the email
export async function sendMail(sendMailData: SendMailProps) {
  // const activationUrl = `http://localhost/api/auth/activate/${activationToken}`;
  // Configure the transporter for Mailpit
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(String(process.env.SMTP_PORT), 10), // Mailpit SMTP port
    secure: process.env.SMTP_PORT === '465', // false for 1025, true for 465, 587
    auth: {
      user: process.env.SMTP_USER, // Mailpit doesn't require auth
      pass: process.env.SMTP_PASS,
    },
  });

  // Example to send link for activation
  const mailOption = {
    from: process.env.SMTP_USER, // sender address,
    to: sendMailData.email,
    subject: `${sendMailData.subject} on ` + process.env.APP_URL,
    html: `
    <div>
      <p>${sendMailData.text}</p>
      <a href="${sendMailData.url}">${sendMailData.linkMessage}</a>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOption);

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sendin email:', error);
  }
}
