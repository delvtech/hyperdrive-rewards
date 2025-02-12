// Hyperdrive Pool
// [ epoch 0 ] - [ epoch 1 ] - [ epoch 2 ] - [ epoch 3 ] - Pending amount
// calculate the total LP and short for each epoch
// User
// [ epoch 0 ] - [ epoch 1 ] - [ epoch 2 ] - [ epoch 3 ] - Pending amount
// calculate the total user LP and short for each epoch in each hyperdrive pool
// compare to the total LP and short for each epoch in each hyperdrive pool
// apply the reward amount per token per epoch per hyperdrive pool and also the pending amount
// An epoch is reward and pool specific.
// i.e.
// Hypderdrive Address 0xUSD/MORPHO which collects Miles and Morpho rewards
// block 0 --------- block 1000 --------- block 2000 --------- block 3000
// epoch for Morpho might be:
// [---------------------][--------------------]
// but the epoch for Well might be:
//  [---------------------][---------------------]
// So they can overlap, even if we try to collect at the same time, they might be off by a couple blocks
export function convertBigIntToString<T>(input: T): T {
    if (Array.isArray(input)) {
        return input.map(convertBigIntToString) as T;
    } else if (typeof input === "object" && input !== null) {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [
                key,
                typeof value === "bigint"
                    ? value.toString()
                    : convertBigIntToString(value),
            ]),
        ) as T;
    }
    return input;
}
