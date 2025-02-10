-- Create games table if not exists
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    min_bet INTEGER NOT NULL DEFAULT 1,
    max_bet INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wins table
CREATE TABLE IF NOT EXISTS wins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verification_note TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row
    maintenance_mode BOOLEAN DEFAULT false,
    registration_enabled BOOLEAN DEFAULT true,
    min_deposit_amount DECIMAL(10,2) DEFAULT 10.00,
    max_deposit_amount DECIMAL(10,2) DEFAULT 1000.00,
    default_user_coins INTEGER DEFAULT 100,
    max_daily_withdrawals INTEGER DEFAULT 3,
    support_email TEXT,
    terms_url TEXT,
    privacy_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add triggers for updated_at columns
DO $$ BEGIN
    CREATE TRIGGER update_wins_updated_at
        BEFORE UPDATE ON wins
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_refunds_updated_at
        BEFORE UPDATE ON refunds
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_system_settings_updated_at
        BEFORE UPDATE ON system_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_games_updated_at
        BEFORE UPDATE ON games
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add RLS policies
ALTER TABLE wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON wins;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON wins;
DROP POLICY IF EXISTS "Enable update for admins" ON wins;
DROP POLICY IF EXISTS "Enable read access for all users" ON announcements;
DROP POLICY IF EXISTS "Enable write access for admins" ON announcements;
DROP POLICY IF EXISTS "Enable read access for admins" ON audit_logs;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON audit_logs;
DROP POLICY IF EXISTS "Enable read access for all users" ON system_settings;
DROP POLICY IF EXISTS "Enable write access for admins" ON system_settings;
DROP POLICY IF EXISTS "Enable read access for admins" ON refunds;
DROP POLICY IF EXISTS "Enable write access for admins" ON refunds;
DROP POLICY IF EXISTS "Enable read access for all users" ON games;
DROP POLICY IF EXISTS "Enable write access for admins" ON games;

-- Wins policies
CREATE POLICY "Enable read access for all users" ON wins
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON wins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for admins" ON wins
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Announcements policies
CREATE POLICY "Enable read access for all users" ON announcements
    FOR SELECT USING (
        status = 'published'
        OR EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

CREATE POLICY "Enable write access for admins" ON announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Audit logs policies
CREATE POLICY "Enable read access for admins" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

CREATE POLICY "Enable insert for authenticated users" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- System settings policies
CREATE POLICY "Enable read access for all users" ON system_settings
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for admins" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Refunds policies
CREATE POLICY "Enable read access for admins" ON refunds
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

CREATE POLICY "Enable write access for admins" ON refunds
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Games policies
CREATE POLICY "Enable read access for all users" ON games
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for admins" ON games
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS wins_user_id_idx ON wins(user_id);
CREATE INDEX IF NOT EXISTS wins_status_idx ON wins(status);
CREATE INDEX IF NOT EXISTS announcements_status_idx ON announcements(status);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS audit_logs_entity_type_idx ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS refunds_invoice_id_idx ON refunds(invoice_id);
CREATE INDEX IF NOT EXISTS refunds_status_idx ON refunds(status); 