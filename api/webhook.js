import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Only allow POST requests (from Telegram)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { body } = req;
  const URL = process.env.VITE_SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ADMIN_CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID;

  if (!URL || !KEY || !ADMIN_CHAT_ID) {
    console.error("❌ ERR: Missing environment variables on Vercel side");
    return res.status(500).json({ error: 'System configuration error' });
  }

  const supabase = createClient(URL, KEY);

  try {
    const msg = body.message;

    // We only care about replies to our concierge messages
    if (!msg || !msg.reply_to_message) {
      return res.status(200).json({ status: 'ignored' });
    }

    // 2. Verify the reply is from the authorized admin chat
    if (String(msg.chat.id) !== String(ADMIN_CHAT_ID)) {
      console.log("⚠️ Ignored reply from unauthorized chat:", msg.chat.id);
      return res.status(200).json({ status: 'unauthorized' });
    }

    // 3. Extract user email from the original "New Concierge Message" text
    const originalText = msg.reply_to_message.text || msg.reply_to_message.caption || "";
    const emailMatch = originalText.match(/\*From:\*\s+(\S+)/i) || originalText.match(/From:\s+(\S+)/i);

    if (!emailMatch) {
      console.log("⚠️ Could not find user email in the original message text.");
      return res.status(200).json({ status: 'missing_email' });
    }

    const userEmail = emailMatch[1];
    const adminReply = msg.text;

    if (!adminReply) {
      return res.status(200).json({ status: 'no_text' });
    }

    console.log(`💬 Processing Vercel reply for ${userEmail}: "${adminReply}"`);

    // 4. Insert the reply as 'admin' into Supabase
    const { error } = await supabase
      .from('concierge_messages')
      .insert([
        {
          user_email: userEmail,
          sender: 'admin',
          message: adminReply
        }
      ]);

    if (error) throw error;

    console.log(`✅ Successfully sent Vercel reply to website chat for ${userEmail}`);
    return res.status(200).json({ status: 'success' });

  } catch (err) {
    console.error("❌ Vercel Webhook Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
