import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Client } from '../../client/schemas/client.schema'; // Adjust path as necessary
import { Vpn } from '../../vpn/schemas/vpn.schema'; // Adjust if needed


@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmPassword: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Client' }] })
  clients: Client[];
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Vpn' }] })
  vpns: Vpn[];
}

export const UserSchema = SchemaFactory.createForClass(User);
