import { sendAction } from "../../utils";
import { USER_MESSAGE, SAVE_DETAILS, LOGIN_USER} from '../../constants';
import { login, getDetails, register } from "../../services/user";
import { Method } from "../../lib/socketApp";

const controller: Method[] =  [{
    type: 'login',
    action: async (ws, req, data) => {
            const { username, password } = data;
            const { error, token, expiresIn, id } = await login(username, password);
            if (error) {
                ws.sendAction({ type: USER_MESSAGE, data: { type: 'error', text: error } });
                return;
            }
            ws.sendAction( { type: LOGIN_USER, data: { expiresIn, token } });
            let user = await getDetails(id);
            ws.sendAction({ type: SAVE_DETAILS, data: { ...user.toJSON() }})
        }
    },{
    type: 'register',
    action: async (ws, req, data) => {
            const { username, password, confirmPassword, firstName, lastName, email } = data;
            const { error, user } = await register(username, firstName, lastName, email, password, confirmPassword);
            if (error) {
                ws.sendAction({ type: USER_MESSAGE, data: { type: 'error', text: error } });
                return;
            }
            ws.sendAction({ type: USER_MESSAGE, data: { type: 'success', text: 'Account created succesfully you can now login' } });
        }
    }
];

export default controller;