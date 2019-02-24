import { Action } from 'redux';
import { SAVE_CONVERSATIONS, ADD_CONVERSATION, SAVE_SELECTION, ADD_MESSAGE, LEFT_CONVERSATION } from 'src/constants';
import { SaveConversationsAction, AddConversationAction, SaveSelectionAction, AddMessageAction, LeftConversationAction } from '../actions/conversations';

export interface ConversationsState {
    conversations: {
        [id: string]: Conversation
    };
    selected?: Conversation
}

const initialState = {
    conversations: {}
}

export interface Conversation {
    participants: {
        _id: string,
        username: string    
    }[];
    messages: Message[];
    lastUpdate: Date;
    _id: string;
    lastMessage: Message;
    lastMessageTimestamp: string;
}

export interface Message {
    id: string;
    updatedAt: string;
    text: string;
    sender: string;
    conversation: string;
}

export default function conversasionsReducer(state: ConversationsState = initialState, action: Action): ConversationsState {
    switch(action.type) {
        case SAVE_CONVERSATIONS:
            const { data: conversationsList } = action as SaveConversationsAction;
            const conversations = {};
            conversationsList.forEach((conversation) => {
                conversations[conversation._id] = conversation
            })
            return {
                ...state,
                conversations 
            }
        case ADD_CONVERSATION:
            const { data: conversation } = action as AddConversationAction;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversation._id]: conversation
                }
            }
        case SAVE_SELECTION:
            const { data: messages } = action as SaveSelectionAction;
            return {
                ...state,
                selected: messages
            }
        case LEFT_CONVERSATION:
        const { data: conversationId } = action as LeftConversationAction;
            const newState = { ...state };
            delete newState.conversations[conversationId];
            if(state.selected) {
                if(state.selected._id === conversationId) {
                    delete newState.selected;
                }
            }
            return newState;
        case ADD_MESSAGE:
            const { data: message } = action as AddMessageAction;
            const conversationTochange = state.conversations[message.conversation];
            let selected = state.selected;
            console.log(message);
            if(selected && selected._id === message.conversation) {
                selected = {
                    ...selected,
                    lastMessageTimestamp: message.updatedAt,
                    lastMessage: message,
                    messages: [
                        ...selected.messages,
                        message
                    ]
                }
            }
            return {
                conversations: {
                    ...state.conversations,
                    [message.conversation]: {
                        ...conversationTochange,
                        lastMessageTimestamp: message.updatedAt,
                        lastMessage: message
                    }
                },
                selected
            }
        default:
            return state;
    }
}