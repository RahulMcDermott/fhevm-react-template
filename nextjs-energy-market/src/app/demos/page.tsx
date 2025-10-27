/**
 * Demos Page
 * Showcases all FHE demonstration components
 */

'use client';

import React, { useState } from 'react';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';
import { useFHEContext } from '@/components/fhe/FHEProvider';

export default function DemosPage() {
  const { isReady, isLoading, error } = useFHEContext();
  const [activeTab, setActiveTab] = useState<'demos' | 'examples' | 'keys'>('demos');

  const tabs = [
    { id: 'demos', label: 'FHE Operations', icon: '🔐' },
    { id: 'examples', label: 'Use Cases', icon: '💼' },
    { id: 'keys', label: 'Key Management', icon: '🔑' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FHE Demonstrations</h1>
            <p className="mt-1 text-sm text-gray-600">
              Interactive examples of Fully Homomorphic Encryption operations
            </p>
          </div>
        </div>
      </header>

      {/* Status Banner */}
      {isLoading && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-sm text-blue-800">Initializing FHE SDK...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        </div>
      )}

      {isReady && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-sm text-green-800">✓ FHE SDK Ready</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'demos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <EncryptionDemo />
            </div>
            <div>
              <ComputationDemo />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How FHE Operations Work
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Encrypt</h3>
                    <p className="text-sm text-gray-600">
                      Values are encrypted using FHE before being sent to the blockchain
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Compute</h3>
                    <p className="text-sm text-gray-600">
                      Operations are performed on encrypted data without decryption
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔓</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Result</h3>
                    <p className="text-sm text-gray-600">
                      Results remain encrypted, maintaining privacy throughout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <BankingExample />
            </div>
            <div>
              <MedicalExample />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Real-World Applications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Financial Services</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Private balance verification</li>
                      <li>Confidential transactions</li>
                      <li>Secure credit scoring</li>
                      <li>Anonymous payments</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Healthcare</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Private medical records</li>
                      <li>Secure diagnostics</li>
                      <li>Anonymous health analytics</li>
                      <li>HIPAA compliance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Supply Chain</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Confidential pricing</li>
                      <li>Private inventory levels</li>
                      <li>Secure supplier data</li>
                      <li>Anonymous logistics</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Voting Systems</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Anonymous voting</li>
                      <li>Verifiable results</li>
                      <li>Fraud prevention</li>
                      <li>Voter privacy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="max-w-3xl mx-auto">
            <KeyManager />
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Key Management Best Practices
              </h2>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold mb-1">🔐 Secure Storage</h3>
                  <p>
                    Keys are stored in browser localStorage with appropriate security measures.
                    Never share your private keys.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">🔄 Key Rotation</h3>
                  <p>
                    Regularly generate new keys to maintain security. Old encrypted data can
                    be re-encrypted with new keys.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">⏰ Expiration</h3>
                  <p>
                    Keys automatically expire after 24 hours. Generate a new key if yours
                    has expired.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">🗑️ Cleanup</h3>
                  <p>
                    Clear old keys when no longer needed. This helps maintain security and
                    free up storage space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Built with FHEVM SDK • Powered by Zama • Privacy by Default
          </p>
        </div>
      </footer>
    </div>
  );
}
