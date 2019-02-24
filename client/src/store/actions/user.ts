import { LOADING, LOGIN_USER, USER_MESSAGE, CLEAR_MESSAGE, SAVE_DETAILS, LOGOUT } from '../../constants';
import { Dispatch, Action } from 'redux';
import { State } from '..';
import { routerActions } from 'connected-react-router';

export interface LOGIN_ACTION extends Action {
    type: LOGIN_USER;
    data: {
        token: string;
        expiresIn: string;
        message: {
            type: string;
            text: string;
        }
    }
}

export interface USER_MESSAGE_ACTION extends Action {
    type: USER_MESSAGE;
    data: {
        type: string;
        text: string;
    }
}

export interface SAVE_DETAILS_ACTION extends Action {
    type: SAVE_DETAILS,
    data: any
}

export interface CLEAR_MESSAGE_ACTION extends Action {
    type: CLEAR_MESSAGE;
}

export interface SAVE_USER_DATA extends Action {
    type: SAVE_USER_DATA;
}

export const login = (username: string, password: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket } } = getState();
    dispatch({ type: LOADING });
    socket.send_action('login', { username, password });
}

export const logout = () => ({
    type: LOGOUT
});

export const register = (username: string, password: string, confirmPassword: string, firstName: string, lastName: string, email: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket } } = getState();
    dispatch({ type: LOADING });
    socket.send_action('register', { username, password, confirmPassword, firstName, lastName, email });
}

export const clearMessage = (): CLEAR_MESSAGE_ACTION => ({
    type: CLEAR_MESSAGE
})

export const authNavigation = (path: string) => (dispatch: Dispatch) => {
    dispatch(clearMessage());
    dispatch(routerActions.push(path));
}

export const addFriend = (friendId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token }} = getState();
    socket.send_action('addFriend', { friendId, token });
}

export const getDetails = () => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token, username }} = getState();
    if(!username) {
        socket.send_action('getDetails', { token });
    }
}

export const acceptInvite = (friendId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token }} = getState();
    socket.send_action('acceptInvite', { friendId, token});
}

export const deleteFriend = (friendId: string) => (dispatch: Dispatch, getState: () => State) => {
    const { connection: { socket }, user: { token } } = getState();
    socket.send_action('deleteFriend', { token, friendId });
}