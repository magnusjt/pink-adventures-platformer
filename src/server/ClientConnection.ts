///<reference path="_references.ts"/>
module SuperGame {
    export enum PLAYER_STATE {
        IDLE,
        READY_FOR_GAME_START,
        GAME_STARTED
    }

    export class ClientConnection extends NetworkConnection{
        player_state:PLAYER_STATE = PLAYER_STATE.IDLE;
        game_manager:GameManager;
        player_number:number;

        constructor(game_manager, player_number, socket) {
            super(socket);
            this.game_manager = game_manager;
            this.player_number = player_number;
            this.connection_state = CONNECTION_STATE.CONNECTED;

            this.set_listeners();
        }

        private set_listeners() {
            this.socket.on('nm', (network_msgs:NetworkMsg[]) => {
                for(var i = 0; i < network_msgs.length; i++){
                    var network_msg = network_msgs[i];
                    switch(network_msg.type){
                        case NM_TYPES.CO_MOVE:
                            this.game_manager.handle_player_input(new PlayerInput(PLAYER_INPUT_TYPES.MOVE, this.player_number, network_msg.content));
                            break;
                        case NM_TYPES.CO_MOVE_STOP:
                            this.game_manager.handle_player_input(new PlayerInput(PLAYER_INPUT_TYPES.MOVE_STOP, this.player_number, {}));
                            break;
                        case NM_TYPES.CO_JUMP:
                            this.game_manager.handle_player_input(new PlayerInput(PLAYER_INPUT_TYPES.JUMP, this.player_number, {}));
                            break;
                        case NM_TYPES.CO_READY_FOR_GAME_START:
                            console.log("Player ready for game start " + this.player_number);
                            this.player_state = PLAYER_STATE.READY_FOR_GAME_START;
                            break;
                        case NM_TYPES.CO_GAME_STARTED:
                            console.log("Player started game " + this.player_number);
                            this.player_state = PLAYER_STATE.GAME_STARTED;
                            break;
                        case NM_TYPES.CO_GAME_QUIT:
                            console.log("Player quit game " + this.player_number);
                            this.player_state = PLAYER_STATE.IDLE;
                            break;
                   }
                }
            });

            this.socket.on('disconnect', () => {
                console.log("Player disconnected " + this.player_number);
                this.connection_state = CONNECTION_STATE.DISCONNECTED;
                this.game_manager.handle_player_disconnect(this.player_number);
            });
        }
    }
}