import * as dotenv from 'dotenv'

import { type HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import 'solidity-docgen'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.14',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.5.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: 0
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: [2500, 3000],
        mempool: {
          order: 'fifo'
        }
      }
    },
    localhost: {
      url: 'http://127.0.0.1:8545'
    }
  },
  etherscan: {
    apiKey: {
    }
  },
  gasReporter: {
    token: 'ETH',
    enabled: true,
    currency: 'USD',
    coinmarketcap: process.env.ALCHEMY_API_KEY,
    showTimeSpent: true,
    noColors: true
  },
  docgen: {
    outputDir: 'docs',
    pages: () => 'api.md'
  }
}

export default config
