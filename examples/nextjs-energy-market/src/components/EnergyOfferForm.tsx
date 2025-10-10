'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { useFhevmContext } from '@fhevm/sdk/react';
import { useContract } from '@/lib/useContract';

const ENERGY_TYPES = [
  { value: 1, label: 'Solar', icon: '☀️' },
  { value: 2, label: 'Wind', icon: '💨' },
  { value: 3, label: 'Hydro', icon: '💧' },
  { value: 4, label: 'Biomass', icon: '🌱' },
];

export function EnergyOfferForm() {
  const { client } = useFhevmContext();
  const { encrypt, isEncrypting } = useEncrypt(client);
  const { contract, isConnected } = useContract();

  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [energyType, setEnergyType] = useState(1);
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract || !isConnected) {
      setStatus('error');
      setMessage('Please connect your wallet first');
      return;
    }

    try {
      setStatus('encrypting');
      setMessage('Encrypting your offer data with FHE...');

      // Step 1: Encrypt the values using FHEVM SDK
      const encryptedAmount = await encrypt(Number(amount), { bits: 32 });
      const encryptedPrice = await encrypt(Number(price), { bits: 32 });

      if (!encryptedAmount || !encryptedPrice) {
        throw new Error('Encryption failed');
      }

      setStatus('submitting');
      setMessage('Submitting encrypted offer to blockchain...');

      // Step 2: Submit to smart contract
      const tx = await contract.submitEnergyOffer(
        encryptedAmount,
        encryptedPrice,
        energyType
      );

      setMessage('Waiting for transaction confirmation...');
      await tx.wait();

      setStatus('success');
      setMessage('✓ Energy offer submitted successfully! Your data remains encrypted on-chain.');

      // Reset form
      setTimeout(() => {
        setAmount('');
        setPrice('');
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Energy Amount (kWh)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
          placeholder="e.g., 1000"
          disabled={status === 'encrypting' || status === 'submitting'}
        />
        <p className="mt-1 text-xs text-gray-500">
          Amount will be encrypted before submission
        </p>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price per kWh (units)
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
          placeholder="e.g., 50"
          disabled={status === 'encrypting' || status === 'submitting'}
        />
        <p className="mt-1 text-xs text-gray-500">
          Price will be encrypted before submission
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Energy Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ENERGY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setEnergyType(type.value)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                energyType === type.value
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              disabled={status === 'encrypting' || status === 'submitting'}
            >
              <span className="text-2xl mr-2">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : status === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isConnected || status === 'encrypting' || status === 'submitting' || isEncrypting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'encrypting' || isEncrypting
          ? 'Encrypting...'
          : status === 'submitting'
          ? 'Submitting...'
          : 'Submit Energy Offer'}
      </button>

      {!isConnected && (
        <p className="text-sm text-center text-gray-500">
          Connect your wallet to submit offers
        </p>
      )}
    </form>
  );
}
