## Hyperdrive Rewards

Hyperdrive Rewards is a repository for claiming and redistributing rewards collected though Hyperdrive pools to the users that have interacted with those pools. Because Hyperdrive pools wrap yield sources that collect points and tokens as incentives to use those yield sources, we must distribute those rewards to the users of the Hyperdrive pools. Rewards are currently distributed amonst users that have either provided liquidity to the pools or opened shorts. This repository contains all the code necessary for:

1. Providing an API server to fetch reward information for each user.
2. Claiming rewards each Hyperdrive pool has earned from its wrapped yield source.
3. Transferring rewards from the Hyperdrive pools to the Hyperdrive rewards contract.
4. Generating the merkle tree for rewards and updating the rewards contract with the new merkle root.

## Documentation

### Build

to build the production version of the server, simply run:

```shell
$ yarn build
```

### Local Development

This repository can be run locally for development purposes. To spin up a local development environment, you'll need to spin up a local anvil fork and deploy contracts. First, you'll need to make sure that your environment is NOT set to production:

```
#.env
NODE_ENV=development
```

#### Setup Anvil

```shell
$ npx run anvil:fork
```

#### Deploy Contracts

```shell
$ npx run deploy:local
```

After deploying the contracts, copy the address to the .env file:

```
#.env
REWARDS_CONTRACT=0x1234...ABCD
```

#### Database

The source code is automatically set up to connect to the remote database hosted on AWS. In development mode, a test database "rewards_test" is used. This should be considered reliable or complete. Feel free to edit, delete or add data here for testing and development purposes.

To populate the database with the trade events, simply run:

```shell
$ npx ts-node --require tsconfig-paths/register src/tasks/saveEvents.ts
```

### Help
