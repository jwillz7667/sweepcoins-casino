-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS user_vip_progress CASCADE;
DROP TABLE IF EXISTS vip_levels CASCADE;
DROP TABLE IF EXISTS bonuses CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS jackpots CASCADE;
DROP TABLE IF EXISTS crypto_transactions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS game_type CASCADE;
DROP TYPE IF EXISTS game_status CASCADE;
DROP TYPE IF EXISTS bet_status CASCADE;
DROP TYPE IF EXISTS withdrawal_status CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'vip', 'admin');
CREATE TYPE transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'bet',
    'win',
    'bonus',
    'referral',
    'crypto_deposit',
    'crypto_withdrawal'
);
CREATE TYPE game_type AS ENUM ('slots', 'table', 'live', 'instant');
CREATE TYPE game_status AS ENUM ('active', 'maintenance', 'deprecated');
CREATE TYPE bet_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    sweepcoins BIGINT DEFAULT 0,
    total_wagered BIGINT DEFAULT 0,
    total_won BIGINT DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    kyc_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type game_type NOT NULL,
    provider TEXT NOT NULL,
    image_url TEXT,
    min_bet BIGINT NOT NULL,
    max_bet BIGINT NOT NULL,
    rtp DECIMAL(5,2) NOT NULL,
    volatility TEXT CHECK (volatility IN ('low', 'medium', 'high')),
    status game_status DEFAULT 'active',
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Game sessions table
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    total_bets BIGINT DEFAULT 0,
    total_wins BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bets table
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    multiplier DECIMAL(10,2),
    potential_win BIGINT,
    result JSONB,
    status bet_status DEFAULT 'pending',
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    currency TEXT DEFAULT 'SC',
    status TEXT DEFAULT 'completed',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crypto transactions table
CREATE TABLE crypto_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    network TEXT NOT NULL,
    amount_crypto DECIMAL(20,8) NOT NULL,
    amount_usd DECIMAL(20,2) NOT NULL,
    tx_hash TEXT UNIQUE,
    status withdrawal_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jackpots table
CREATE TABLE jackpots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    current_amount BIGINT NOT NULL DEFAULT 0,
    start_amount BIGINT NOT NULL,
    increment_rate DECIMAL(5,2) NOT NULL,
    last_won_at TIMESTAMP WITH TIME ZONE,
    last_won_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User favorites table
CREATE TABLE user_favorites (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, game_id)
);

-- Bonuses table
CREATE TABLE bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount BIGINT NOT NULL,
    wagering_requirement DECIMAL(10,2),
    wagered_amount BIGINT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- VIP levels table
CREATE TABLE vip_levels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    required_points BIGINT NOT NULL,
    cashback_rate DECIMAL(5,2) NOT NULL,
    weekly_bonus BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User VIP progress table
CREATE TABLE user_vip_progress (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    vip_level INTEGER REFERENCES vip_levels(id),
    points BIGINT DEFAULT 0,
    total_points BIGINT DEFAULT 0,
    last_weekly_bonus TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_game_id ON bets(game_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_crypto_transactions_user_id ON crypto_transactions(user_id);
CREATE INDEX idx_crypto_transactions_status ON crypto_transactions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crypto_transactions_updated_at
    BEFORE UPDATE ON crypto_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jackpots_updated_at
    BEFORE UPDATE ON jackpots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle transactions
CREATE OR REPLACE FUNCTION handle_transaction(
    p_user_id UUID,
    p_type transaction_type,
    p_amount BIGINT,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_balance BIGINT;
    v_new_balance BIGINT;
    v_transaction_id UUID;
BEGIN
    -- Get current balance
    SELECT sweepcoins INTO v_current_balance
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- Calculate new balance
    v_new_balance := v_current_balance + p_amount;

    -- Check if withdrawal would result in negative balance
    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- Update user balance
    UPDATE profiles
    SET sweepcoins = v_new_balance,
        total_wagered = CASE 
            WHEN p_type = 'bet' THEN total_wagered + ABS(p_amount)
            ELSE total_wagered
        END,
        total_won = CASE 
            WHEN p_type = 'win' THEN total_won + p_amount
            ELSE total_won
        END
    WHERE id = p_user_id;

    -- Create transaction record
    INSERT INTO transactions (
        id,
        user_id,
        type,
        amount,
        balance_after,
        metadata
    )
    VALUES (
        uuid_generate_v4(),
        p_user_id,
        p_type,
        p_amount,
        v_new_balance,
        jsonb_build_object('description', p_description)
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vip_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Games are viewable by everyone"
    ON games FOR SELECT
    USING (true);

CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bets"
    ON bets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bets"
    ON bets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own game sessions"
    ON game_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create game sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites"
    ON user_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
    ON user_favorites FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own crypto transactions"
    ON crypto_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own VIP progress"
    ON user_vip_progress FOR SELECT
    USING (auth.uid() = user_id); 