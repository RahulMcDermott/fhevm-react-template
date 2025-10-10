/**
 * FHEVM Client - Core client for managing FHEVM instances
 */

import { createInstance, FhevmInstance } from 'fhevmjs';
import type {
  FhevmClient,
  FhevmClientConfig,
  NetworkName,
  InitializationError,
} from './types';

/**
 * Network configurations
 */
const NETWORK_CONFIGS: Record<NetworkName, { chainId: number; rpcUrl?: string }> = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
  },
  mainnet: {
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
  },
  localhost: {
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
  },
  custom: {
    chainId: 0,
  },
};

/**
 * Create FHEVM client instance
 *
 * @param config - Client configuration
 * @returns Initialized FHEVM client
 *
 * @example
 * ```typescript
 * const client = await createFhevmClient({
 *   network: 'sepolia',
 *   contractAddress: '0x1234...'
 * });
 * ```
 */
export async function createFhevmClient(
  config: FhevmClientConfig
): Promise<FhevmClient> {
  try {
    // Get network configuration
    const networkConfig = NETWORK_CONFIGS[config.network];
    const chainId = config.chainId || networkConfig.chainId;
    const rpcUrl = config.rpcUrl || networkConfig.rpcUrl;

    if (!rpcUrl && config.network === 'custom') {
      throw new Error('Custom network requires rpcUrl');
    }

    // Create fhevmjs instance
    const instance = await createInstance({
      chainId,
      publicKey: config.aclAddress,
      kmsVerifier: config.kmsVerifierAddress,
      gatewayUrl: config.gatewayUrl,
    });

    // Create client
    const client: FhevmClient = {
      config: {
        ...config,
        chainId,
        rpcUrl,
      },
      instance,
      isInitialized: true,

      getPublicKey: async () => {
        return instance.getPublicKey();
      },

      getReencryptionKey: async () => {
        const { publicKey, privateKey } = instance.generateKeypair();
        return { publicKey, privateKey };
      },
    };

    return client;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to initialize FHEVM client: ${message}`) as InitializationError;
  }
}

/**
 * Check if client is ready
 *
 * @param client - FHEVM client instance
 * @returns True if client is initialized and ready
 */
export function isClientReady(client: FhevmClient): boolean {
  return client.isInitialized && !!client.instance;
}

/**
 * Get public key from client
 *
 * @param client - FHEVM client instance
 * @returns Public key for encryption
 */
export async function getPublicKey(client: FhevmClient): Promise<string> {
  if (!isClientReady(client)) {
    throw new Error('Client not initialized');
  }

  return client.getPublicKey();
}

/**
 * Generate reencryption keypair
 *
 * @param client - FHEVM client instance
 * @returns Public and private keys for reencryption
 */
export async function generateReencryptionKeys(
  client: FhevmClient
): Promise<{ publicKey: string; privateKey: string }> {
  if (!isClientReady(client)) {
    throw new Error('Client not initialized');
  }

  return client.getReencryptionKey();
}
