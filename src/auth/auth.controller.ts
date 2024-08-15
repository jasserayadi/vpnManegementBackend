import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Implement your authentication logic here
    return true; // or false, depending on your logic
  }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiBody({ schema: { example: { username: 'exampleUser', email: 'exampleEmail', password: 'examplePassword', confirmPassword: 'examplePassword', role: 'exampleRole' } } })
  async register(@Body() registerDto: { username: string, email: string, password: string, confirmPassword: string, role: string }) {
    console.log('Received register request with:', registerDto);
    return this.authService.register(registerDto.username, registerDto.email, registerDto.password, registerDto.confirmPassword, registerDto.role);
  }
  

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiBody({ schema: { example: { username: 'exampleUser', password: 'examplePassword' } } })
  async login(@Body() loginDto: { username: string, password: string }) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials', statusCode: 401 };
  }

 
}
