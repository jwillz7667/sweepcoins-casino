-- Create schema
CREATE SCHEMA casino;
GO

-- Create enum equivalent tables (since Azure SQL doesn't support ENUMs)
CREATE TABLE casino.user_roles (
    role_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE casino.transaction_types (
    type_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE casino.game_types (
    type_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE casino.game_statuses (
    status_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE casino.bet_statuses (
    status_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE casino.withdrawal_statuses (
    status_name VARCHAR(50) PRIMARY KEY
);

-- Insert enum values
INSERT INTO casino.user_roles (role_name) VALUES ('user'), ('vip'), ('admin');
INSERT INTO casino.transaction_types (type_name) VALUES 
    ('deposit'), ('withdrawal'), ('bet'), ('win'), ('bonus'), ('referral'),
    ('crypto_deposit'), ('crypto_withdrawal');
INSERT INTO casino.game_types (type_name) VALUES ('slots'), ('table'), ('live'), ('instant');
INSERT INTO casino.game_statuses (type_name) VALUES ('active'), ('maintenance'), ('deprecated');
INSERT INTO casino.bet_statuses (status_name) VALUES ('pending'), ('completed'), ('cancelled');
INSERT INTO casino.withdrawal_statuses (status_name) VALUES ('pending'), ('approved'), ('rejected'), ('completed');

-- Users table
CREATE TABLE casino.profiles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username NVARCHAR(255) UNIQUE,
    email NVARCHAR(255) UNIQUE,
    avatar_url NVARCHAR(MAX),
    role VARCHAR(50) REFERENCES casino.user_roles(role_name) DEFAULT 'user',
    sweepcoins BIGINT DEFAULT 0,
    total_wagered BIGINT DEFAULT 0,
    total_won BIGINT DEFAULT 0,
    referral_code NVARCHAR(255) UNIQUE,
    referred_by UNIQUEIDENTIFIER REFERENCES casino.profiles(id),
    kyc_verified BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Games table
CREATE TABLE casino.games (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    type VARCHAR(50) REFERENCES casino.game_types(type_name) NOT NULL,
    provider NVARCHAR(255) NOT NULL,
    image_url NVARCHAR(MAX),
    min_bet BIGINT NOT NULL,
    max_bet BIGINT NOT NULL,
    rtp DECIMAL(5,2) NOT NULL,
    volatility VARCHAR(10) CHECK (volatility IN ('low', 'medium', 'high')),
    status VARCHAR(50) REFERENCES casino.game_statuses(status_name) DEFAULT 'active',
    popularity_score INT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Game sessions table
CREATE TABLE casino.game_sessions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES casino.profiles(id) ON DELETE CASCADE,
    game_id UNIQUEIDENTIFIER REFERENCES casino.games(id) ON DELETE CASCADE,
    start_time DATETIME2 DEFAULT SYSDATETIME(),
    end_time DATETIME2,
    total_bets BIGINT DEFAULT 0,
    total_wins BIGINT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Bets table
CREATE TABLE casino.bets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES casino.profiles(id) ON DELETE CASCADE,
    game_id UNIQUEIDENTIFIER REFERENCES casino.games(id) ON DELETE CASCADE,
    session_id UNIQUEIDENTIFIER REFERENCES casino.game_sessions(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    multiplier DECIMAL(10,2),
    potential_win BIGINT,
    result NVARCHAR(MAX), -- JSON string in Azure SQL
    status VARCHAR(50) REFERENCES casino.bet_statuses(status_name) DEFAULT 'pending',
    resolved_at DATETIME2,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Transactions table
CREATE TABLE casino.transactions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES casino.profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) REFERENCES casino.transaction_types(type_name) NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    currency NVARCHAR(10) DEFAULT 'SC',
    status NVARCHAR(50) DEFAULT 'completed',
    metadata NVARCHAR(MAX), -- JSON string in Azure SQL
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Crypto transactions table
CREATE TABLE casino.crypto_transactions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES casino.profiles(id) ON DELETE CASCADE,
    transaction_id UNIQUEIDENTIFIER REFERENCES casino.transactions(id) ON DELETE CASCADE,
    wallet_address NVARCHAR(255) NOT NULL,
    network NVARCHAR(50) NOT NULL,
    amount_crypto DECIMAL(20,8) NOT NULL,
    amount_usd DECIMAL(20,2) NOT NULL,
    tx_hash NVARCHAR(255) UNIQUE,
    status VARCHAR(50) REFERENCES casino.withdrawal_statuses(status_name) DEFAULT 'pending',
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Jackpots table
CREATE TABLE casino.jackpots (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    current_amount BIGINT NOT NULL DEFAULT 0,
    start_amount BIGINT NOT NULL,
    increment_rate DECIMAL(5,2) NOT NULL,
    last_won_at DATETIME2,
    last_won_by UNIQUEIDENTIFIER REFERENCES casino.profiles(id),
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

-- User favorites table
CREATE TABLE casino.user_favorites (
    user_id UNIQUEIDENTIFIER REFERENCES casino.profiles(id) ON DELETE CASCADE,
    game_id UNIQUEIDENTIFIER REFERENCES casino.games(id) ON DELETE CASCADE,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    PRIMARY KEY (user_id, game_id)
);

-- Bonuses table
CREATE TABLE casino.bonuses (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES casino.profiles(id) ON DELETE CASCADE,
    type NVARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    wagering_requirement DECIMAL(10,2),
    wagered_amount BIGINT DEFAULT 0,
    expires_at DATETIME2,
    claimed_at DATETIME2,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

-- VIP levels table
CREATE TABLE casino.vip_levels (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    required_points BIGINT NOT NULL,
    cashback_rate DECIMAL(5,2) NOT NULL,
    weekly_bonus BIGINT NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

-- User VIP progress table
CREATE TABLE casino.user_vip_progress (
    user_id UNIQUEIDENTIFIER PRIMARY KEY REFERENCES casino.profiles(id) ON DELETE CASCADE,
    vip_level INT REFERENCES casino.vip_levels(id),
    points BIGINT DEFAULT 0,
    total_points BIGINT DEFAULT 0,
    last_weekly_bonus DATETIME2,
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

-- Create indexes
CREATE INDEX idx_transactions_user_id ON casino.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON casino.transactions(created_at);
CREATE INDEX idx_bets_user_id ON casino.bets(user_id);
CREATE INDEX idx_bets_game_id ON casino.bets(game_id);
CREATE INDEX idx_game_sessions_user_id ON casino.game_sessions(user_id);
CREATE INDEX idx_crypto_transactions_user_id ON casino.crypto_transactions(user_id);
CREATE INDEX idx_crypto_transactions_status ON casino.crypto_transactions(status);

-- Create updated_at triggers
GO
CREATE TRIGGER casino.trg_profiles_updated_at
ON casino.profiles
AFTER UPDATE
AS
BEGIN
    UPDATE casino.profiles
    SET updated_at = SYSDATETIME()
    FROM casino.profiles p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

CREATE TRIGGER casino.trg_games_updated_at
ON casino.games
AFTER UPDATE
AS
BEGIN
    UPDATE casino.games
    SET updated_at = SYSDATETIME()
    FROM casino.games g
    INNER JOIN inserted i ON g.id = i.id;
END;
GO

CREATE TRIGGER casino.trg_crypto_transactions_updated_at
ON casino.crypto_transactions
AFTER UPDATE
AS
BEGIN
    UPDATE casino.crypto_transactions
    SET updated_at = SYSDATETIME()
    FROM casino.crypto_transactions ct
    INNER JOIN inserted i ON ct.id = i.id;
END;
GO

CREATE TRIGGER casino.trg_jackpots_updated_at
ON casino.jackpots
AFTER UPDATE
AS
BEGIN
    UPDATE casino.jackpots
    SET updated_at = SYSDATETIME()
    FROM casino.jackpots j
    INNER JOIN inserted i ON j.id = i.id;
END;
GO

-- Create transaction handling stored procedure
CREATE PROCEDURE casino.handle_transaction
    @user_id UNIQUEIDENTIFIER,
    @type VARCHAR(50),
    @amount BIGINT,
    @description NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @current_balance BIGINT;
    DECLARE @new_balance BIGINT;
    DECLARE @transaction_id UNIQUEIDENTIFIER;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Get current balance with lock
        SELECT @current_balance = sweepcoins
        FROM casino.profiles WITH (UPDLOCK)
        WHERE id = @user_id;
        
        -- Calculate new balance
        SET @new_balance = @current_balance + @amount;
        
        -- Check for negative balance
        IF @new_balance < 0
            THROW 50000, 'Insufficient balance', 1;
            
        -- Update user balance
        UPDATE casino.profiles
        SET sweepcoins = @new_balance,
            total_wagered = CASE 
                WHEN @type = 'bet' THEN total_wagered + ABS(@amount)
                ELSE total_wagered
            END,
            total_won = CASE 
                WHEN @type = 'win' THEN total_won + @amount
                ELSE total_won
            END
        WHERE id = @user_id;
        
        -- Create transaction record
        SET @transaction_id = NEWID();
        
        INSERT INTO casino.transactions (
            id,
            user_id,
            type,
            amount,
            balance_after,
            metadata
        )
        VALUES (
            @transaction_id,
            @user_id,
            @type,
            @amount,
            @new_balance,
            JSON_MODIFY('{}', '$.description', @description)
        );
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
        RETURN 1;
    END CATCH;
END;
GO 