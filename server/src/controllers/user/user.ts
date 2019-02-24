import { LOGOUT, SAVE_DETAILS, USER_RESULTS } from '../../constants';
import { getDetails, searchByUsername } from '../../services/user';
import { sendAction } from '../../utils';
import { Method } from '../../lib/socketApp';

const controller: Method[] = [
    {
        use: ['auth'],
        type: 'getDetails',
        action: async (ws, req, data) => {
            const { user } = data;
            if(!user) {
                ws.sendAction({ type: 'LOGOUT'})
                return;
            }
            ws.sendAction({ type: 'SAVE_DETAILS', data: { ...user.toJSON() }})
        },
    }, {
        use: ['auth'],
        type: 'searchUsers',
        action: async (ws, req, data) => {
            const users = await searchByUsername(data.username, data.user);
            ws.sendAction({ type: USER_RESULTS, data: users })
        }
    }
];

export default controller;