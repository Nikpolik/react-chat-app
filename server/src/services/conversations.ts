import { Conversation, ConversationModel } from '../entity/Conversation';
import { User, UserModel } from '../entity/User';
import { Message } from '../entity/Message';

export async function createConversation(id: string, friendId: string) {
    const chat = new Conversation();
    chat.participants = [id, friendId];
    chat.save();
    await chat.populate({ path: 'participants', select: '_id username', match: { _id: { $ne: id } } }).execPopulate()
    return chat;
}

export async function getConversations(id: string) {
    try {
        let conversations = await Conversation.find({ participants: id, left: { $ne: id } }).populate({ path: 'participants', select: '_id username', match: { _id: { $ne: id } } }).exec();
        conversations = await Promise.all(conversations.map((conversation) => conversation.updateWithLastMessage()));
        console.log(conversations);
        return conversations;
    } catch (error) {
        console.log(error);
    }
}

export async function loadMessages(id: string, conversation: ConversationModel, start: number, end: number) {
    try {
        return await Message.find({ conversation: conversation.id })
            .sort({ dateCreated: -1 }).skip(start).limit(end).exec();
    } catch (error) {
        console.log(error);
    }
}

export async function loadConversation(id: string, conversationId: string) {
    try {
        return await Conversation.findOne({ _id: conversationId, participants: id, left: { $ne: id } }).select('participants _id').exec()
    } catch (error) {
        console.log(error);
    }
}

export async function sendMessage(id: string, conversationId: string, text: string) {
    try {
        const message = new Message();
        message.text = text;
        message.sender = id;
        message.conversation = conversationId;
        message.save();
        return message;
    } catch (error) {
        console.log(error);
    }
}

export async function leaveConversation(conversationId: string, user: UserModel) {
    try {
        const conversation = await Conversation.findById(conversationId);
        let index = conversation.participants.findIndex((participant) => participant == user.id);
        if (index === -1) {
            throw new Error('Trying to leave a conversation you are not participating');
        }
        conversation.left.push(user.id);
        conversation.save();
        return conversation;
    } catch (error) {
        console.log(error);
    }
};


export async function inviteToConversation(conversationId: string, user: UserModel, friendId: string) {
    try {
        const [conversation, friend] = [
            await Conversation.findById(conversationId),
            await User.findById(friendId)
        ];
        let index = conversation.participants.findIndex((participant) => participant == friend.id);
        if (index !== -1) {
            return null
        }
        conversation.participants.push(friend.id);
        await conversation.save();
        return conversation;
    } catch (error) {
        console.log(error);
    }
}