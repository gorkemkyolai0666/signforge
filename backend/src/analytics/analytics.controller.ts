import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('signing-rate')
  async getSigningRate(@Query('period') period?: string) {
    return this.analyticsService.getSigningRate({ period });
  }

  @Get('timeline')
  async getTimeline(@Query('months') months?: string) {
    return this.analyticsService.getTimeline({
      months: months ? parseInt(months, 10) : undefined,
    });
  }

  @Get('department')
  async getDepartmentBreakdown() {
    return this.analyticsService.getDepartmentBreakdown();
  }
}
