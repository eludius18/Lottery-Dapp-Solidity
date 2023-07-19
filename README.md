## Deploy Lottery Smart Contract

```shell
npm install
npx hardhat node --no-deploy
npx hardhat deploy --network localhost --tags Lottery
npx hardhat test --network localhost test/01_lotteryTest.ts

npx hardhat deploy --network <blockchain-network> --tags Lottery
``
