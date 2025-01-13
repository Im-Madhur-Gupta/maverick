import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  validateSync,
  Max,
  Min,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  FERE_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  FERE_USER_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_GEMINI_API_KEY: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsUrl()
  @IsOptional()
  ORIGIN_URL: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
