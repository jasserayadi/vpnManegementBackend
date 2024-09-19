import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { BlacklistService } from './BlacklistService';
import { BlacklistedToken } from './schemas/BlacklistedToken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private blacklistService: BlacklistService,@InjectModel('BlacklistedToken') private blacklistModel: Model<BlacklistedToken> // Ensure this exists and is injected
  ) {}
  
  async register(username: string, email: string, password: string, confirmPassword: string, role: string): Promise<User> {
    console.log('Registering user with:');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Role:', role);
  
    if (!username || !email || !password || !confirmPassword) {
      throw new BadRequestException('Username, email, password, and confirmPassword are required');
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    try {
      const user = new this.userModel({ username, email, password: hashedPassword, confirmPassword: hashedPassword, role });
      return user.save();
    } catch (error) {
      console.error('Error registering user:', error);
      throw new InternalServerErrorException('Error registering user');
    }
  }
  
  

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async logout(token: string): Promise<void> {
    try {
      if (!token) {
        throw new Error('Token is required');
      }
      
      // Blacklist the token
      await new this.blacklistModel({ token, expiresAt: new Date() }).save();
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw new InternalServerErrorException('Failed to logout');
    }
}}