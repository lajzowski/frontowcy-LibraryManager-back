import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as process from 'node:process';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { RentsModule } from './rents/rents.module';
import { AdminModule } from './admin/admin.module';
import { LogsService } from './logs/logs.service';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      connectorPackage: 'mysql2',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ['dist/**/**.entity{.ts,.js}'],
      bigNumberStrings: false,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BooksModule,
    RentsModule,
    AdminModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogsService],
  exports: [LogsService],
})
export class AppModule {}
