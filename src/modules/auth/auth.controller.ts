import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithSession, RequestWithUser } from '@/types/request';
import { SessionGuard } from './guards/session.guard';
import { JwtAuthService } from './jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  /**
   * 登录
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    // 生成 token
    const token = await this.authService.generateToken(user);

    return {
      code: HttpStatus.OK,
      data: {
        token,
        user,
      },
      message: '登录成功',
    };
  }

  @Post('login-session')
  async loginSession(
    @Body() loginDto: LoginDto,
    @Session() session: RequestWithSession,
  ) {
    const user = await this.authService.login(loginDto);
    session.user = user; // 将用户信息存入 session 中

    return {
      code: HttpStatus.OK,
      data: {
        user,
      },
      message: '登录成功',
    };
  }

  @Post('login-refresh')
  async loginRefresh(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    // 生成 token
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtAuthService.generateAccessToken(payload);
    const refreshToken =
      await this.jwtAuthService.generateRefreshToken(payload);

    return {
      code: HttpStatus.OK,
      data: {
        accessToken,
        refreshToken,
        user,
      },
      message: '登录成功',
    };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.jwtAuthService.refreshTokens(refreshToken);
  }

  // 登出
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithUser) {
    await this.jwtAuthService.revokeRefreshToken(req.user.userId);
    return {
      message: 'success',
    };
  }

  @Post('force-logout')
  @UseGuards(JwtAuthGuard)
  async forceLogout(@Body('userId') userId: string) {
    await this.jwtAuthService.revokeRefreshToken(+userId);
    return { message: 'User logged out from all devices' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.userId);
  }

  @Get('me-session')
  @UseGuards(SessionGuard)
  async getSessionProfile(@Request() req: RequestWithSession) {
    return this.authService.getProfile(req.session.user.userId);
  }
}
