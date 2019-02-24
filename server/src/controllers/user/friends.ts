import { ADD_NOTIFICATION, SAVE_DETAILS, FRIENDS_RESULT, USER_RESULTS } from '../../constants';
import { friendInvite, acceptInvite, deleteFriend, searchFriendByUsername } from '../../services/user';
import { Method } from '../../lib/socketApp';

const controller: Method[] = [
    {
        use: ['auth'],
        type: 'addFriend',
        action: async (ws, req, data) => {
            let { user, friendId } = data;
            try {
                let { friend } = await friendInvite(user, friendId);
                ws.broadcast([friendId], { type: ADD_NOTIFICATION, data: { title: 'Friend request recieved', text: `You have recieved a friend request from ${user.username}`, type: 'success' } });
                ws.broadcast([user.id], { type: ADD_NOTIFICATION, data: { title: 'Friend request sent', text: 'The friend request has been recieved', type: 'success' } });
                ws.broadcast([user.id], { type: SAVE_DETAILS, data: { ...user.toJSON() } })
                ws.broadcast([friendId], { type: SAVE_DETAILS, data: { ...friend.toJSON() } })
            } catch (error) {
                console.log('error');
                ws.broadcast([user.id], { type: ADD_NOTIFICATION, data: { title: 'Cannot invite', text: 'Cannot invite user, you are already friends with that user or the user does not exist', type: 'error' } });
            }
        }
    }, {
        use: ['auth'],
        type: 'acceptInvite',
        action: async (ws, req, data) => {
            const { user, friendId } = data;
            try {
                let { friend } = await acceptInvite(user, friendId);
                ws.broadcast([friendId], { type: ADD_NOTIFICATION, data: { title: 'Friend request accepted', text: `${user.username} has accepted your friend request`, type: 'success' } });
                ws.broadcast([user.id], { type: SAVE_DETAILS, data: { ...user.toJSON() } })
                ws.broadcast([friendId], { type: SAVE_DETAILS, data: { ...friend.toJSON() } })
            } catch (error) {
                console.log('error');
            }
        }
    }, {
        use: ['auth'],
        type: 'deleteFriend',
        action: async (ws, req, data) => {
            const { user, friendId } = data;
            try {
                let { friend } = await deleteFriend(user, friendId);
                ws.broadcast([user.id], { type: SAVE_DETAILS, data: { ...user.toJSON() } })
                ws.broadcast([friendId], { type: SAVE_DETAILS, data: { ...friend.toJSON() } })
            } catch (error) {
                console.log(error);
            }
        }
    }, {
        use: ['auth'],
        action: async (ws, req, data) => {
            try {
                const { user, friendId } = data;
                const { friend } = await deleteFriend(user, friendId);
                ws.broadcast([user.id], { type: SAVE_DETAILS, data: { ...user.toJSON() } });
                ws.broadcast([friendId], { type: SAVE_DETAILS, data: { ...friend.toJSON() } });
            } catch (error) {
                console.log(error);
            }
        },
        type: 'deleteFriend'
    }, {
        use: ['auth'],
        action: async (ws, req, data) => {
            const { user, username } = data;
            const results = await searchFriendByUsername(username, user);
            ws.sendAction({ type: USER_RESULTS, data: results });
        },
        type: 'searchFriends'
    }
]
export default controller;