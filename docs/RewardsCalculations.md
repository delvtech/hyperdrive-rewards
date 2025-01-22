Rewards Calculations

Basic idea is to reward variable positions in Hyperdrive. Fixed positions will not receive rewards.

So, we need to calculate the variable exposure for short positions and lp positions.

Short positions are easy, its just the base proceeds the short has access to.

LPs are a little trickier, we need to figure the portion of LPs that are idle or backing longs.

We know the total supply of LP shares of the pool, and we know the user's LP shares,
so we can get the user's share of the pool.

The pool's total amount of funds receiving rewards is the share reserves.

Share reserves already account for the number of longs and shorts in the pool. When longs are opened,
the share reserves go up, and when shorts are opened, the share reserves go down. So this means
the share reserves tell us the exact amount of base that the LPs have that are idle and backing longs.

Get total vault shares minus shorts outstanding = LP portion of vault shares = share reserves.

So, in other words, LP portion + shorts outstanding = share reserves (total vault shares).

If we need to weight differently to reward LPs more/less than shorts we can do this:
A*LP + B*shorts = share reserves

---

Hyperdrive deposits tokens into underlying vault, those tokens earn rewards. If we can calculate the
total amount of rewards for a given time period, i.e. 100 ELFI, then we can divvy those up to the users.

First, we split the amount up between shorts and LPs

short total rewards = shorts outstanding / share reserves
lp total rewards = (share reserves - shorts outstanding) / share reserves

then for each user we need their time weighted average of shorts,
to get this we need to add the time weighted sums of the total shorts outstanding and the user's short positions.
then we simply divide the users sum by the total sum to get the pertage and then multiply by the short total rewards.
the easiest way to do this is to go block by block and calculate percentages. then a simple average of the percentages will work.

start with an amount = share*reserves (from pool config or yield source)
break into two sub-amounts: share_reserves_for_LPs and share_reserves_for_shorts
for each position:
if short:
amount_earned += (short_amount / total_shorts) * share_reserves_for_shorts
if LP:
amount_earned += (LP_amount / total_LPs) \* share_reserves_for_LPs

final data:

```
t trader amount_earned tokens
0 X 25% 10
1 X 25% 20
2 X 25% 30
```

NOTE: shares increase in between trades for rebasing tokens only

```
t trader vault_shares_amount
0 X      2.5
0.1      5      possible source of error: when did vault shares increase?
0.9      5      possible source of error: when did vault shares increase?
1 X      5
6 X      7.5
10 X     7.5
```

safest thing is to call balanceOf(share_token_address, hyperdrive_pool_address) every block

- let's circle back if this is infeasible

time_weighted_vault_shares = Sum(t_delta \* vault_shares_amount) / (t_elapsed)
rewards = time_weighted_amount\*emission_rate

time*weighted_vault_shares = (2.5 * 1) + (5 \_ 5) + (7.5 \* 4) / 10 = 5.75 tokens / 10 blocks

# if we only know the rate

emission_rate = 10 rewards per token per block = 100 rewards per token per 10 blocks
rewards = 5.75 \* 100 = 575

# if we know the total rewards over the time period

rewards = time_weighted_vault_shares / total_time_weighted_vault_shares \* total_rewards
