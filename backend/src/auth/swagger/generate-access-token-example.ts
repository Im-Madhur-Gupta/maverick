import { GenerateAccessTokenDto } from '../dto/generate-access-token.dto';
import { GenerateAccessTokenResponse } from '../types/generate-access-token.interface';
import {
  generateSignatureMessage,
  generateNonceValue,
} from '../utils/nonce.utils';

export const generateAccessTokenDtoExample: GenerateAccessTokenDto = {
  solanaAddress: 'JAJMHzapWE55Gk2oQ1wgn3GLuZnMsDsJ4Wrwt4jbYR1p',
  signatureMessage: generateSignatureMessage(generateNonceValue()),
  signature:
    '4Vj9nR8v2qwKBtqZc1ZgX9RBsvZ9QGwMhVnZHyunT8tP6GxJ7rA7XArqE8cVtK3iFFW9VGjKzgAqG8tNZ7RqUQxP',
};

export const generateAccessTokenResponseExample: GenerateAccessTokenResponse = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};
