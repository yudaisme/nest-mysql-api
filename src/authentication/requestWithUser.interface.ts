import { Request } from 'express';
import { UsersEntity } from '../users/users.entity';
 
interface RequestWithUser extends Request {
  user: UsersEntity;
}
 
export default RequestWithUser;