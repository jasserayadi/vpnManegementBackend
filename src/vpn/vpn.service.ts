import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Vpn, VpnDocument } from './schemas/vpn.schema';

@Injectable()
export class VpnService {
  constructor(@InjectModel(Vpn.name) private vpnModel: Model<VpnDocument>) {}
  async createVpn(vpn: Vpn, clientId: string) {
    if (!Types.ObjectId.isValid(vpn.userId)) {
      throw new Error('Invalid user ID');
    }
  
    // Automatically include the clientId in the clients array
    const vpnDocument = new this.vpnModel({
      description: vpn.description,
      url: vpn.url,
      port: vpn.port,
      pwd: vpn.pwd,
      address: vpn.address,
      userId: new Types.ObjectId(vpn.userId),
      clients: [...vpn.clients.map((clientId) => new Types.ObjectId(clientId)), new Types.ObjectId(clientId)],
    });
  
    return vpnDocument.save();
  }
  

  async findAllByClient(clientId: string): Promise<Vpn[]> {
    return this.vpnModel.find({ clients: clientId }).exec();
  }

  async findOne(id: string): Promise<Vpn> {
    const vpn = await this.vpnModel.findById(id).populate('userId clients').exec();
    if (!vpn) {
      throw new NotFoundException(`Vpn #${id} not found`);
    }
    return vpn;
  }

  async update(id: string, vpnData: Vpn): Promise<Vpn> {
    const existingVpn = await this.vpnModel.findByIdAndUpdate(id, vpnData, { new: true }).exec();
    if (!existingVpn) {
      throw new NotFoundException(`Vpn #${id} not found`);
    }
    return existingVpn;
  }

  async delete(id: string): Promise<void> {
    const result = await this.vpnModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Vpn #${id} not found`);
    }
  }
}
