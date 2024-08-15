import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VpnService } from './vpn.service';
import { VpnController } from './vpn.controller';
import { Vpn, VpnSchema } from './schemas/vpn.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vpn.name, schema: VpnSchema }]), // Register VpnModel
  ],
  controllers: [VpnController],
  providers: [VpnService],
  exports: [VpnService],
})
export class VpnModule {}
