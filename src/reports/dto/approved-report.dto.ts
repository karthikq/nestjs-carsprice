import { IsBoolean } from 'class-validator';

export class ApprovedReportDto {
  @IsBoolean()
  approve: boolean;
}
