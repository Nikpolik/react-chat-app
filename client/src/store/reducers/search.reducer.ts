import { Action } from 'redux';
import { USER_RESULTS, CLEAR_USER_RESULTS } from 'src/constants';
import { USER_RESULTS_ACTION } from '../actions/search';

export interface SearchState {
    user: {
        query: string,
        result: { username: string, _id: string}[]
    }
}

const initialState: SearchState = {
    user: {
        query: '',
        result: []
    }
}
export function searchReducer(state: SearchState = initialState, action: Action): SearchState {
    switch(action.type) {
        case CLEAR_USER_RESULTS:
            return {
                ...state,
                user: {
                    query: '',
                    result: []
                }
            }
        case USER_RESULTS:
            let resultAction = action as USER_RESULTS_ACTION;
            return {
                ...state,
                user: {
                    query: '',
                    result: [...resultAction.data]
                }
            }
        default:
            return {
                ...state
            }
    }
}