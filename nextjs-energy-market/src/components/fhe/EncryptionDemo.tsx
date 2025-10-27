/**
 * Encryption Demo Component
 * Interactive demo for encryption operations
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function EncryptionDemo() {
  const [value, setValue] = useState('');
  const [bits, setBits] = useState<8 | 16 | 32 | 64>(32);
  const [result, setResult] = useState<string>('');

  const { encrypt, isEncrypting, error } = useEncryption();

  const handleEncrypt = async () => {
    if (!value) return;

    const numValue = Number(value);
    if (isNaN(numValue)) {
      alert('Please enter a valid number');
      return;
    }

    const encryptionResult = await encrypt(numValue, { bits });

    if (encryptionResult) {
      setResult(encryptionResult.encrypted);
    }
  };

  return (
    <Card title="Encryption Demo" subtitle="Encrypt values using FHE">
      <div className="space-y-4">
        <Input
          type="number"
          label="Value to Encrypt"
          placeholder="Enter a number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isEncrypting}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bit Size
          </label>
          <div className="flex gap-2">
            {[8, 16, 32, 64].map((size) => (
              <button
                key={size}
                onClick={() => setBits(size as any)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  bits === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isEncrypting}
              >
                {size}-bit
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleEncrypt}
          isLoading={isEncrypting}
          disabled={!value || isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">Encrypted Result:</p>
            <p className="text-xs text-green-800 font-mono break-all">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
