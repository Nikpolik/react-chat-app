import { Action } from 'redux';
import { ADD_NOTIFICATION } from 'src/constants';
import { ADD_NOTIFICATION_ACTION } from '../actions/notifications';
const { toast } = require('react-semantic-toasts');
export enum NotificationType {
    warning,
    error,
    success
}

export interface Notification {
    type: NotificationType,
    text: string;
    title: string;
}

export interface NotifiactionsState {
    expired: Notification[]
}

const initialState: NotifiactionsState = {
    expired: []
}

export function notificationsReducer(state = initialState, action: Action) {
    switch(action.type) {
        case ADD_NOTIFICATION:
            let {  data: { text, type, title } } = action as ADD_NOTIFICATION_ACTION;
            toast({
                title,
                description: text,
                type,
                time: 10 * 1000,
                icon: () => null,
            })
        default:
            return state;
    }
}