import { Request } from 'express';
import { Session } from 'express-session';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    username: string;
  };
}

export interface RequestWithSession extends Request {
  session: Session & { user?: any };
}
