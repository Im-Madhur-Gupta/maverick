import { GenerateSignatureMessageDto } from '../dto/generate-signature-message.dto';
import { GenerateSignatureMessageResponse } from '../types/generate-signature-message.interface';
import { generateSignatureMessage } from '../utils';
import { generateNonceValue } from '../utils';

export const generateMessageSignatureDtoExample: GenerateSignatureMessageDto = {
  solanaAddress: 'JAJMHzapWE55Gk2oQ1wgn3GLuZnMsDsJ4Wrwt4jbYR1p',
};

export const generateMessageSignatureResponseExample: GenerateSignatureMessageResponse =
  {
    message: generateSignatureMessage(generateNonceValue()),
  };
