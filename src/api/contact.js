import { sendEmail } from '../../lib/notifications/resend.js';

const json = (res, status, body) => res.status(status).json(body);

const cleanText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed.' });

  const name = cleanText(req.body?.name, 120);
  const email = cleanText(req.body?.email, 254);
  const businessName = cleanText(req.body?.businessName, 160);
  const message = cleanText(req.body?.message, 4000);

  if (!name || !email || !message) {
    return json(res, 400, { ok: false, error: 'Name, email, and message are required.' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return json(res, 400, { ok: false, error: 'Please provide a valid email address.' });
  }

  const recipient = process.env.CONTACT_FORM_EMAIL || 'support@unbley.com';
  const subject = `New customer service message from ${name}`;
  const html = `
    <h2 style="margin:0 0 18px;">New customer service message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Business name:</strong> ${escapeHtml(businessName || 'Not provided')}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-line;">${escapeHtml(message)}</p>
  `;

  const result = await sendEmail({
    to: recipient,
    subject,
    html,
    text: `Name: ${name}\nEmail: ${email}\nBusiness name: ${businessName || 'Not provided'}\n\n${message}`,
    replyTo: email,
    sender: 'unbley'
  });

  if (!result.ok) {
    console.error('[contact-form]', result.error);
    return json(res, 503, { ok: false, error: 'Customer service is temporarily unavailable. Please use WhatsApp instead.' });
  }

  return json(res, 200, { ok: true });
}
