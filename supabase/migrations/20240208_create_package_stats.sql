create or replace function get_package_stats(
  user_id_param uuid,
  start_date_param timestamp,
  end_date_param timestamp
)
returns table (
  package_id text,
  count bigint
)
language sql
as $$
  select package_id, count(*)
  from purchase_intents
  where user_id = user_id_param
    and created_at >= start_date_param
    and created_at <= end_date_param
  group by package_id;
$$;

-- Create the process_payment function
CREATE OR REPLACE FUNCTION process_payment(
  transaction_id UUID,
  user_id UUID,
  coins_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Update transaction status
    UPDATE transactions
    SET 
      status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = transaction_id;

    -- Update user balance
    INSERT INTO user_balances (user_id, coins, created_at, updated_at)
    VALUES (user_id, coins_amount, NOW(), NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      coins = user_balances.coins + EXCLUDED.coins,
      updated_at = NOW();

    -- Update package stats
    INSERT INTO package_stats (
      package_id,
      total_purchases,
      total_amount,
      last_purchase_at,
      created_at,
      updated_at
    )
    SELECT
      pi.package_id,
      1,
      t.amount,
      NOW(),
      NOW(),
      NOW()
    FROM transactions t
    JOIN purchase_intents pi ON t.purchase_intent_id = pi.id
    WHERE t.id = transaction_id
    ON CONFLICT (package_id)
    DO UPDATE SET
      total_purchases = package_stats.total_purchases + 1,
      total_amount = package_stats.total_amount + EXCLUDED.total_amount,
      last_purchase_at = NOW(),
      updated_at = NOW();

  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      RAISE EXCEPTION 'Failed to process payment: %', SQLERRM;
  END;
END;
$$; 