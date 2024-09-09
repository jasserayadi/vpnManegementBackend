import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Vpn, VpnDocument } from './schemas/vpn.schema';
import { exec } from 'child_process';
import * as fs from 'fs';

@Injectable()
export class VpnService {
  constructor(@InjectModel(Vpn.name) private vpnModel: Model<VpnDocument>) {}

  async createVpn(vpn: Vpn, clientId: string): Promise<Vpn> {
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

  async getVpnById(vpnId: string): Promise<Vpn> {
    const vpn = await this.vpnModel.findById(vpnId).exec();
    if (!vpn) {
      throw new NotFoundException(`VPN #${vpnId} not found`);
    }
    return vpn;
  }

  async connectToVpn(vpn: Vpn): Promise<string> {
  let command = '';
  
  if (vpn.url.endsWith('.ovpn')) {
    const openvpnPath = 'C:\\Program Files\\OpenVPN\\bin\\openvpn.exe';
    const configFile = vpn.url;
    const credentialsFile = 'C:\\Users\\Ayedi\\Downloads\\credentials.txt';

    fs.writeFileSync(credentialsFile, `${vpn.description}\n${vpn.pwd}`);

    command = `"${openvpnPath}" --config "${configFile}" --auth-user-pass "${credentialsFile}"`;
  } else if (vpn.url.includes('fortinet')) {
    const fortiClientCliPath = 'C:\\Program Files\\Fortinet\\FortiClient\\forticlient.exe';
  command = `"${fortiClientCliPath}" connect --server "${vpn.address}:${vpn.port}" --username "${vpn.description}" --password "${vpn.pwd}"`;
 } else {
    throw new InternalServerErrorException('Unsupported VPN type');
  }

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      const exitCode = error?.code; // Capture the exit code
      if (exitCode) {
        console.error('VPN connection failed.');
        console.error(`Exit code: ${exitCode}`);
        console.error(`Error message: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        reject(new InternalServerErrorException(`Failed to connect to VPN: ${stderr || error.message}`));
      } else {
        console.log('VPN connected successfully.');
        resolve(stdout);
      }
    });
  });
}

  
  async disconnectVpn(): Promise<string> {
    let command = '';

    // This assumes you are disconnecting from OpenVPN
    const openvpnDisconnectCommand = 'taskkill /IM openvpn.exe /F'; // Command to disconnect OpenVPN
    command = openvpnDisconnectCommand;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error disconnecting VPN.');
          console.error(`Error message: ${error.message}`);
          console.error(`stderr: ${stderr}`);
          reject(new InternalServerErrorException(`Failed to disconnect VPN: ${stderr || error.message}`));
        } else {
          console.log('VPN disconnected successfully.');
          resolve(stdout);
        }
      });
    });
  }
}