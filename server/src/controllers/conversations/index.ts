import { Method } from "../../lib/socketApp";
import conversations from './conversations';
const conversationsController: Method[] = [
    ...conversations
]

export default conversationsController;