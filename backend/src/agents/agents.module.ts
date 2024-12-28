import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { FereModule } from 'src/fere/fere.module';

@Module({
  imports: [FereModule],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
