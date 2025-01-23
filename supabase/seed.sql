-- Seed VIP levels
INSERT INTO vip_levels (name, required_points, cashback_rate, weekly_bonus) VALUES
    ('Bronze', 0, 0.5, 1000),
    ('Silver', 10000, 1.0, 5000),
    ('Gold', 50000, 2.0, 15000),
    ('Platinum', 100000, 3.0, 30000),
    ('Diamond', 250000, 5.0, 50000);

-- Seed initial games
INSERT INTO games (name, description, type, provider, min_bet, max_bet, rtp, volatility, image_url) VALUES
    ('Fortune Tiger', 'Experience the luck of the tiger in this Asian-themed slot', 'slots', 'PRAGMATIC PLAY', 100, 100000, 96.3, 'medium', '/games/fortune-tiger.jpg'),
    ('Lucky Panda', 'Join the peaceful panda in a bamboo forest adventure', 'slots', 'PLAYTECH', 200, 200000, 97.5, 'high', '/games/lucky-panda.jpg'),
    ('Golden Ox', 'Celebrate prosperity with the mighty Golden Ox', 'slots', 'PRAGMATIC PLAY', 100, 150000, 95.6, 'low', '/games/golden-ox.jpg'),
    ('Buffalo King Megaways', 'Roam the prairie with the mighty Buffalo King', 'slots', 'PRAGMATIC PLAY', 500, 500000, 96.8, 'high', '/games/buffalo-king.jpg'),
    ('Jokers Jewels', 'Classic slot with a modern twist', 'slots', 'PLAYTECH', 100, 100000, 95.8, 'high', '/games/jokers-jewels.jpg'),
    ('Blackjack Pro', 'Professional Blackjack with advanced features', 'table', 'EVOLUTION', 1000, 1000000, 99.5, 'low', '/games/blackjack-pro.jpg'),
    ('European Roulette', 'Classic European Roulette with single zero', 'table', 'EVOLUTION', 100, 500000, 97.3, 'medium', '/games/european-roulette.jpg'),
    ('Lightning Baccarat', 'Baccarat with exciting multipliers', 'live', 'EVOLUTION', 500, 1000000, 98.7, 'high', '/games/lightning-baccarat.jpg'),
    ('Crazy Time', 'Interactive live game show with multipliers', 'live', 'EVOLUTION', 100, 200000, 96.8, 'high', '/games/crazy-time.jpg'),
    ('Mines', 'Thrilling instant game with increasing multipliers', 'instant', 'IN-HOUSE', 100, 100000, 97.0, 'high', '/games/mines.jpg'),
    ('Plinko', 'Popular ball-dropping instant game', 'instant', 'IN-HOUSE', 100, 100000, 99.0, 'medium', '/games/plinko.jpg');

-- Seed jackpots
INSERT INTO jackpots (name, current_amount, start_amount, increment_rate) VALUES
    ('Mini Jackpot', 1000000, 1000000, 0.1),
    ('Major Jackpot', 5000000, 5000000, 0.2),
    ('Grand Jackpot', 10000000, 10000000, 0.5);

-- Seed bonus types (for reference in application logic)
COMMENT ON TABLE bonuses IS 'Bonus types:
- welcome_bonus: First deposit bonus
- reload_bonus: Regular deposit bonus
- cashback: Weekly cashback bonus
- vip_bonus: Special VIP bonus
- loyalty_bonus: Monthly loyalty bonus
- referral_bonus: Bonus for referring new users';

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email TEXT,
    admin_password TEXT,
    admin_username TEXT
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Insert into auth.users (requires proper auth schema setup)
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
    VALUES (admin_email, crypt(admin_password, gen_salt('bf')), now(), 'authenticated')
    RETURNING id INTO v_user_id;

    -- Insert into profiles
    INSERT INTO profiles (id, email, username, role)
    VALUES (v_user_id, admin_email, admin_username, 'admin');

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Note: To create an admin user, run:
-- SELECT create_admin_user('admin@example.com', 'secure_password', 'admin');
-- Remember to replace with actual admin credentials in production

-- Create RLS Policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Games policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games are viewable by everyone"
    ON games FOR SELECT
    USING (true);

-- Transactions policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Bets policies
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bets"
    ON bets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bets"
    ON bets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Game sessions policies
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game sessions"
    ON game_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create game sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User favorites policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
    ON user_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
    ON user_favorites FOR ALL
    USING (auth.uid() = user_id);

-- Crypto transactions policies
ALTER TABLE crypto_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crypto transactions"
    ON crypto_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- VIP progress policies
ALTER TABLE user_vip_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own VIP progress"
    ON user_vip_progress FOR SELECT
    USING (auth.uid() = user_id); 