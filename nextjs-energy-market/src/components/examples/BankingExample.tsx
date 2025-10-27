/**
 * Banking Example Component
 * Demonstrates FHE for confidential banking operations
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function BankingExample() {
  const [accountBalance, setAccountBalance] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [encryptedBalance, setEncryptedBalance] = useState('');
  const [encryptedTransaction, setEncryptedTransaction] = useState('');

  const { encrypt, isEncrypting } = useEncryption();

  const handleEncryptBalance = async () => {
    if (!accountBalance) return;

    const result = await encrypt(Number(accountBalance), { bits: 64 });
    if (result) {
      setEncryptedBalance(result.encrypted);
    }
  };

  const handleEncryptTransaction = async () => {
    if (!transactionAmount) return;

    const result = await encrypt(Number(transactionAmount), { bits: 64 });
    if (result) {
      setEncryptedTransaction(result.encrypted);
    }
  };

  return (
    <Card
      title="Confidential Banking"
      subtitle="Secure financial transactions with FHE"
    >
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Use Case</h4>
          <p className="text-sm text-blue-800">
            Encrypt account balances and transaction amounts to maintain financial
            privacy. Smart contracts can verify sufficient funds and process
            transactions without exposing actual amounts.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="number"
              label="Account Balance ($)"
              placeholder="Enter balance"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              disabled={isEncrypting}
            />
            <Button
              onClick={handleEncryptBalance}
              isLoading={isEncrypting}
              disabled={!accountBalance}
              size="sm"
              className="mt-2"
            >
              Encrypt Balance
            </Button>
            {encryptedBalance && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-green-900 font-medium mb-1">
                  Encrypted Balance:
                </p>
                <p className="text-xs text-green-800 font-mono break-all">
                  {encryptedBalance.substring(0, 50)}...
                </p>
              </div>
            )}
          </div>

          <div>
            <Input
              type="number"
              label="Transaction Amount ($)"
              placeholder="Enter amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              disabled={isEncrypting}
            />
            <Button
              onClick={handleEncryptTransaction}
              isLoading={isEncrypting}
              disabled={!transactionAmount}
              size="sm"
              className="mt-2"
            >
              Encrypt Transaction
            </Button>
            {encryptedTransaction && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-green-900 font-medium mb-1">
                  Encrypted Transaction:
                </p>
                <p className="text-xs text-green-800 font-mono break-all">
                  {encryptedTransaction.substring(0, 50)}...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Privacy Benefits
          </h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Account balances remain confidential</li>
            <li>Transaction amounts are hidden from public</li>
            <li>Smart contracts verify without decryption</li>
            <li>Regulatory compliance with privacy</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
