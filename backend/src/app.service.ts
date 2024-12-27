import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    await prisma.agents.create({
      data: {
        name: 'Alice',
        id: uuidV4(),
        persona: 0,
      },
    });
    const allAgents = await prisma.agents.findMany();
    console.log('allAgents', allAgents);
    return 'Hello World!';
  }
}
