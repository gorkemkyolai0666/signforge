import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  async create(
    @Body() data: {
      name: string;
      kvkkConsent?: boolean;
      plan?: string;
      maxUsers?: number;
      maxDocuments?: number;
    },
  ) {
    return this.organizationsService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      kvkkConsent?: boolean;
      plan?: string;
      maxUsers?: number;
      maxDocuments?: number;
    },
  ) {
    return this.organizationsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @Post(':id/members')
  @HttpCode(200)
  async addMember(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.organizationsService.addMember(id, body.userId);
  }

  @Delete(':id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.organizationsService.removeMember(id, userId);
  }
}
