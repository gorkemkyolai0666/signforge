import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.templatesService.findAll(req.user.id, { category, search });
  }

  @Get('public')
  async findPublic(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.templatesService.findPublic({ category, search });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post()
  async create(
    @Request() req,
    @Body() data: {
      name: string;
      description?: string;
      content: string;
      variables?: any;
      category?: string;
      isPublic?: boolean;
      organizationId?: string;
    },
  ) {
    return this.templatesService.create(req.user.id, data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() data: {
      name?: string;
      description?: string;
      content?: string;
      variables?: any;
      category?: string;
      isPublic?: boolean;
    },
  ) {
    return this.templatesService.update(id, req.user.id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.templatesService.remove(id, req.user.id);
  }
}
