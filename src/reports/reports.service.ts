import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';

import { Report } from './reports.entity';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);

    report.user = user;
    return this.repo.save(report);
  }
  async changeApprovel(id: number, approved: boolean) {
    try {
      const report = await this.repo.findOne({ where: { id } });
      if (!report) {
        throw new NotFoundException('Report not found');
      }
      report.approve = approved;

      return this.repo.save(report);
    } catch (error) {
      throw new BadRequestException('request error please try again');
    }
  }

  generateEstimate(data: GetEstimateDto) {}
}
