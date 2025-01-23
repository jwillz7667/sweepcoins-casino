-- Seed VIP levels
SET IDENTITY_INSERT casino.vip_levels ON;
INSERT INTO casino.vip_levels (id, name, required_points, cashback_rate, weekly_bonus) VALUES
    (1, 'Bronze', 0, 0.5, 1000),
    (2, 'Silver', 10000, 1.0, 5000),
    (3, 'Gold', 50000, 2.0, 15000),
    (4, 'Platinum', 100000, 3.0, 30000),
    (5, 'Diamond', 250000, 5.0, 50000);
SET IDENTITY_INSERT casino.vip_levels OFF;

-- Seed initial games
DECLARE @game1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @game2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @game3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @game4_id UNIQUEIDENTIFIER = NEWID();
DECLARE @game5_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO casino.games (id, name, description, type, provider, min_bet, max_bet, rtp, volatility, image_url) VALUES
    (@game1_id, 'Fortune Tiger', 'Experience the luck of the tiger in this Asian-themed slot', 'slots', 'PRAGMATIC PLAY', 100, 100000, 96.3, 'medium', '/games/fortune-tiger.jpg'),
    (@game2_id, 'Lucky Panda', 'Join the peaceful panda in a bamboo forest adventure', 'slots', 'PLAYTECH', 200, 200000, 97.5, 'high', '/games/lucky-panda.jpg'),
    (@game3_id, 'Golden Ox', 'Celebrate prosperity with the mighty Golden Ox', 'slots', 'PRAGMATIC PLAY', 100, 150000, 95.6, 'low', '/games/golden-ox.jpg'),
    (@game4_id, 'Buffalo King Megaways', 'Roam the prairie with the mighty Buffalo King', 'slots', 'PRAGMATIC PLAY', 500, 500000, 96.8, 'high', '/games/buffalo-king.jpg'),
    (@game5_id, 'Jokers Jewels', 'Classic slot with a modern twist', 'slots', 'PLAYTECH', 100, 100000, 95.8, 'high', '/games/jokers-jewels.jpg');

-- Seed jackpots
DECLARE @jackpot1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @jackpot2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @jackpot3_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO casino.jackpots (id, name, current_amount, start_amount, increment_rate) VALUES
    (@jackpot1_id, 'Mini Jackpot', 1000000, 1000000, 0.1),
    (@jackpot2_id, 'Major Jackpot', 5000000, 5000000, 0.2),
    (@jackpot3_id, 'Grand Jackpot', 10000000, 10000000, 0.5); 