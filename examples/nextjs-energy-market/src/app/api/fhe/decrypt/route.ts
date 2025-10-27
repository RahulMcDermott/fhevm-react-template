/**
 * Decryption API Route
 * Handles server-side decryption requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverPublicDecrypt, validateEncryptedHandle } from '@/lib/fhe/server';
import { isValidAddress } from '@/lib/utils/security';
import type { ApiResponse, DecryptRequest } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: DecryptRequest = await request.json();
    const { encryptedHandle, userAddress, contractAddress } = body;

    // Validate inputs
    if (!encryptedHandle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Encrypted handle is required',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!validateEncryptedHandle(encryptedHandle)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid encrypted handle format',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!userAddress || !isValidAddress(userAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid user address is required',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!contractAddress || !isValidAddress(contractAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid contract address is required',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Perform decryption
    // Note: This is for public decryption only
    // User-specific decryption requires EIP-712 signature verification
    const decrypted = await serverPublicDecrypt(encryptedHandle);

    const response: ApiResponse = {
      success: true,
      data: {
        value: decrypted,
        handle: encryptedHandle,
      },
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Decryption error:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed',
      timestamp: Date.now(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'GET method not supported. Use POST with encrypted handle.',
    timestamp: Date.now(),
  } as ApiResponse, { status: 405 });
}
