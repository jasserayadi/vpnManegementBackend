// src/auth/blacklist.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlacklistService } from './BlacklistService';
import { BlacklistedTokenSchema } from './schemas/BlacklistedToken';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'BlacklistedToken', schema: BlacklistedTokenSchema }]),
  ],
  providers: [BlacklistService],
  exports: [BlacklistService],  // Export the service
})
export class BlacklistModule {}