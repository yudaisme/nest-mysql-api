import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './tokenpayload.interface';

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
    	private readonly configService: ConfigService
	){}

	public async register(registrationData: RegisterDto) {
	    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
	    try {
	      const createdUser = await this.usersService.create({
	        ...registrationData,
	        password: hashedPassword
	      });
	      return createdUser;
	    } catch (error) {
	      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	public async getAuthenticatedUser(email: string, plainTextPassword: string) {
	  	try {
		    const user = await this.usersService.getByEmail(email);
		    await this.verifyPassword(plainTextPassword, user.password);
		    return user;
	  	} catch (error) {
	    	throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
	  	}
	}

	public getCookieWithJwtToken(userId: number) {
	    const payload: TokenPayload = { userId };
	    const token = this.jwtService.sign(payload);
	    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
	}

	public getCookieForLogOut() {
	    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
	}
	 
	private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
	  	const isPasswordMatching = await bcrypt.compare(
		    plainTextPassword,
		    hashedPassword
	  	);
	  	if (!isPasswordMatching) {
	    	throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
	  	}
	}
}