CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'push')),
  subject TEXT NOT NULL,
  body TEXT,
  html TEXT,
  variables JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  template_slug TEXT NULL REFERENCES public.notification_templates(slug) ON DELETE SET NULL,
  user_id UUID NULL,
  brand_id UUID NULL,
  order_id UUID NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NULL,
  body TEXT NULL,
  html TEXT NULL,
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'push')),
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'skipped', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_templates_slug ON public.notification_templates(slug);
CREATE INDEX IF NOT EXISTS idx_notifications_log_user_id ON public.notifications_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_log_brand_id ON public.notifications_log(brand_id);
CREATE INDEX IF NOT EXISTS idx_notifications_log_order_id ON public.notifications_log(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_log_event_type ON public.notifications_log(event_type);
CREATE INDEX IF NOT EXISTS idx_notifications_log_created_at ON public.notifications_log(created_at DESC);

INSERT INTO public.notification_templates (slug, name, channel, subject, body, html, variables, is_active)
VALUES
  ('activation_complete', 'Activation complete', 'email', 'Your Unbley plan is now active', 'Hi {{first_name}}, your Unbley activation is complete.', '<p>Hi {{first_name}},</p><p>Your Unbley activation is complete.</p>', '{}'::jsonb, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.notification_templates (slug, name, channel, subject, body, html, variables, is_active)
VALUES
  ('checkout_started', 'Checkout started', 'email', 'Your Unbley checkout is ready', 'Hi {{first_name}}, your checkout has started.', '<p>Hi {{first_name}},</p><p>Your checkout has started.</p>', '{}'::jsonb, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.notification_templates (slug, name, channel, subject, body, html, variables, is_active)
VALUES
  ('paid_plan_purchase', 'Paid-plan purchase', 'email', 'Payment received', 'Hi {{first_name}}, your payment has been received.', '<p>Hi {{first_name}},</p><p>Your payment has been received.</p>', '{}'::jsonb, TRUE)
ON CONFLICT (slug) DO NOTHING;
