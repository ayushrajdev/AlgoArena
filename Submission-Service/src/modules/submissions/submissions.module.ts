import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { SubmissionsRepository } from './submisions.repository';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService,SubmissionsRepository]
})
export class SubmissionsModule {}
