
# Voting System

Voting is the most important festival for any country with Democracy. It is vital to have a fair and transparent elections without any interference from outside force to protect the future and integrity of the country.

So, here is a system that utilizes the strength of blockchain to conduct transparent, fair and anonymous elections while saving a lot of money spent on conducting the elections. I have tried to create a small demo on how things can work.

## Installation

Installation and running the project is a bit tedious but fun. Once it starts running it can be a really good place for someone to start learning about smart-contracts, connecting them with Frontend. In this, I have used **Ganache**, **Truffle** to work with smart contracts.

```bash
  git clone https://github.com/shashank-crypto/Voting-System
  cd Voting-System
```
Installing npm packages 

```bash
  npm install
```
#### To run contracts

```
npm i -g truffle
```

```
cd contracts
```
To compile your contracts and create abis
```
truffle compile
```
To migrate the contracts and run them on your ganache server 

*need to have correct configs in **truffle-config.js***
```
truffle migrate
```

Copy the contract address *(result of migration)*, open `controllers/contractConnect.js` and change `0x6c2559Cad2D3ca535427D036CDBaAE5B3B965195` with copied address.

#### To start frontend

```
cd ..
```

```
npm run build
```
Go to http://localhost:3000

Need to have Metamask chrome extension installed and setup done. Import few accounts from **Ganache**

#### Happy Exploring
## Features

- Creating elections
- Election creator are automatically assumed with Admin access
- Register in an election as Voter or Candidate
- Needs approval from Admin to participate
- Can check your status or general registered info


## Running Tests

To run tests, run the following command

```bash
  npm install cypress
  cypress open
```


## Tech Stack

**Client:** NextJS, Bulma, CSS

**Server:** Ganache, Truffle, Web3, Solidity


## Authors

- [@shashank-crypto](https://www.github.com/shashank-crypto)


## Feedback

If you have any feedback, please reach out to me at shashank.k.chaudhary@gmail.com


## License

[MIT](https://choosealicense.com/licenses/mit/)

