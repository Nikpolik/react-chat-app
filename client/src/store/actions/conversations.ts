import { Dispatch, Action } from 'redux';
import { State } from '../index';
import { SAVE_CONVERSATIONS, ADD_CONVERSATION, SAVE_SELECTION, ADD_MESSAGE, LEFT_CONVERSATION } from 'src/constants';
import { Conversation, Message } from '../reducers/conversations.reducer';


export interface SaveConversationsAction extends Action {
    type: SAVE_CONVERSATIONS;
    data: Conversation[];
}

export interface AddConversationAction extends Action {
    type: ADD_CONVERSATION,
    data: Conversation
}

export interface SaveSelectionAction extends Action {
    type: SAVE_SELECTION;
    data: Conversation
};

export interface AddMessageAction extends Action {
    type: ADD_MESSAGE;
    data: Message
}

export interface LeftConversationAction extends Action {
    type: LEFT_CONVERSATION;
    data: string
}

export const loadConversations = () => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token } } = getState();
    socket.send_action('getUserConversations', { token });
}

export const createConversation = (friendId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token } } = getState();
    socket.send_action('createConversation', { friendId, token });
};

export const loadConversation = (conversationId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token } } = getState();
    socket.send_action('loadMessages', { token, conversationId });
};

export const sendMessage = (text: string, conversationId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token } } = getState();
    socket.send_action('sendMessage', { text, token, conversationId });
}

export const leaveConversation = () => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, conversations: { selected }, user: { token }} = getState();
    if(!selected) {
        return;
    }
    socket.send_action('leaveConversation', { conversationId: selected._id, token });
}

export const inviteToConversation = (friendId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token }, conversations: { selected } } = getState();
    if(!selected) {
        return;
    }
    socket.send_action('inviteToConversation', { friendId, token, conversationId: selected._id });
}