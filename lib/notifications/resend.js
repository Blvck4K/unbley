import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const emailEnabled = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);

const senderAddresses = {
  zizzystores: process.env.RESEND_FROM_EMAIL || 'Unbley <notifications@zizzystores.com>',
  unbley: process.env.RESEND_FROM_EMAIL_UNBLEY || 'Unbley <notifications@unbley.com>'
};

const emailLogoUrl = process.env.EMAIL_LOGO_URL || 'https://raw.githubusercontent.com/Blvck4K/Jss-png/main/logogo.png';
const emailSiteUrl = process.env.EMAIL_SITE_URL || 'https://unbley.com';

const wrapEmail = (html = '') => `
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3eee8;color:#2b211c;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">A message from Unbley</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3eee8;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6ddd5;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#2b211c;padding:24px 32px;">
                <a href="${emailSiteUrl}" style="text-decoration:none;">
                  <img src="${emailLogoUrl}" width="46" height="46" alt="Unbley" style="display:block;border:0;border-radius:10px;" />
                </a>
                <div style="color:#f7f1eb;font-size:21px;font-weight:700;letter-spacing:.2px;margin-top:12px;">Unbley</div>
                <div style="color:#cdbfb4;font-size:12px;margin-top:4px;">Commerce, beautifully organized.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 30px;font-size:15px;line-height:1.7;">
                ${html}
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #eee7e1;padding:20px 32px;color:#887a70;font-size:12px;line-height:1.6;">
                You are receiving this email from Unbley.<br />
                <a href="${emailSiteUrl}" style="color:#8a552f;text-decoration:none;">Visit unbley.com</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export async function sendEmail({ to, subject, html, text, replyTo, sender = 'zizzystores' }) {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    return { ok: false, skipped: true, error: 'RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.' };
  }

  try {
    const payload = {
      from: senderAddresses[sender] || senderAddresses.zizzystores,
      to,
      subject,
      html: wrapEmail(html || `<p style="margin:0;white-space:pre-line;">${String(text || '')}</p>`),
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
