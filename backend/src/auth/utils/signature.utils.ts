import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Verifies a Solana signature (ed25519 signature) against a message and public key.
 * @param {string} message - The message to verify (utf-8 decoded string).
 * @param {string} signature - The signature to verify (base58 decoded string).
 * @param {string} publicKey - The public key to verify against (base58 decoded string).
 * @returns {boolean} Whether the signature is valid.
 * @example
 * const message = "Sign this message for authentication";
 * const signature = "3Y7aWFeS9TE57v4vtuKVU8GxDVSXJTJw1tReXL1kYZzLq4PQobaeTScMhZXPsJjG1xTewTtwY2xVo6EEuVLiLb4d";
 * const publicKey = "HVueAes5NuzRf8mm9ZCDCmruASsSdS4rCd9P2fC5j88A";
 *
 * const isValid = await verifySolanaSignature(message, signature, publicKey);
 * console.log(isValid); // true
 */
export async function verifySolanaSignature(
  message: string,
  signature: string,
  publicKey: string,
): Promise<boolean> {
  const messageBytes = new TextEncoder().encode(message); // convert message to utf-8 bytes
  const signatureBytes = bs58.decode(signature); // convert signature to base58 bytes
  const publicKeyBytes = bs58.decode(publicKey); // convert public key to base58 bytes

  const isSignatureValid = nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes,
  );

  return isSignatureValid;
}
