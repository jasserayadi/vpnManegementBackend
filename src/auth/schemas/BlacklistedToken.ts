// src/auth/schemas/blacklisted-token.schema.ts
import { Schema, Document } from 'mongoose';

export interface BlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

export const BlacklistedTokenSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});
