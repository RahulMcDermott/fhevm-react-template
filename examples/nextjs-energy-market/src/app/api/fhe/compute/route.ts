/**
 * Computation API Route
 * Handles homomorphic computation requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { performComputation } from '@/lib/fhe/server';
import { validateOperation, validateOperands } from '@/lib/utils/validation';
import { RateLimiter } from '@/lib/utils/security';
import type { ApiResponse, ComputeRequest } from '@/types/api';

// Rate limiter: 20 requests per minute per IP
const rateLimiter = new RateLimiter(20, 60000);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter.check(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 429 }
      );
    }

    const body: ComputeRequest = await request.json();
    const { operation, operands, bits = 32 } = body;

    // Validate operation
    if (!operation || !validateOperation(operation)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid operation. Must be add, subtract, multiply, or compare',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate operands
    if (!validateOperands(operands)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid operands. Must provide at least 2 encrypted handles',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Perform computation
    const result = await performComputation(operation, operands);

    const response: ApiResponse = {
      success: true,
      data: {
        result,
        operation,
        operands: operands.length,
        bits,
      },
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Computation error:', error);

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Computation failed',
      timestamp: Date.now(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'GET method not supported. Use POST with operation and operands.',
    timestamp: Date.now(),
  } as ApiResponse, { status: 405 });
}
