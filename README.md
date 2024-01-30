# Lottery Smart Contract Project

This project is a Lottery Smart Contract implemented using Solidity and Hardhat. It uses block timestamp/difficulty as a source of randomness.

## Project Structure

The project is structured as follows:

- `contracts/`: Contains the Solidity contracts for the Lottery.
- `scripts/`: Contains the deployment scripts for the contracts.
- `test/`: Contains the test scripts for the contracts.
- `deploy/`: Contains the deployment configuration for the contracts.
- `hardhat.config.ts`: Contains the configuration for Hardhat.
- `package.json`: Contains the project dependencies and scripts.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a local Ethereum blockchain such as Hardhat Network or Ganache.
- You have an Alchemy API key and a private key for an Ethereum account.

## Setting Up

1. Clone the repository to your local machine

2. Install the project dependencies by running

```sh
npm install
```

3. Create a `.env` file in the root directory of the project and add your Alchemy API key and private key

```env
PRIVATE_KEY="your-private-key"
ALCHEMY_API_KEY="your-alchemy-api-key"
````

## Deploying the Lottery Contract Locally

1. Start your local node

```sh
npx hardhat node --no-deploy
```

2. Deploy the Lottery contract to your local node (Open another terminal)

```sh
npx hardhat deploy --network localhost --tags Lottery
```

## Testing the Lottery Contract Locally

1. Run the tests for the Lottery contract

```sh
npx hardhat test --network localhost test/01_lotteryTest.ts
```

## Deploying the Lottery Contract to a Live Network

1. Deploy the Lottery contract to a live network

```sh
npx hardhat deploy --network <blockchain-network> --tags Lottery
```

> **Note:** Please replace `<blockchain-network>` with the name of the Ethereum network you want to deploy to.
