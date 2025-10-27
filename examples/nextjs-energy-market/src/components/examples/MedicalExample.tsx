/**
 * Medical Example Component
 * Demonstrates FHE for confidential medical data
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function MedicalExample() {
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [encryptedData, setEncryptedData] = useState<Record<string, string>>({});

  const { encrypt, encryptMultiple, isEncrypting } = useEncryption();

  const handleEncryptSingle = async (type: string, value: string) => {
    if (!value) return;

    const result = await encrypt(Number(value), { bits: 32 });
    if (result) {
      setEncryptedData((prev) => ({
        ...prev,
        [type]: result.encrypted,
      }));
    }
  };

  const handleEncryptAll = async () => {
    if (!bloodPressure || !heartRate || !glucoseLevel) {
      alert('Please fill in all fields');
      return;
    }

    const values = [
      Number(bloodPressure),
      Number(heartRate),
      Number(glucoseLevel),
    ];

    const results = await encryptMultiple(values, { bits: 32 });

    if (results) {
      setEncryptedData({
        bloodPressure: results[0].encrypted,
        heartRate: results[1].encrypted,
        glucoseLevel: results[2].encrypted,
      });
    }
  };

  return (
    <Card
      title="Confidential Medical Records"
      subtitle="Secure health data with FHE"
    >
      <div className="space-y-6">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Use Case</h4>
          <p className="text-sm text-purple-800">
            Encrypt sensitive medical data for secure storage and analysis. Healthcare
            providers can perform computations on encrypted data without compromising
            patient privacy.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="number"
              label="Blood Pressure (systolic)"
              placeholder="e.g., 120"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              disabled={isEncrypting}
              helperText="Normal range: 90-120 mmHg"
            />
            {encryptedData.bloodPressure && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                <span className="text-green-900 font-medium">✓ Encrypted</span>
              </div>
            )}
          </div>

          <div>
            <Input
              type="number"
              label="Heart Rate (bpm)"
              placeholder="e.g., 75"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              disabled={isEncrypting}
              helperText="Normal range: 60-100 bpm"
            />
            {encryptedData.heartRate && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                <span className="text-green-900 font-medium">✓ Encrypted</span>
              </div>
            )}
          </div>

          <div>
            <Input
              type="number"
              label="Glucose Level (mg/dL)"
              placeholder="e.g., 95"
              value={glucoseLevel}
              onChange={(e) => setGlucoseLevel(e.target.value)}
              disabled={isEncrypting}
              helperText="Normal range: 70-100 mg/dL"
            />
            {encryptedData.glucoseLevel && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                <span className="text-green-900 font-medium">✓ Encrypted</span>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleEncryptAll}
          isLoading={isEncrypting}
          disabled={!bloodPressure || !heartRate || !glucoseLevel}
          variant="primary"
          className="w-full"
        >
          {isEncrypting ? 'Encrypting All Data...' : 'Encrypt All Medical Data'}
        </Button>

        {Object.keys(encryptedData).length === 3 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-900 mb-2">
              ✓ All Data Encrypted
            </h4>
            <p className="text-xs text-green-800 mb-2">
              Medical records are now securely encrypted and ready for blockchain
              storage.
            </p>
            <div className="text-xs text-green-700 space-y-1">
              <div>Blood Pressure: {encryptedData.bloodPressure?.substring(0, 30)}...</div>
              <div>Heart Rate: {encryptedData.heartRate?.substring(0, 30)}...</div>
              <div>Glucose Level: {encryptedData.glucoseLevel?.substring(0, 30)}...</div>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            HIPAA Compliance Benefits
          </h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Patient data remains confidential</li>
            <li>Secure data sharing between providers</li>
            <li>Analysis without exposing raw data</li>
            <li>Audit trails without privacy compromise</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
