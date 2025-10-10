import { useState, useEffect } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import { contractABI } from './contractABI';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export function useContract() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initContract() {
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('Please install MetaMask');
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const contractInstance = new Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        setContract(contractInstance);
        setAddress(userAddress);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('Error initializing contract:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsConnected(false);
      }
    }

    initContract();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', initContract);
      window.ethereum.on('chainChanged', initContract);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initContract);
        window.ethereum.removeListener('chainChanged', initContract);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contractInstance = new Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      setContract(contractInstance);
      setAddress(userAddress);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return {
    contract,
    isConnected,
    address,
    error,
    connectWallet,
  };
}
