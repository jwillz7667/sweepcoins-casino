create or replace function deduct_user_coins(
  user_id_param uuid,
  coins_amount integer
) returns void
language sql
as $$
  update user_balances
  set 
    coins = coins - coins_amount,
    updated_at = now()
  where user_id = user_id_param;
$$; 