import { Action } from 'redux';
import { ADD_NOTIFICATION } from 'src/constants';
import { Notification } from '../reducers/notifications.reducer';
export interface ADD_NOTIFICATION_ACTION extends Action {
    type: ADD_NOTIFICATION;
    data: Notification
};