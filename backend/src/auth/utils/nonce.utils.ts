import {
  SIGNATURE_MESSAGE_PREFIX,
  NONCE_EXPIRATION_DURATION_MS,
} from '../constants';

/**
 * Generates a signature message string with a nonce value.
 * @param {string} nonceValue - The nonce value string.
 * @returns {string} The signature message string.
 */
export function generateSignatureMessage(nonceValue: string): string {
  return `${SIGNATURE_MESSAGE_PREFIX}${nonceValue}`;
}

/**
 * Extracts the nonce value from a signature message string.
 * @param {string} signatureMessage - The signature message string.
 * @returns {string} The nonce value string.
 */
export function extractNonceValue(signatureMessage: string): string {
  // TODO: Improve this, regex can be used
  return signatureMessage.split(':')[1];
}

/**
 * Generates a nonce value string with a timestamp and a random string.
 * @returns {string} The nonce value string.
 */
export function generateNonceValue(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).slice(2);
  return `${timestamp}.${randomString}`;
}

/**
 * Generates a nonce expiration date.
 * @returns {Date} The nonce expiration date.
 */
export function generateNonceExpiresAt(): Date {
  return new Date(Date.now() + NONCE_EXPIRATION_DURATION_MS);
}
