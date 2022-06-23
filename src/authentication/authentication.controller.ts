import { Body, Req, Controller, HttpCode, Get, Post, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
 
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(user.id);
    const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
    response.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
    return response.send({
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      data: {
        user: user,
        accessToken: accessTokenCookie.token,
        refreshToken: refreshTokenCookie.token
      }
    })
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id)
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return request.user;
  }
}