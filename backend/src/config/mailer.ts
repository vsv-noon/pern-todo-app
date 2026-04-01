import nodemailer from 'nodemailer';

// Send the email
export async function sendMail(email: string, activationToken: string) {
  const activationUrl = `http://localhost/api/auth/activate/${activationToken}`;
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
    to: email,
    subject: 'Активация аккаунта на ' + process.env.APP_URL,
    html: `
    <div>
      <h1>Для активации перейдите по ссылке:</h1>
      <a href="${activationUrl}">${activationUrl}</a>
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
