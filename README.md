Coin Flip Game
Overview
The Coin Flip Game is a decentralized application (dApp) built on the Polygon Mumbai Testnet. Users can connect their wallets, place a bet, and flip a coin. The game smart contract determines the outcome and rewards the user based on their guess.

Project Structure
Frontend (React): Provides the user interface to interact with the blockchain.
Smart Contract (Solidity): Implements the coin flip logic on the blockchain.
Backend: Utilizes Hardhat for contract deployment and interaction.
Prerequisites
Node.js: Make sure Node.js is installed on your machine.
MetaMask: Install the MetaMask extension in your browser to interact with the Ethereum blockchain.
Setup
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-repo/coin-flip.git
cd coin-flip
2. Install Dependencies
Install the required packages for the frontend and backend:

bash
Copy code
npm install
3. Smart Contract Development
Contract File
CoinFlip.sol: The smart contract file located in the contracts folder.
solidity
Copy code
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool guess) public payable returns (bool) {
        require(msg.value > 0, "Must bet some tokens");
        
        // Generate a random number
        bool result = block.timestamp % 2 == 0;

        if (result == guess) {
            payable(msg.sender).transfer(msg.value * 2);
            return true;
        } else {
            return false;
        }
    }

    receive() external payable {}
}
Deployment Script
deploy.js: Script to deploy the smart contract to the Polygon Mumbai Testnet.
javascript
Copy code
// scripts/deploy.js

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ContractFactory = await ethers.getContractFactory("CoinFlip");
  const contract = await ContractFactory.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);

  // Save the contract address and ABI
  const fs = require('fs');
  fs.writeFileSync(
    './contract-info.json',
    JSON.stringify({
      address: contract.address,
      abi: JSON.parse(contract.interface.format('json'))
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
4. Deploy the Smart Contract
Configure Hardhat: Make sure to update hardhat.config.js with the Polygon Mumbai network settings and your private key.

Run the Deployment Script:

bash
Copy code
npx hardhat run scripts/deploy.js --network mumbai
5. Frontend Development
React Application
App.jsx: Contains the user interface and blockchain interaction logic.
jsx
Copy code
// src/App.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState('heads');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setProvider(web3Provider);
        setSigner(web3Provider.getSigner());
        console.log('Wallet connected');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleFlip = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!signer) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const amountInWei = ethers.utils.parseEther(amount);

      // Example interaction with smart contract
      const contractAddress = 'YOUR_CONTRACT_ADDRESS';
      const contractABI = [ /* Your ABI here */ ];
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.flipCoin(side === 'heads', { value: amountInWei, gasLimit: 100000 });
      await tx.wait();

      alert('Transaction successful! Check your wallet for the results.');
    } catch (error) {
      console.error('Error:', error);
      alert('Transaction failed.');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Coin Flip Game</h1>
      </header>
      <main className="main-content">
        <button onClick={connectWallet} className="button connect-button">Connect Wallet</button>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
            placeholder="Enter amount in ETH"
          />
        </div>
        <div className="form-group">
          <label htmlFor="side">Choose Side:</label>
          <select
            id="side"
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className="select"
          >
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
        </div>
        <button onClick={handleFlip} className="button flip-button">Flip Coin</button>
      </main>
      <footer className="footer">
        <p>Powered by Polygon Mumbai Testnet</p>
      </footer>
    </div>
  );
}

export default App;
6. Run the Application
Start the React Application:
bash
Copy code
npm start
Visit the Application:
Open your browser and navigate to http://localhost:3000.

Troubleshooting
Failed Transactions: Ensure your wallet has sufficient funds and check if the gas limit and value are set correctly.
Contract Not Found: Verify the contract address and ABI are correctly set in App.jsx.
Wallet Issues: Ensure MetaMask is installed and configured correctly.
License
This project is licensed under the MIT License.
