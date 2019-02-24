import { Action } from 'redux';

const createSocket = () => new WebSocket('ws://localhost:8080');

export default createSocket;

export const parseAction = (data: any) => {
    const parsedData: Action = JSON.parse(data);
    if(!parsedData.type) {
        throw new Error('malformed action send by the server');
    }
    return parsedData;
}

export const send = (socket : WebSocket) => (type: string, data: any) => {
    socket.send(JSON.stringify({
        type,
        data
    }));
}