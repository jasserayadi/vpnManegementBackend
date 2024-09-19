import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { BlacklistService } from './BlacklistService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService,   private readonly blacklistService: BlacklistService,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

 
  async validate(payload: any, done: Function) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload);
    const isBlacklisted = await this.blacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      return done(null, false);
    }
    return { userId: payload.sub, username: payload.username };
  }
}
