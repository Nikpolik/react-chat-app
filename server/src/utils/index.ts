import { CustomSocket } from "../lib/socketApp";

export function sendAction(this: CustomSocket, action: Action) {
    this.send(JSON.stringify(action));
}

export interface Action {
    type: string,
    data?: any,
}