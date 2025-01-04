import { ONE_MINUTE_MS } from 'src/common/constants/time.constants';

export const SIGNATURE_MESSAGE_PREFIX =
  'Sign this message to authenticate with Memecoin Maverick. This message is to be signed by the user and sent to the server to authenticate and generate a JWT token. Nonce:';

export const NONCE_EXPIRATION_DURATION_MS = 5 * ONE_MINUTE_MS; // 5 minutes
