import SocketRouter from '../../lib/socketRouter';

import { store } from '../../App';
import { Action } from 'redux';
import { RESET_CONNECTION } from 'src/constants';

export interface ConnectionState {
    socket: SocketRouter
}

let socket_url = 'ws://react-chat-backend.herokuapp.com'
// let socket_url = 'ws://localhost:8080';

let socket = new SocketRouter(store, socket_url);

export function connectionReducer(state: ConnectionState = { socket }, action: Action): ConnectionState {
    switch(action.type) {
        case RESET_CONNECTION:
            return {
                socket: new SocketRouter(store, socket_url)
            }
        default:
            return state;
    }
}
