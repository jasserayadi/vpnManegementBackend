import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken } from './schemas/BlacklistedToken'; // Correct import

@Injectable()
export class BlacklistService {
  constructor(@InjectModel('BlacklistedToken') private blacklistModel: Model<BlacklistedToken>) {}

  async blacklistToken(token: string, expiresAt: Date): Promise<void> {
    await new this.blacklistModel({ token, expiresAt }).save();
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistModel.findOne({ token });
    return !!blacklistedToken;
  }
}
