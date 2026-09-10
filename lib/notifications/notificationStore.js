import { createClient } from '@supabase/supabase-js';

const serviceClient = () => createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function recordNotification({
  supabase = null,
  eventType = 'email',
  templateSlug = 'generic_email',
  userId = null,
  brandId = null,
  orderId = null,
  recipient = null,
  subject = null,
  body = null,
  html = null,
  channel = 'email',
  provider = 'resend',
  providerMessageId = null,
  status = 'sent',
  payload = {},
  errorMessage = null
}) {
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !recipient) {
    return { ok: false, skipped: true, error: 'Supabase service-notification logging is not configured.' };
  }

  try {
    const client = supabase || serviceClient();
    const { error } = await client.from('notifications_log').insert({
      event_type: eventType,
      template_slug: templateSlug,
      user_id: userId,
      brand_id: brandId,
      order_id: orderId,
      recipient_email: recipient,
      subject,
      body,
      html,
      channel,
      provider,
      provider_message_id: providerMessageId,
      status,
      payload,
      error_message: errorMessage,
      created_at: new Date().toISOString()
    });

    if (error) {
      return { ok: false, skipped: true, error: error.message || 'Could not create notification log record.' };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    return { ok: false, skipped: true, error: error.message || 'Could not create notification log record.' };
  }
}
