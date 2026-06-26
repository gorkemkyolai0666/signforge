import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { SignaturesModule } from './signatures/signatures.module';
import { TemplatesModule } from './templates/templates.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DocumentsModule,
    SignaturesModule,
    TemplatesModule,
    AuditModule,
    NotificationsModule,
    OrganizationsModule,
    AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {}
