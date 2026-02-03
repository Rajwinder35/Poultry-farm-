import nodemailer from "nodemailer";

export async function sendInquiryEmail(subject: string, body: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const notify = process.env.NOTIFY_EMAIL;

  if (!host || !user || !pass || !notify) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `Chahal Farm <${user}>`,
    to: notify,
    subject,
    text: body,
  });

  return { skipped: false };
}
