import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import * as uuid from 'uuid';
import { sendAction, Action } from '../utils';
import { UserModel } from '../entity/User';
import * as express from 'express';

export interface Method {
    type: string,
    action?: (ws?: CustomSocket, req?: IncomingMessage, data?: { [key: string]: any, user?: UserModel }) => void;
    use?: string[];
}

export interface MethodRequest {
    type: string;
    data: any;
}

export type Middleware = (connection: CustomSocket, req, data, next) => void;


export interface CustomSocket extends WebSocket {
    id: string;
    user?: UserModel;
    broadcast: (users: string[], action: Action) => void;
    sendAction: (action: { type: string, data?: any }) => void;
}

export default class SocketApp {

    server: WebSocket.Server;
    methods: Method[] = [];
    middlewares: {
        [key: string]: Middleware
    } = {};
    users: {
        [id: string]: {
            socket: CustomSocket,
            lastAction: Date
        }[]
    } = {}

    constructor(options: WebSocket.ServerOptions) {
        const server = express()
            .listen(options.port, () => console.log(console.log('[READY]  Listening on ' + options.port)));
        this.server = new WebSocket.Server({
            server
        });
        this.server.on('connection', (ws: CustomSocket, request) => {
            ws.id = uuid();
            ws.broadcast = this.broadcast.bind(this);
            ws.sendAction = sendAction;
            ws.on("message", (data) => {
                this.handleData(ws, request, data.toString());
            });
        });
    }

    private handleData(connection: CustomSocket, req: IncomingMessage, data: string) {
        try {
            const parsedData: MethodRequest = JSON.parse(data);
            const { type, data: payload } = parsedData;
            let currentMiddlewareIndex = -1;
            let toCall: Method;
            for (let method of this.methods) {
                if (method.type === type) {
                    toCall = method;
                    break;
                }
            }
            // if(type !== 'PING') {
            //     console.log(`${new Date().toLocaleTimeString()} : Recieved action ${type} with data `, data);
            // }
            if (!toCall) {
                return;
            }
            const next = () => {
                if (!toCall.use) {
                    toCall.action(connection, req, payload);
                    return;
                }
                if (payload.user) {
                    this.registerSocket(connection, payload.user);
                }
                currentMiddlewareIndex++;
                if (currentMiddlewareIndex === toCall.use.length) {
                    toCall.action(connection, req, payload);
                    return;
                }
                if (!(toCall.use[currentMiddlewareIndex] in this.middlewares)) {
                    throw new Error('Tried to use a middleware that is not registered');
                }
                let currentMiddleware = this.middlewares[toCall.use[currentMiddlewareIndex]];
                if (toCall.use) {
                    if (toCall.use.indexOf(currentMiddleware.name) !== -1) {
                        currentMiddleware(connection, req, payload, next);
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            }
            next();
        } catch (error) {
            console.log(error);
        }
    }

    broadcast(users: string[], action) {
        for (let user of users) {
            if (!this.users[user]) {
                continue;
            }
            for (let { socket, lastAction } of this.users[user]) {
                if (socket.readyState === socket.CLOSED) {
                    continue;
                }
                socket.sendAction(action);
            }
        }
    }

    registerSocket(connection: CustomSocket, user: UserModel) {
        // console.log(`Trying to register socket ${connection.id} to user ${user._id}`)
        const sockets = this.users[user.id];
        if (sockets) {
            let found = false;
            for (let socketEntry of sockets) {
                if (socketEntry.socket.id === connection.id) {
                    found = true;
                    socketEntry.lastAction = new Date();
                }
            }
            if (!found) {
                sockets.push({
                    socket: connection,
                    lastAction: new Date()
                })
            }
        } else {
            this.users[user.id] = [{
                socket: connection,
                lastAction: new Date()
            }];
        }
    }

    clearUnused() {
        Object.keys(this.users).forEach((key) => {
            for (let socketEntry of this.users[key]) {

            }
        });
    }

    addMethod(type: string, action: (ws?: WebSocket, req?: IncomingMessage, data?: any) => void, use?: string[]) {
        this.methods.push({
            type,
            action,
            use
        })
    }

    addMiddleware(name: string, middleware: Middleware) {
        if (name in this.middlewares) {
            throw new Error('Already registered this middleware')
        }
        this.middlewares[name] = middleware
    }

    getServer() {
        return this.server;
    }

}
