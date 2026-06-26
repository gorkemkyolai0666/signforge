import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('signatures')
@UseGuards(JwtAuthGuard)
export class SignaturesController {
  constructor(private signaturesService: SignaturesService) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('documentId') documentId?: string,
  ) {
    return this.signaturesService.findAll(req.user.id, { status, documentId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.signaturesService.findOne(id);
  }

  @Post()
  async create(
    @Request() req,
    @Body() body: { documentId: string; signerEmail: string; signerName?: string },
  ) {
    return this.signaturesService.create(req.user.id, body);
  }

  @Post(':id/sign')
  @HttpCode(200)
  async sign(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { signatureData?: string; kvkkConsent?: boolean; ipAddress?: string; userAgent?: string },
  ) {
    return this.signaturesService.sign(id, req.user.id, body);
  }

  @Post(':id/reject')
  @HttpCode(200)
  async reject(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { reason?: string },
  ) {
    return this.signaturesService.reject(id, req.user.id, body);
  }
}
