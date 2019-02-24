import { Model, Schema, Document, model } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
type ObjectId = typeof ObjectId;

export interface MessageModel extends Document {
    text: string;
    sender: string;
    createdAt: Date;
    updatedAt: Date;
    conversation: string;
}

const MessageSchema = new Schema({
    text: String,
    sender: {
        type: ObjectId,
        ref: 'User'
    },
    conversation: {
        type: ObjectId,
        ref: 'Conversation',
        index: true
    }
}, {
    timestamps: true
});

export const Message = model<MessageModel>('Message', MessageSchema);
export { MessageSchema };