import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Client } from '../../client/schemas/client.schema'; // Adjust path as necessary

export type VpnDocument = Vpn & Document;

@Schema()
export class Vpn {
  @Prop()
  description: string;

  @Prop()
  url: string;

  @Prop()
  port: string;

  @Prop()
  pwd: string;

  @Prop()
  address: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;  // Change type to ObjectId

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Client' }])
  clients: Types.ObjectId[];  // Change type to ObjectId[]
  
}

export const VpnSchema = SchemaFactory.createForClass(Vpn);