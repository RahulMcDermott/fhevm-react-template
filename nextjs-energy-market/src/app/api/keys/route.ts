/**
 * Keys API Route
 * Handles key generation and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateKeyPair } from '@/lib/fhe/keys';
import type { ApiResponse, KeyGenerationRequest } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: KeyGenerationRequest = await request.json();
    const { type = 'client', options = {} } = body;

    // Validate type
    if (!['client', 'server'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid key type. Must be "client" or "server"',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Generate key pair
    const keyPair = generateKeyPair();

    const response: ApiResponse = {
      success: true,
      data: {
        publicKey: keyPair.publicKey,
        generated: keyPair.generated,
        type,
      },
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Key generation error:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Key generation failed',
      timestamp: Date.now(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  // Return API information
  return NextResponse.json({
    success: true,
    data: {
      message: 'Keys API',
      description: 'Generate and manage FHE encryption keys',
      usage: {
        method: 'POST',
        body: {
          type: 'client | server',
          options: 'object (optional)',
        },
      },
    },
    timestamp: Date.now(),
  } as ApiResponse);
}
