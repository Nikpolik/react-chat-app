import { Store } from 'redux';

/* Socket wrapper that gracefully handles disconnects and passes messages to redux as actions. */
export default class SocketRouter {
    ready: boolean;
    queue: any[];
    store: Store;
    reconnects: number;
    socket_url: string;
    notifier: (message?: string, pending?: boolean) => any;
    loadStart: () => any;
    loadFinish: () => any;
    socket: WebSocket
    disconnected_timeout: NodeJS.Timeout;
    keep_alive_timeout: NodeJS.Timeout;

    constructor(store: Store, socket_url: string, notifier?: () => any, loadStart?: () => any, loadFinish?: () => any) {
        // takes a redux store, optional functions to display notifications & loading bars, and an optional socket_url
        this.ready = false
        this.queue = []
        this.store = store || null
        this.reconnects = -1
        this.socket_url = socket_url || this._detectPath(window.location)
        this.notifier = notifier || ((message, pending) => console.log(message, pending && 'Pending...'))
        this.loadStart = loadStart || (() => console.log('Loading...'))
        this.loadFinish = loadFinish || (() => console.log('Finished loading.'))
        this._setupSocket()
    }

    dispatch(message: any) {
        if (this.ready && this.socket.readyState === this.socket.OPEN) {
            if(message.type !== 'PING') {
                console.log('SENT', message)
            }
            this.socket.send(JSON.stringify(message))
            return true
        }
        console.log('QUEUED', message)
        this.queue.push(message)
        return false
    }

    send_action = (type: string, data: any) => {
        this.loadStart()
        this.notifier(type + '...', true)
        this.dispatch({ 
            data,
            type,
            TIMESTAMP: ((new Date).getTime())
        })
    }

    _keepAlive = () => {
        //keeps the connection alive by pinging the server
        this.send_action('PING', { time: (new Date()).getTime() });
        this.keep_alive_timeout = setTimeout(this._keepAlive, 1000 * 30);
    }

    _setupSocket() {
        this.socket = new WebSocket(this.socket_url)
        this.socket.onmessage = this._onmessage.bind(this)
        this.socket.onopen = this._onopen.bind(this)
        this.socket.onclose = this._onclose.bind(this)
    }

    _flush() {
        if (this.ready)
            this.queue = this.queue.filter(action => this.dispatch(action))
        console.log(this.queue);
        return this.queue
    }

    _onmessage(message: any) {
        const action = JSON.parse(message.data)
        console.log('RECEIVED', action);

        // if redux store is present
        if (this.store) {
            // if response has any errors, display them
            // can be a plain str or a dict
            // errors = ['text1', {text: 'text2'}, {style: 'success', text: 'text3'}]
            (action.errors || []).map((error: any) =>
                this.store.dispatch({
                    type: 'ALERT',
                    alert: {
                        style: error.style || 'danger',
                        text: error.text || error,
                    }
                }))
            
            if (action.type == 'PING') {
                const delay = ((new Date).getTime() - action.time) / 1000
                const comment = this._humanizeSpeed(delay)
                this.notifier(
                    `Connection Speed: ${delay}s (${comment}).` + (this.reconnects ?
                        ` ${this.reconnects} reconnects.` : ''), false)
                setTimeout(this.notifier.bind(this), 1000 * 30)
            } else if (action.type) {
                this.store.dispatch(action)
                this.loadFinish()
                this.notifier()
            } else if (Array.isArray(action)) {
                //server has send multiple actions we need to send them
                action.forEach((singleAction) => {
                    this.store.dispatch(singleAction)
                });
            }
        }
    }

    _onopen() {
        if (this.disconnected_timeout) clearTimeout(this.disconnected_timeout)
        this.ready = true
        this.reconnects++
        this.notifier('Checking server sync...', true)
        this._keepAlive();
        this._flush()
    }

    _onclose() {   
        this._setupSocket()
        if (this.disconnected_timeout)
            clearTimeout(this.disconnected_timeout)
        this.disconnected_timeout = setTimeout(this.notifier.bind(this,
            'Websocket disconnected, attempting to reconnect...', true), 4000)
    }

    _detectPath(location: Location) {
        var path = location.pathname
        path = path.endsWith('/') ? path.substring(0, path.length - 1) : path
        return 'ws://' + location.hostname + path + '/websocket'
    }

    _humanizeSpeed(seconds: number) {
        if (seconds < 0.1) return 'instantaneous'
        if (seconds < 0.2) return 'wicked fast'
        if (seconds < 0.5) return 'fast'
        if (seconds < 0.8) return 'ok'
        if (seconds < 1.2) return 'laggy'
        if (seconds > 1.2) return 'very slow'
        return 'not defined speed'
    }
}