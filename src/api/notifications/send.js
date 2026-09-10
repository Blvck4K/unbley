import { sendEmail } from '../../../lib/notifications/resend.js';
import { recordNotification } from '../../../lib/notifications/notificationStore.js';

const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const {
    to,
    subject,
    html,
    text,
    replyTo,
    eventType = 'generic_email',
    templateSlug = 'generic_email',
    userId = null,
    brandId = null,
    orderId = null,
    channel = 'email',
    provider = 'resend',
    payload = {}
  } = req.body || {};

  if (!to || !subject || (!html && !text)) {
    return json(res, 400, { error: 'to, subject, and html or text are required.' });
  }

  const result = await sendEmail({ to, subject, html, text, replyTo });
  if (!result.ok) {
    await recordNotification({
      eventType,
      templateSlug,
      userId,
      brandId,
      orderId,
      recipient: to,
      subject,
      body: text,
      html,
      channel,
      provider,
      providerMessageId: result?.data?.id || null,
      status: 'failed',
      payload,
      errorMessage: result?.error || 'Notifications could not be sent.'
    });

    return json(res, 500, { error: result.error || 'Notifications could not be sent.' });
  }

  await recordNotification({
    eventType,
    templateSlug,
    userId,
    brandId,
    orderId,
    recipient: to,
    subject,
    body: text,
    html,
    channel,
    provider,
    providerMessageId: result?.data?.id || null,
    status: 'sent',
    payload
  });

  return json(res, 200, { ok: true, messageId: result.data?.id || null });
}
