import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsContoller } from './reports.controller';
import { Report } from './reports.entity';
import { ReportService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers:[ReportsContoller],
  providers: [ReportService],
})
export class ReportsModule {}
