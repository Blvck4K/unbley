import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => res.status(status).json(body);
const cleanText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed.' });

  const email = cleanText(req.body?.email, 254);
  const message = cleanText(req.body?.message, 4000);
  const userId = req.body?.userId || null;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return json(res, 400, { ok: false, error: 'A valid email address is required.' });
  }
  if (!message) return json(res, 400, { ok: false, error: 'Message cannot be empty.' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[concierge] Supabase server configuration is missing.');
    return json(res, 503, { ok: false, error: 'Customer service is temporarily unavailable.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { error: databaseError } = await supabase
    .from('concierge_messages')
    .insert([{ user_email: email, sender: 'user', message, user_id: userId }]);

  if (databaseError) {
    console.error('[concierge] Could not save message:', databaseError.message);
    return json(res, 503, { ok: false, error: 'Customer service is temporarily unavailable. Please try WhatsApp instead.' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;
  if (botToken && chatId) {
    const telegramMessage = [
      'New Unbley Concierge Message',
      `From: ${email}`,
      `Type: ${userId ? 'Logged User' : 'Guest'}`,
      '',
      message,
      '',
      "Reply to this message with 'Reply: <your message>' to send back to the user."
    ].join('\n');

    try {
      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: telegramMessage, disable_notification: false })
      });
      if (!telegramResponse.ok) {
        console.error('[concierge] Telegram notification failed:', await telegramResponse.text());
      }
    } catch (error) {
      console.error('[concierge] Telegram notification error:', error.message);
    }
  }

  return json(res, 200, { ok: true });
}
