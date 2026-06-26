import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.documentsService.findAll(req.user.id, { status, search, tag, startDate, endDate });
  }

  @Get('calendar')
  async getCalendar(@Request() req) {
    return this.documentsService.getCalendar(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.documentsService.getStats(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.documentsService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() dto: CreateDocumentDto, @Request() req) {
    return this.documentsService.create(req.user.id, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto, @Request() req) {
    return this.documentsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.documentsService.remove(id, req.user.id);
  }

  @Post(':id/send')
  @HttpCode(200)
  async sendForSigning(
    @Param('id') id: string,
    @Body() body: { signers: { email: string; name?: string }[] },
    @Request() req,
  ) {
    return this.documentsService.sendForSigning(id, req.user.id, body);
  }

  @Post(':id/analyze-risk')
  @HttpCode(200)
  async analyzeRisk(@Param('id') id: string, @Request() req) {
    return this.documentsService.analyzeRisk(id, req.user.id);
  }
}
