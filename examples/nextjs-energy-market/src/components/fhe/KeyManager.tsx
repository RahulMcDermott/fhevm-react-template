/**
 * Key Manager Component
 * Manage FHE keys
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getOrGenerateKey, clearStoredKeys, isKeyValid } from '@/lib/fhe/keys';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function KeyManager() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [keyAge, setKeyAge] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    loadKey();
  }, []);

  const loadKey = () => {
    const key = getOrGenerateKey();
    setPublicKey(key.publicKey);
    setKeyAge(Date.now() - key.generated);
    setIsValid(isKeyValid());
  };

  const handleGenerateNew = () => {
    clearStoredKeys();
    loadKey();
  };

  const handleClearKeys = () => {
    clearStoredKeys();
    setPublicKey('');
    setKeyAge(0);
    setIsValid(false);
  };

  const formatAge = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Card title="Key Management" subtitle="Manage FHE encryption keys">
      <div className="space-y-4">
        {publicKey ? (
          <>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-blue-900">Public Key</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Age: {formatAge(keyAge)} • Status:{' '}
                    <span className={isValid ? 'text-green-600' : 'text-red-600'}>
                      {isValid ? 'Valid' : 'Expired'}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-800 font-mono break-all mt-2">
                {publicKey}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleGenerateNew} variant="primary" size="sm">
                Generate New Key
              </Button>
              <Button onClick={handleClearKeys} variant="danger" size="sm">
                Clear Keys
              </Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Keys are stored locally and used for encrypting
                data before sending to the blockchain. Generate a new key if you suspect
                it has been compromised.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No key found</p>
            <Button onClick={loadKey} variant="primary">
              Generate Key
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
