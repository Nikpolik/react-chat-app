import { Action } from 'redux';
import { LOADING, LOGIN_USER, USER_MESSAGE, CLEAR_MESSAGE, SAVE_DETAILS, LOGOUT } from '../../constants';
import { USER_MESSAGE_ACTION, SAVE_DETAILS_ACTION } from '../actions/user';
import { LOGIN_ACTION } from '../actions/user';

interface userReference {
    username: string;
    id: string;
}

export interface UserState {
    _id: string,
    token: string,
    expiresAt?: Date,
    username: string,
    loading: boolean,
    message: {
        type?: string,
        text?: string
    },
    firstName: string;
    lastName: string;
    invites: userReference[];
    friends: userReference[];
    invitations: userReference[];
}

const emptyState: UserState = {
    token: '',
    username: '',
    loading: false,
    message: {
    },
    invitations: [],
    firstName: '',
    lastName: '',
    friends: [],
    invites: [],
    _id: ''
}

const initialState = {
    ...emptyState
}

const token = localStorage.getItem('token');
const expiresAtString = localStorage.getItem('expiresAt');
if(token && expiresAtString) {
    const expiresAt = new Date(expiresAtString)
    if(new Date() < expiresAt) {
        initialState.expiresAt = expiresAt;
        initialState.token = token;
    }
}

console.log(initialState);

export function userReducer(state: UserState = initialState, action: Action): UserState {
    switch(action.type) {
        case LOADING: 
            return {
                ...state,
                loading: true
            }
        case LOGIN_USER: 
            const loginAction = action as LOGIN_ACTION;
            console.log(`action `,loginAction.data);
            const now = new Date().getTime();
            return {
                ...state,
                loading: false,
                token: loginAction.data.token,
                expiresAt: new Date(now + loginAction.data.expiresIn)
            }
        case USER_MESSAGE:
            const messageAction = action as USER_MESSAGE_ACTION
            return {
                ...state,
                message: {
                    ...messageAction.data
                }
            };
        case SAVE_DETAILS:
            const detailsAction = action as SAVE_DETAILS_ACTION;
            return {
                ...state,
                ...detailsAction.data
            }
        case CLEAR_MESSAGE:
            return {
                ...state,
                message: {}
            }
        case LOGOUT:
            return {
                ...emptyState
            }
        default:
            return state;
    }
}