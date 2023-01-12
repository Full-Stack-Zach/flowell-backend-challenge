import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AppService, Healthcheck } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
  ) {}

  @Get('health')
  getHealthcheck(): Healthcheck {
    return this.appService.getHealthcheck();
  }
}
