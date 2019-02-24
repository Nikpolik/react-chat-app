import { Schema, Document, model } from 'mongoose';
import { MessageModel, MessageSchema } from './Message';
import { Message } from './Message';
import { UserModel } from './User';
const ObjectId = Schema.Types.ObjectId;
type ObjectId = typeof ObjectId;

export interface ConversationModel extends Document {
    name: string;
    participants: string[];
    left: string[];
    messages: MessageModel;
    updatedAt: Date;
    createdAt: Date;
    lastMessageTimestamp: Date;
    lastMessage: MessageModel;
    getParticipants: () => UserModel[];
    updateWithLastMessage: () => ConversationModel;
}

const ConversationSchema = new Schema({
    name: String,
    participants: [{
        type: ObjectId,
        ref: 'User'
    }],
    left: [{
        type: ObjectId,
        ref: 'User'
    }],
    lastUpdate: Date,
    lastMessage: Object,
    lastMessageTimestamp: Date
}, {
    timestamps: true
});

async function updateWithLastMessage(this: ConversationModel) {
    console.log(this.id);
    try {
        const lastMessage = await Message.findOne({ conversation: this.id }).sort({ createdAt: -1 }).limit(1).exec();
        if(!lastMessage) {
            this.lastMessage = null;
            this.lastMessageTimestamp = this.createdAt;
            return this;
        }  
        this.lastMessage = lastMessage;
        this.lastMessageTimestamp = lastMessage.updatedAt;
        console.log('-----------');
        console.log(this);
        console.log('last message ', this.lastMessage);
        console.log('real last message ', lastMessage);
        console.log('-----------');
        return this;
    } catch (error) {
        console.log(error);
    }
}

async function getParticipants(this: ConversationModel) {
    try {
        await this.populate({ path: 'participants', select: '_id username' }).execPopulate();
        return this.participants;
    } catch (error) {
        console.log(error);
    }
}

ConversationSchema.methods.getParticipants = getParticipants;
ConversationSchema.methods.updateWithLastMessage = updateWithLastMessage;
export const Conversation = model<ConversationModel>('Chat', ConversationSchema);