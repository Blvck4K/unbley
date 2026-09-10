import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const emailEnabled = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);

export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    return { ok: false, skipped: true, error: 'RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.' };
  }

  try {
    const payload = {
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
      text,
      reply_to: replyTo
    };

    const response = await resend.emails.send(payload);
    if (response?.error) {
      return { ok: false, skipped: false, error: response.error.message || 'Email send failed.' };
    }

    return { ok: true, skipped: false, data: response.data };
  } catch (error) {
    return { ok: false, skipped: false, error: error.message || 'Email send failed.' };
  }
}
