///<reference path="_references.ts"/>
module SuperGame {
    declare var io;
    export class GameClient extends NetworkConnection{
        player_number:number;
        map:Map;
        game:Game;

        constructor(game) {
            super(io.connect(''));
            this.game = game;
            this.set_listeners();
        }

        private set_listeners(){
            this.socket.on('nm', (network_msgs:NetworkMsg[]) => {
                for(var i = 0; i < network_msgs.length; i++){
                    var network_msg = network_msgs[i];
                    switch(network_msg.type){
                        case NM_TYPES.SO_CONNECTED:
                            this.connection_state = CONNECTION_STATE.CONNECTED;
                            break;
                        case NM_TYPES.SO_GAME_MANAGER_FULL:
                            console.log("Game manager was full");
                            break;
                        case NM_TYPES.SO_REQUEST_GAME_MANAGER_SUCCESS:
                            this.player_number = network_msg.content;
                            break;
                        case NM_TYPES.SO_MAPFILE:
                            this.map = new Map(new TmxMap(network_msg.content));
                            this.emit_immediately(new NetworkMsg(NM_TYPES.CO_READY_FOR_GAME_START));
                            break;
                        case NM_TYPES.SO_GAME_START:
                            this.game.setup_from_map(this.map, this.player_number);
                            this.game.start();
                            this.emit_immediately(new NetworkMsg(NM_TYPES.CO_GAME_STARTED));
                            break;
                        case NM_TYPES.SO_CORRECTIONS:
                            this.game.schedule_corrections(network_msg.content);
                    }
                }
            });
        }

        public request_game_manager(id = 0){
            this.socket.emit('request_game_manager', id);
        }
    }
}