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
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
      
        // Request the user's accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        // Set provider and signer
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
      console.log('Signing transaction with', signer);
  
      // Simulate coin flip logic
      const randomOutcome = Math.random() < 0.5 ? 'heads' : 'tails';
      const result = randomOutcome === side ? 'win' : 'lose';
      alert(`You ${result}! The coin landed on ${randomOutcome}.`);
  
      // Example interaction with smart contract
      const contractAddress = '0x55e0bCf9475060614d2546b001CfF2caF71E2eB6';
      const contractABI = [ {
        "inputs": [
          { "internalType": "uint256", "name": "_amount", "type": "uint256" },
          { "internalType": "string", "name": "_side", "type": "string" }
        ],
        "name": "flipCoin",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      } ];
  
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Convert amount to BigNumber if needed
      const amountInWei = ethers.parseUnits(amount, 'wei');
  
      // Call the smart contract function
      const tx = await contract.flipCoin(side === 'heads', { value: amountInWei, gasLimit: 100000 });
      await tx.wait(); // Wait for the transaction to be mined
  
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
        <button onClick={connectWallet} className="button">Connect Wallet</button>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
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
        <button onClick={handleFlip} className="button">Flip Coin</button>
      </main>
      <footer className="footer">
        <p>Powered by Polygon Mumbai Testnet</p>
      </footer>
    </div>
  );
}

export default App;
