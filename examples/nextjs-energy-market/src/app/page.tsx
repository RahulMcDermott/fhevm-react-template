'use client';

import { useState } from 'react';
import { useFhevmContext } from '@fhevm/sdk/react';
import { EnergyOfferForm } from '@/components/EnergyOfferForm';
import { EnergyDemandForm } from '@/components/EnergyDemandForm';
import { TradingPeriodInfo } from '@/components/TradingPeriodInfo';
import { SDKStatus } from '@/components/SDKStatus';

export default function Home() {
  const { isReady, isLoading, error } = useFhevmContext();
  const [activeTab, setActiveTab] = useState<'offer' | 'demand'>('offer');

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Private Energy Market
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Privacy-preserving renewable energy trading powered by FHEVM SDK
              </p>
            </div>
            <SDKStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing FHEVM SDK...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-2 text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ready State */}
        {isReady && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Trading Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('offer')}
                    className={`flex-1 px-6 py-4 text-sm font-medium ${
                      activeTab === 'offer'
                        ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Submit Energy Offer
                  </button>
                  <button
                    onClick={() => setActiveTab('demand')}
                    className={`flex-1 px-6 py-4 text-sm font-medium ${
                      activeTab === 'demand'
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Submit Energy Demand
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  {activeTab === 'offer' ? (
                    <EnergyOfferForm />
                  ) : (
                    <EnergyDemandForm />
                  )}
                </div>
              </div>

              {/* How It Works Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How It Works
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">
                        1
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Encrypt Your Data
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Your energy amounts and prices are encrypted using FHE before being sent to the blockchain
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">
                        2
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Private Matching
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Smart contracts match offers and demands without ever decrypting the values
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold">
                        3
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Secure Settlement
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Trades are settled automatically while maintaining complete privacy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info Panel */}
            <div className="space-y-6">
              <TradingPeriodInfo />

              {/* SDK Info Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Powered by FHEVM SDK
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  This application uses the universal FHEVM SDK to provide privacy-preserving operations.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Framework Agnostic</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Wagmi-like API</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">TypeScript Support</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Production Ready</span>
                  </div>
                </div>
              </div>

              {/* Energy Types Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Energy Types
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">☀️</span>
                    <span className="text-sm text-gray-700">Solar Energy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💨</span>
                    <span className="text-sm text-gray-700">Wind Energy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💧</span>
                    <span className="text-sm text-gray-700">Hydro Energy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🌱</span>
                    <span className="text-sm text-gray-700">Biomass Energy</span>
                  </div>
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
    </main>
  );
}
