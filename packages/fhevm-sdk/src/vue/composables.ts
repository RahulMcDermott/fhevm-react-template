/**
 * Vue composables for FHEVM
 *
 * Vue 3 Composition API support for FHEVM operations
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import type {
  FhevmClient,
  FhevmClientConfig,
  EncryptedValue,
  EncryptOptions,
  DecryptOptions,
  DecryptResult,
} from '../core/types';
import { createFhevmClient, isClientReady } from '../core/client';
import { encrypt as coreEncrypt, encryptBatch } from '../core/encryption';
import { decrypt as coreDecrypt, publicDecrypt } from '../core/decryption';

/**
 * Composable for initializing FHEVM client
 *
 * @param config - Client configuration
 * @returns Client instance and state
 *
 * @example
 * ```vue
 * <script setup>
 * import { useFhevmClient } from '@fhevm/sdk/vue';
 *
 * const { client, isLoading, error, isReady } = useFhevmClient({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 * </script>
 * ```
 */
export function useFhevmClient(config: FhevmClientConfig) {
  const client = ref<FhevmClient | null>(null);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const isReady = computed(() =>
    client.value ? isClientReady(client.value) : false
  );

  let mounted = true;

  onMounted(async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const newClient = await createFhevmClient(config);

      if (mounted) {
        client.value = newClient;
        isLoading.value = false;
      }
    } catch (err) {
      if (mounted) {
        error.value = err as Error;
        isLoading.value = false;
      }
    }
  });

  onUnmounted(() => {
    mounted = false;
  });

  return {
    client,
    isLoading,
    error,
    isReady,
  };
}

/**
 * Composable for encrypting values
 *
 * @param client - FHEVM client ref
 * @returns Encryption functions and state
 *
 * @example
 * ```vue
 * <script setup>
 * const { client } = useFhevmClient(config);
 * const { encrypt, isEncrypting, error } = useEncrypt(client);
 *
 * async function handleSubmit() {
 *   const encrypted = await encrypt(1000, { bits: 32 });
 *   // Use encrypted value
 * }
 * </script>
 * ```
 */
export function useEncrypt(clientRef: { value: FhevmClient | null }) {
  const isEncrypting = ref(false);
  const error = ref<Error | null>(null);

  const encrypt = async (
    value: number | bigint | boolean,
    options?: EncryptOptions
  ): Promise<EncryptedValue | null> => {
    if (!clientRef.value) {
      error.value = new Error('Client not initialized');
      return null;
    }

    try {
      isEncrypting.value = true;
      error.value = null;

      const encrypted = await coreEncrypt(clientRef.value, value, options);

      isEncrypting.value = false;
      return encrypted;
    } catch (err) {
      error.value = err as Error;
      isEncrypting.value = false;
      return null;
    }
  };

  const encryptMultiple = async (
    values: (number | bigint | boolean)[],
    options?: EncryptOptions
  ): Promise<EncryptedValue[] | null> => {
    if (!clientRef.value) {
      error.value = new Error('Client not initialized');
      return null;
    }

    try {
      isEncrypting.value = true;
      error.value = null;

      const encrypted = await encryptBatch(clientRef.value, values, options);

      isEncrypting.value = false;
      return encrypted;
    } catch (err) {
      error.value = err as Error;
      isEncrypting.value = false;
      return null;
    }
  };

  return {
    encrypt,
    encryptMultiple,
    isEncrypting,
    error,
  };
}

/**
 * Composable for decrypting values
 *
 * @param client - FHEVM client ref
 * @returns Decryption functions and state
 *
 * @example
 * ```vue
 * <script setup>
 * const { client } = useFhevmClient(config);
 * const { decrypt, isDecrypting } = useDecrypt(client);
 *
 * async function handleDecrypt() {
 *   const result = await decrypt(handle, {
 *     userAddress: address.value,
 *     contractAddress: '0x...'
 *   });
 *   console.log(result?.value);
 * }
 * </script>
 * ```
 */
export function useDecrypt(clientRef: { value: FhevmClient | null }) {
  const isDecrypting = ref(false);
  const error = ref<Error | null>(null);

  const decrypt = async (
    handle: bigint | string,
    options: DecryptOptions
  ): Promise<DecryptResult | null> => {
    if (!clientRef.value) {
      error.value = new Error('Client not initialized');
      return null;
    }

    try {
      isDecrypting.value = true;
      error.value = null;

      const result = await coreDecrypt(clientRef.value, handle, options);

      isDecrypting.value = false;
      return result;
    } catch (err) {
      error.value = err as Error;
      isDecrypting.value = false;
      return null;
    }
  };

  const decryptPublic = async (
    handle: bigint | string
  ): Promise<bigint | number | boolean | null> => {
    if (!clientRef.value) {
      error.value = new Error('Client not initialized');
      return null;
    }

    try {
      isDecrypting.value = true;
      error.value = null;

      const result = await publicDecrypt(clientRef.value, handle);

      isDecrypting.value = false;
      return result;
    } catch (err) {
      error.value = err as Error;
      isDecrypting.value = false;
      return null;
    }
  };

  return {
    decrypt,
    decryptPublic,
    isDecrypting,
    error,
  };
}

/**
 * All-in-one composable for FHEVM operations
 *
 * @param config - Client configuration
 * @returns Complete FHEVM interface
 *
 * @example
 * ```vue
 * <script setup>
 * const fhevm = useFhevm({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 *
 * // Encrypt
 * const encrypted = await fhevm.encrypt(1000);
 *
 * // Decrypt
 * const result = await fhevm.decrypt(handle, { ... });
 * </script>
 * ```
 */
export function useFhevm(config: FhevmClientConfig) {
  const { client, isLoading: isInitializing, error: initError, isReady } = useFhevmClient(config);
  const { encrypt, encryptMultiple, isEncrypting, error: encryptError } = useEncrypt(client);
  const { decrypt, decryptPublic, isDecrypting, error: decryptError } = useDecrypt(client);

  const error = computed(() => initError.value || encryptError.value || decryptError.value);
  const isLoading = computed(() => isInitializing.value || isEncrypting.value || isDecrypting.value);

  return {
    // Client
    client,
    isReady,

    // Encryption
    encrypt,
    encryptMultiple,
    isEncrypting,

    // Decryption
    decrypt,
    decryptPublic,
    isDecrypting,

    // State
    isLoading,
    error,
  };
}
