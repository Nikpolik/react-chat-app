import { createStore, combineReducers, applyMiddleware } from 'redux';
import { userReducer, UserState } from './reducers/user.reducer';
import { searchReducer, SearchState} from './reducers/search.reducer';
import { routerMiddleware, connectRouter, RouterState } from 'connected-react-router';
import thunk from 'redux-thunk';
import { ConnectionState, connectionReducer } from './reducers/connection.reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import conversasionsReducer, { ConversationsState } from './reducers/conversations.reducer';
import { NotifiactionsState, notificationsReducer } from './reducers/notifications.reducer';

export interface State {
    user: UserState,
    router: RouterState,
    connection: ConnectionState,
    conversations: ConversationsState,
    search: SearchState,
    notifications: NotifiactionsState
}

export default (history: any) => createStore(combineReducers({
    user: userReducer,
    router: connectRouter(history),
    connection: connectionReducer,
    conversations: conversasionsReducer,
    search: searchReducer,
    notifications: notificationsReducer
}), composeWithDevTools(
    applyMiddleware(
        routerMiddleware(history),
        thunk
    )
))