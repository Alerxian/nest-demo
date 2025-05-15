import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录
   */
  @Get('/login')
  login(@Query() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
