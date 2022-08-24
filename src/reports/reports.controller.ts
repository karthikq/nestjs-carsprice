import {
  Body,
  Controller,
  Injectable,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ApprovedReportDto } from './dto/approved-report.dto';
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

    return this.reportsSerive.create(body, user);
  }
  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
    return this.reportsSerive.changeApprovel(parseInt(id), body.approve);
  }
}
