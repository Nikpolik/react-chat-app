import { verify } from 'jsonwebtoken';
import { Conversation } from '../entity/Conversation'
import { getDetails } from '../services/user';


export default {
    auth: async (connection, req, data, next) => {
        let SECRET = process.env.SECRET;    
        try {
            const { token } = data;
            let { id } : any = verify(token, SECRET);
            let user = await getDetails(id);
            if(!user) {
                throw new Error('Valid id but no user found');
            }
            data.user = user;
            next();
            return;
        } catch (error) {
            connection.sendAction({ type: 'LOGOUT' });
        }
    },
    ownsConversation: async (connection, req, data, next) => {
        const { conversationId, user } = data;
        const conversation = await Conversation.findById(conversationId).exec();
        if(!conversation) {
            throw new Error('This conversation does not exist');
        }
        if(conversation.participants.findIndex((value) => value == user._id) === -1) {
            throw new Error('This conversation doesnt belong to you');
        }
    }
}