import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report.dto';
import { ReportService } from './reports.service';

@Controller('reports')
export class ReportsContoller {
  constructor(private reportsSerive: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CreateUser() user: User) {
    console.log(body);

    this.reportsSerive.create(body, user);
  }
}
