import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop()
  clientId: number;

  @Prop()
  clientName: string;

  @Prop()
  email: string;

  @Prop()
  numero: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId; // Change the type to Types.ObjectId

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Vpn' }])
  vpns: Types.ObjectId[]; // Ensure vpns are also of type ObjectId
}

export const ClientSchema = SchemaFactory.createForClass(Client);