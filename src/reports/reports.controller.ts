import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { createReportDto } from './dto/create-report.dto';
import { ReportService } from './reports.service';

@Controller('reports')
export class ReportsContoller {
  constructor(private reportsSerive: ReportService) {}

  @Post()
  createReport(@Body() body: createReportDto) {
    this.reportsSerive.createReport(body);
  }
}
