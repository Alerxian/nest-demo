import { Request } from 'express';

export interface RequestWidthUser extends Request {
  user: {
    userId: number;
    username: string;
  };
}
