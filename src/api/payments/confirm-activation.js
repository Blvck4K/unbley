import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../../lib/notifications/resend.js';
import { recordNotification } from '../../../lib/notifications/notificationStore.js';

const plans = {
  starter: { monthly: { ngn: 5000, usd: 5 }, yearly: { ngn: 50000, usd: 40 } },
  business: { monthly: { ngn: 15000, usd: 10 }, yearly: { ngn: 120000, usd: 80 } }
};

const json = (res, status, body) => res.status(status).json(body);
const serviceClient = () => createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const addPlanPeriod = (interval) => {
  const date = new Date();
  if (interval === 'yearly') date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1);
  return date.toISOString();
};

const ensureBrandProfileRow = async ({ supabase, user }) => {
  const { data: existing, error: selectError } = await supabase
    .from('brand_profiles')
    .select('id, email_address, brand_name, owner_name')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing?.id) return existing;

  const insertPayload = {
    id: user.id,
    email_address: user.email,
    brand_name: user.user_metadata?.brand_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unbley Store',
    owner_name: user.user_metadata?.full_name || user.user_metadata?.owner_name || user.email?.split('@')[0] || 'Store Owner',
    phone_number: user.user_metadata?.phone || null,
    brand_category: user.user_metadata?.category || null,
    profile_completed: false,
    store_active: false,
    trial_used: false,
    trial_ends_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: insertError } = await supabase.from('brand_profiles').insert(insertPayload);
  if (insertError) throw insertError;

  return insertPayload;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return json(res, 503, { error: 'Activation service is not configured.' });

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const { planId, interval = 'monthly', provider, reference, trial = false } = req.body || {};
  if (!token) return json(res, 401, { error: 'Authentication required.' });

  try {
    const supabase = serviceClient();
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return json(res, 401, { error: 'Invalid session.' });

    await ensureBrandProfileRow({ supabase, user: authData.user });

    const { data: existingProfile, error: profileLookupError } = await supabase
      .from('brand_profiles')
      .select('trial_used, trial_ends_at, store_active')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileLookupError) return json(res, 500, { error: 'Could not read the brand profile for this activation.' });

    const profileUpdate = {
      store_active: true,
      plan_id: trial ? null : planId,
      plan_interval: trial ? null : interval,
      plan_ends_at: trial ? null : addPlanPeriod(interval),
      trial_used: trial,
      trial_ends_at: trial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
      last_transaction_id: reference || null,
      updated_at: new Date().toISOString()
    };

    if (trial) {
      const existingTrialHasActiveWindow = Boolean(
        existingProfile?.trial_used &&
        existingProfile?.trial_ends_at &&
        new Date(existingProfile.trial_ends_at) > new Date()
      );

      if (existingTrialHasActiveWindow) {
        return json(res, 409, { error: 'Your free trial is already active.' });
      }
    } else {
      const price = plans[planId]?.[interval];
      if (!price || !reference || !['paystack', 'flutterwave'].includes(provider)) return json(res, 400, { error: 'Invalid activation plan or payment details.' });

      if (provider === 'paystack') {
        if (!process.env.PAYSTACK_SECRET_KEY) return json(res, 503, { error: 'Paystack verification is not configured.' });
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.status || payload.data?.status !== 'success' || payload.data?.currency !== 'NGN' || Number(payload.data?.amount) !== price.ngn * 100) return json(res, 402, { error: 'Activation payment could not be verified.' });
      } else {
        if (!process.env.FLUTTERWAVE_SECRET_KEY) return json(res, 503, { error: 'Flutterwave verification is not configured.' });
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(reference)}/verify`, { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.status !== 'success' || payload.data?.status !== 'successful' || payload.data?.currency !== 'USD' || Number(payload.data?.amount) !== price.usd) return json(res, 402, { error: 'Activation payment could not be verified.' });
      }
    }

    const { error: updateError } = await supabase.from('brand_profiles').update(profileUpdate).eq('id', authData.user.id);
    if (updateError) return json(res, 500, { error: 'Activation was verified but the store could not be updated.' });

    const email = authData.user.email;
    const planName = trial ? 'Unbley Free Trial' : (plans[planId]?.name || planId);
    const subject = trial ? 'Your Unbley free trial has started' : 'Your Unbley plan is now active';
    const html = `<p>Hi ${authData.user.email},</p><p>Your activation request has been processed.</p><p>Plan: ${planName}</p><p>Reference: ${reference || 'Trial started'}</p>`;
    const text = `Hi ${authData.user.email}, your Unbley activation is complete. Plan: ${planName}. Reference: ${reference || 'Trial started'}.`;
    const emailResult = await sendEmail({ to: email, subject, html, text }).catch(() => ({ ok: false, skipped: true, error: 'Email send failed.' }));

    await recordNotification({
      eventType: trial ? 'activation_trial' : 'activation_complete',
      templateSlug: trial ? 'activation_complete' : 'activation_complete',
      userId: authData.user.id,
      recipient: email,
      subject,
      body: text,
      html,
      channel: 'email',
      provider: 'resend',
      providerMessageId: emailResult?.data?.id || null,
      status: emailResult?.ok ? 'sent' : 'skipped',
      payload: { planId, interval, trial, provider, reference: reference || null },
      errorMessage: emailResult?.error || null
    });

    return json(res, 200, { ok: true, ...profileUpdate });
  } catch (error) {
    return json(res, 400, { error: error.message || 'Could not confirm activation.' });
  }
}