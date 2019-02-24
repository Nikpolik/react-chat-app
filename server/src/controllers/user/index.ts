import friends from './friends';
import authentication from './authentication';
import user from './user';
import { Method } from '../../lib/socketApp';

const userController: Method[] = [
    ...friends,
    ...authentication,
    ...user
];

export default userController;