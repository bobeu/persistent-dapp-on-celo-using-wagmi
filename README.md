# Project Name:
- SwapLab

# Author: 
- Isaac J. 
  - Solidity/Web3 developer/Frontend.
  - Ambassador
  - Content creator

# Description

SwapLab is a small project built from Celosage tutorial that showcase how to build a decentralized ERC20 to Celo exchange. It comprises the smart contract and frontend to interact with it. CELOG token was created to act as a test token that will be exchanged for $CELO.


# Technology
This dApp is built on Celo alfajores (Celo testnet).

# Stack
- Smart contract:
  - Solidity
  - Hardhat
  - Typescript

- Frontend: 
  - NextJs
  - MaterialUI
  - Reactjs
  - Typescript

- Deployment
  - Vercel

# How to run

Compile, test and deploy contract:

- Git clone https://github.com/bobeu/feature-rich-persistent-dapp-on-celo-using-wagmi.git
- cd feature-rich-persistent-dapp-on-celo-using-wagmi/backend
- yarn install

- compile

```bash
npx hardhat compile
```

- test

```bash
mpx hardhat test
```

```bash
yarn deploy
```

To run frontend, in the same project directory, run: 

```bash
cd frontend
```

```bash
yarn install
```

```bash
yarn run dev
```