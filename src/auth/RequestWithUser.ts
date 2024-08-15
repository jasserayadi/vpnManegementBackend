// src/common/interfaces/request-with-user.interface.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // Replace `any` with a more specific type if possible
}
