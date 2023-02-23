# Project Name:
- DRythm

# Author: 
- Isaac J. 
  - Solidity/Web3 developer.
  - Frontend dev.
  - Ambassador

# Team size: 1

# Project description

DRythm is decentralized platform for sharing music i.e uploading and downloading musics built for the love for Web3 and Polygon. It is permissionless platform that brings music sharing onto the blockchain. Users are able to access the platform via their wallet addresses and pay for the service in the platform token - *"RYM"*.

# RYM Token
A native utility Token of the DRythm platform that gives holders full access to the platform.
- Model
  - ERC20 Standard
  - Burnable
  Name: 
    - RYM Token
  
  Decimals:
    - 18

  Symbols:
    - RYM

  Total Supply:
    - 50_000_000

  Type:
    - Deflationary

# How it works
There are basically two types of users: 

### Uploader: 
Could be anyone licensed to handle such songs or the singer themselves.
They earn continuosly on each song they uploaded whenever it is consumed by others.

### Downloader
This a category of users that actually consume the songs/file uploaded. They pay a very minimal amount as fee for downloading any songs (either video or audio). The fee is collected and divided between the platform and the Uploader of the song. 
The amount accrued to the platform is sent to a blackhole i.e burnt. This mechanism is healthy for the growth of the platform and its token.

# Why build this?
Music is life. Infact everyone loves music. We all have at least one song that ministers courage, hope, etc to us. It is our soft point. Sometimes ago, I was looking to download some songs. I visited Amazon only to discovered it would cost me about $130 to download just 2 songs. My status wasn't going to make me afford such amount. 

I thought about: 

- What if we have such platform that runs on the blockchan?
- What about the world where everyone should be able to afford something that really makes them happy.
- How can we remove such gigantic cost?

I found an answer while brainstorming. Blockchain is perfect for this. With its accomodating nature, we could leverage blockchain to provide such service that makes people happy.

-----------------------

`Note`: This app is in development as I improve on it overtime. So you might witness rapid prototyping.

# Functionalities

This dApp has *3* basic functionalities.

- Upload : Upload songs and file such as music, resumez etc as it may be added from time to time.
- Download: File consumers are able to download files such as music/songs etc.
- RemoveFile: Enables uploaders to remove files they've uploaded if they wish to.

# Technology used
Amidst of numerous blockchain networks, I selected Polygon for its cheaper gas cost and scalability so that when the platform starts gaining more people, it would be able to absorb traffic.

# Stack used
### Smart contract:
- Language
  - Solidity

### Web3 Tools
  - Hardhat
  - Typescript

### Frontend: 
  - NextJs
  - MaterialUI
  - Reactjs
  - Typescript

- File management/backend
  - IPFS ( although I am planning to save the data onchain if possible, and if will be cheaper for users to interact with).
  - firebase

- Deployment
  - Vercel

# How to run the application
To compile and test contract:

- Git clone https://github.com/bobeu/metaverse-hackathon.git
- cd metaverse-hackathon/backend
- yarn install

### compile
```
npx hardhat compile

```

### test
```
mpx hardhat test

```


To run frontend, in the same project directory, or if you're in the backend folder, `cd ..`.

```
yarn install

```

```
yarn run dev

```

Video demonstration: **[Loom recording](https://www.loom.com/share/c776c35f5f5d445e935c87fd6d0d53c2)**
