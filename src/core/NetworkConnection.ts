///<reference path="_references.ts"/>
module SuperGame {
    export enum CONNECTION_STATE {
        CONNECTED,
        DISCONNECTED
    }

    export class NetworkConnection {
        connection_state:CONNECTION_STATE = CONNECTION_STATE.DISCONNECTED;
        socket;
        msg_queue:NetworkMsg[] = [];
        msg_interval_ms = 30;
        ping:number = 30;

        constructor(socket) {
            this.socket = socket;

            this.set_ping_listeners();
            this.update();
        }

        private set_ping_listeners(){
            this.socket.on('ping', (timestamp) => {
                this.socket.emit('ping_response', timestamp);
            });

            this.socket.on('ping_response', (timestamp) => {
                this.ping = Date.now() - timestamp;
            });
        }

        private update(){
            if(this.connection_state == CONNECTION_STATE.CONNECTED){
                if(this.msg_queue.length > 0){
                    this.socket.emit('nm', this.msg_queue);
                    this.msg_queue = [];
                }

                this.socket.emit('ping', Date.now());
            }

            setTimeout(() => {this.update();}, this.msg_interval_ms);
        }

        public emit_immediately(message:NetworkMsg) {
            if(this.connection_state == CONNECTION_STATE.CONNECTED){
                this.socket.emit('nm', [message]);
            }
        }

        public enqueue_messages(messages:NetworkMsg[]){
            this.msg_queue.push.apply(this.msg_queue, messages);
        }

        public enqueue_message(message:NetworkMsg){
            this.msg_queue.push(message);
        }

        public disconnect() {
            if(this.connection_state == CONNECTION_STATE.CONNECTED){
                this.socket.disconnect();
            }
        }
    }
}