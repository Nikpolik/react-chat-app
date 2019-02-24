import { Method } from "../../lib/socketApp";
import { createConversation, getConversations, loadMessages, loadConversation, sendMessage, leaveConversation, inviteToConversation } from "../../services/conversations";
import { ADD_CONVERSATION, SAVE_CONVERSATIONS, SAVE_SELECTION, ADD_MESSAGE, ADD_NOTIFICATION, LEFT_CONVERSATION } from "../../constants";
import { UserModel } from "../../entity/User";


const controller: Method[] = [
    {
        type: 'getUserConversations',
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user } = data;
            let conversations = await getConversations(user.id);
            // conversations.forEach((conversation) => conversation.update)
            ws.sendAction({ type: SAVE_CONVERSATIONS, data: [...conversations] });
        }
    }, {
        type: 'createConversation',
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user, friendId } = data;
            let conversation = await createConversation(user.id, friendId);
            conversation = await conversation.updateWithLastMessage();
            ws.broadcast([user._id, friendId], { type: ADD_CONVERSATION, data: conversation });
        }
    }, {
        type: 'loadMessages',
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user, conversationId } = data;
            let conversation = await loadConversation(user.id, conversationId)
            await conversation.getRelations();
            let messages = await loadMessages(user.id, conversation, 0, 0);
            ws.sendAction({
                type: SAVE_SELECTION, data: {
                    ...conversation.toObject(),
                    messages
                }
            });
        }
    }, {
        type: 'sendMessage',
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user, conversationId, text } = data;
            let conversation = await loadConversation(user.id, conversationId);
            let message = await sendMessage(user.id, conversation._id, text);
            let participants = await conversation.getRelations();
            ws.broadcast(participants.filter((participant) => user._id.toString() !== participant._id.toString()).map((user) => user.id), { type: ADD_NOTIFICATION, data: { title: 'New Message', text: `You recieved a new message from ${user.username}!`, type: 'success' } });
            ws.broadcast(participants.map((participant) => participant.id), { type: ADD_MESSAGE, data: message.toObject() });
        }
    }, {
        type: 'leaveConversation',
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user, conversationId } = data;
            let conversation = await leaveConversation(conversationId, user);
            let message = await sendMessage(user.id, conversationId, `User ${user.username} has left the conversation`);
            const notLeft = (participant: string) => {
                return !(conversation.left.indexOf(participant) !== -1);
            }
            ws.broadcast(conversation.participants.filter(notLeft), { type: ADD_MESSAGE, data: message.toObject() });
            ws.broadcast([user.id], { type: LEFT_CONVERSATION, data: conversationId });
        }
    }, {
        type: 'inviteToConversation',
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user, conversationId, friendId } = data;
            let conversation = await inviteToConversation(conversationId, user, friendId);
            if(!conversation) {
                return;
            }
            let participants = conversation.participants;
            let message = await sendMessage(friendId, conversationId, `A new user has joint the conversation`);
            ws.broadcast(participants.filter((participant) => friendId !== participant), { type: ADD_NOTIFICATION, data: { title: 'New Message', text: message.text, type: 'success' } });
            ws.broadcast(participants, { type: ADD_MESSAGE, data: message.toObject() });
        }
    }
]

export default controller;