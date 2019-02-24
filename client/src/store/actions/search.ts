import { USER_RESULTS, CLEAR_USER_RESULTS } from 'src/constants';
import { State } from '..';

export interface USER_RESULTS_ACTION {
    type: USER_RESULTS,
    data: { username: string, _id: string}[]
}

export const searchUsers = (username: string) => (dispatch: any, getState: () => State) => {
    const { connection: { socket }, user: { token }} = getState();
    socket.send_action('searchUsers', { token, username });
}

export const searchFriends = (username?: string) => (dispatch: any, getState: () => State) => {
    if(!username) {
        return;
    }
    const { connection: { socket }, user: { token }} = getState();
    socket.send_action('searchFriends', { token, username });
}

export const clearResults = () => ({
    type: CLEAR_USER_RESULTS
})