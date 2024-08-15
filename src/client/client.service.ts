import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>) {}

  async create(clientData: Client): Promise<Client> {
    if (typeof clientData.userId === 'string') {
      clientData.userId = new Types.ObjectId(clientData.userId);
    }
    const newClient = new this.clientModel(clientData);
    return newClient.save();
  }

  async findAll(): Promise<Client[]> {
    console.log('Fetching all clients');
    const clients = await this.clientModel.find().exec();
    console.log('Clients fetched:', clients);
    return clients;
  }
  
  

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).populate('userId').exec();
    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    return client;
  }

  async update(id: string, clientData: Client): Promise<Client> {
    const existingClient = await this.clientModel.findByIdAndUpdate(id, clientData, { new: true }).exec();
    if (!existingClient) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    return existingClient;
  }
  async delete(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Client #${id} not found`);
    }
  }
}
