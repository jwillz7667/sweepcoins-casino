-- Create enum for invoice statuses
CREATE TYPE invoice_status AS ENUM (
  'new',
  'processing',
  'settled',
  'expired',
  'invalid'
);

-- Create enum for purchase intent statuses
CREATE TYPE purchase_intent_status AS ENUM (
  'created',
  'processing',
  'completed',
  'expired',
  'failed'
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  package_id TEXT NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  status invoice_status NOT NULL DEFAULT 'new',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processing_started_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  invalidated_at TIMESTAMPTZ
);

-- Create purchase_intents table
CREATE TABLE IF NOT EXISTS purchase_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  package_id TEXT NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  status purchase_intent_status NOT NULL DEFAULT 'created',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ
);

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  invoice_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_id ON invoices(invoice_id);
CREATE INDEX idx_purchase_intents_user_id ON purchase_intents(user_id);
CREATE INDEX idx_purchase_intents_status ON purchase_intents(status);
CREATE INDEX idx_webhook_logs_invoice_id ON webhook_logs(invoice_id);
CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);

-- Create function to add coins to user
CREATE OR REPLACE FUNCTION add_user_coins(
  user_id UUID,
  coins_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET sweepcoins = COALESCE(sweepcoins, 0) + coins_amount
  WHERE id = user_id;
END;
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_intents_updated_at
  BEFORE UPDATE ON purchase_intents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for purchase_intents
CREATE POLICY "Users can view their own purchase intents"
  ON purchase_intents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for webhook_logs (admin only)
CREATE POLICY "Only admins can view webhook logs"
  ON webhook_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  ); 