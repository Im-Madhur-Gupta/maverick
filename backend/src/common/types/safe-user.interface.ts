import { User } from '@prisma/client';

export type SafeUser = Pick<User, 'solanaAddress' | 'createdAt'>;
