import { config as CONFIG } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

CONFIG();

const PRIVATE_KEY = process.env.PRIVATE;

const config: HardhatUserConfig = {
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`${process.env.PRIVATE_KEY_CELO}`],
      chainId: 44787,
    },
  },

  namedAccounts: {
    deployer: 0,
    feeTo: String(process.env.DEPLOYER)
  },

  solidity: {
    version: "0.8.17",
    settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "byzantium"
      }
    },
};

export default config;
