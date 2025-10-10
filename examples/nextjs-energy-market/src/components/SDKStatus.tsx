'use client';

import { useFhevmContext } from '@fhevm/sdk/react';

export function SDKStatus() {
  const { isReady, isLoading, error } = useFhevmContext();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <div
          className={`h-2 w-2 rounded-full mr-2 ${
            isLoading
              ? 'bg-yellow-400 animate-pulse'
              : isReady
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        />
        <span className="text-sm font-medium text-gray-700">
          {isLoading ? 'Initializing...' : isReady ? 'SDK Ready' : 'SDK Error'}
        </span>
      </div>
      {error && (
        <span className="text-xs text-red-600" title={error.message}>
          !
        </span>
      )}
    </div>
  );
}
