import { Holding } from '@prisma/client';

export type GetHoldingsResponse = Array<Omit<Holding, 'externalId'>>;
