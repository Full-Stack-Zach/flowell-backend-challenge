import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request
  } from '@nestjs/common';
  import { CreateUserDto } from '../users/dto/create-user.dto';
  import { LocalAuthGuard } from '../auth/local-auth.guard'
  import { AuthService } from './auth.service';
  

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }
  
    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }
}
