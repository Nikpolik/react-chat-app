import SocketApp from './lib/socketApp';
import * as express from 'express';
import userControllers from './controllers/user';
import conversationController from './controllers/conversations';
import { load } from 'dotenv';
import * as mongoose from 'mongoose';
import middleware from './middleware';

load();
let MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

let db = mongoose.connection;
db.on('open', () => {
    const socket = new SocketApp({
        port: parseInt(process.env.PORT)
    });
    userControllers.forEach(({ type, action, use }) => {
        socket.addMethod(type, action, use);
    });
    conversationController.forEach(({ type, action, use }) => {
        socket.addMethod(type, action, use);
    });
    for(let name in middleware) {
        socket.addMiddleware(name, middleware[name]);
    }
}); 

process.on('uncaughtException', (error) => {
    console.log(error);
    console.log('Gracefully closing connections and exiting');
    db.close();
    process.exit(0);
});
