/**
 * Main FHE API Route
 * General FHE operations endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  const response: ApiResponse = {
    success: true,
    data: {
      message: 'FHE API is operational',
      version: '1.0.0',
      endpoints: {
        encrypt: '/api/fhe/encrypt',
        decrypt: '/api/fhe/decrypt',
        compute: '/api/fhe/compute',
        keys: '/api/keys',
      },
    },
    timestamp: Date.now(),
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Use specific endpoints for FHE operations',
        received: body,
      },
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    };

    return NextResponse.json(response, { status: 400 });
  }
}
