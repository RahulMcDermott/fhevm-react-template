/**
 * Encryption API Route
 * Handles server-side encryption requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverEncrypt } from '@/lib/fhe/server';
import { validateNumericInput } from '@/lib/utils/security';
import { validateBitSize, validateValueForBits } from '@/lib/utils/validation';
import type { ApiResponse, EncryptRequest } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: EncryptRequest = await request.json();
    const { value, bits = 32 } = body;

    // Validate input
    if (value === undefined || value === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value is required',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate bit size
    if (!validateBitSize(bits)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid bit size. Must be 8, 16, 32, 64, 128, or 256',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate value fits in bit size
    const numValue = typeof value === 'boolean' ? (value ? 1 : 0) : Number(value);
    if (!validateValueForBits(numValue, bits)) {
      return NextResponse.json(
        {
          success: false,
          error: `Value ${value} does not fit in ${bits} bits`,
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Perform encryption
    const encrypted = await serverEncrypt(value, bits);

    const response: ApiResponse = {
      success: true,
      data: {
        encrypted,
        originalValue: value,
        bits,
      },
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Encryption error:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed',
      timestamp: Date.now(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'GET method not supported. Use POST with value and bits.',
    timestamp: Date.now(),
  } as ApiResponse, { status: 405 });
}
