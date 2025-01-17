import { Agent } from '@prisma/client';
import { SafeUser } from 'src/common/types/safe-user.interface';

export type SafeAgent = Pick<
  Agent,
  | 'id'
  | 'name'
  | 'description'
  | 'persona'
  | 'evmAddress'
  | 'solAddress'
  | 'isActive'
  | 'createdAt'
> & {
  owner: SafeUser;
};
