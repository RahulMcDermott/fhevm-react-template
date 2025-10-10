'use client';

import { useContract } from '@/lib/useContract';
import { useEffect, useState } from 'react';

export function TradingPeriodInfo() {
  const { contract, isConnected } = useContract();
  const [periodInfo, setPeriodInfo] = useState<{
    periodId: number;
    isActive: boolean;
    startTime: number;
    endTime: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPeriodInfo() {
      if (!contract || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        const currentPeriod = await contract.getCurrentTradingPeriod();
        const period = await contract.tradingPeriods(currentPeriod);

        setPeriodInfo({
          periodId: Number(currentPeriod),
          isActive: period.isActive,
          startTime: Number(period.startTime),
          endTime: Number(period.endTime),
        });
      } catch (error) {
        console.error('Error fetching period info:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPeriodInfo();
    const interval = setInterval(fetchPeriodInfo, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [contract, isConnected]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!isConnected || !periodInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Trading Period
        </h2>
        <p className="text-sm text-gray-500">
          Connect wallet to view trading period information
        </p>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = periodInfo.endTime - now;
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Trading Period
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Period ID:</span>
          <span className="text-sm font-medium text-gray-900">
            #{periodInfo.periodId}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              periodInfo.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {periodInfo.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {periodInfo.isActive && timeRemaining > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Time Remaining:</span>
            <span className="text-sm font-medium text-gray-900">
              {hours}h {minutes}m
            </span>
          </div>
        )}

        <div className="pt-3 border-t">
          <p className="text-xs text-gray-500">
            {periodInfo.isActive
              ? 'You can submit offers and demands during this period'
              : 'Trading period is not active. Wait for next period to start.'}
          </p>
        </div>
      </div>
    </div>
  );
}
