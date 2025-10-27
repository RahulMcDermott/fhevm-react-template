/**
 * Computation Demo Component
 * Interactive demo for homomorphic computation
 */

'use client';

import React, { useState } from 'react';
import { useComputation } from '@/hooks/useComputation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function ComputationDemo() {
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'compare'>('add');
  const [result, setResult] = useState<string>('');

  const { compute, isComputing, error } = useComputation();

  const handleCompute = async () => {
    if (!operand1 || !operand2) {
      alert('Please enter both operands');
      return;
    }

    const computationResult = await compute(operation, [operand1, operand2], 32);

    if (computationResult) {
      setResult(computationResult.result);
    }
  };

  const operations = [
    { value: 'add', label: 'Addition (+)', icon: '+' },
    { value: 'subtract', label: 'Subtraction (-)', icon: '-' },
    { value: 'multiply', label: 'Multiplication (×)', icon: '×' },
    { value: 'compare', label: 'Comparison (>)', icon: '>' },
  ];

  return (
    <Card
      title="Homomorphic Computation Demo"
      subtitle="Perform operations on encrypted values"
    >
      <div className="space-y-4">
        <Input
          type="text"
          label="First Encrypted Value (Handle)"
          placeholder="Enter encrypted handle"
          value={operand1}
          onChange={(e) => setOperand1(e.target.value)}
          disabled={isComputing}
          helperText="Paste an encrypted value handle"
        />

        <Input
          type="text"
          label="Second Encrypted Value (Handle)"
          placeholder="Enter encrypted handle"
          value={operand2}
          onChange={(e) => setOperand2(e.target.value)}
          disabled={isComputing}
          helperText="Paste another encrypted value handle"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <div className="grid grid-cols-2 gap-2">
            {operations.map((op) => (
              <button
                key={op.value}
                onClick={() => setOperation(op.value as any)}
                className={`px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                  operation === op.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isComputing}
              >
                <span className="text-xl mr-2">{op.icon}</span>
                <span className="text-sm font-medium">{op.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!operand1 || !operand2 || isComputing}
          variant="primary"
          className="w-full"
        >
          {isComputing ? 'Computing...' : 'Compute Result'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm font-medium text-purple-900 mb-2">
              Encrypted Computation Result:
            </p>
            <p className="text-xs text-purple-800 font-mono break-all">{result}</p>
            <p className="text-xs text-purple-600 mt-2">
              The result is still encrypted and maintains privacy
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
