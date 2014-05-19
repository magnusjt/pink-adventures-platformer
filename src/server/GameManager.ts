///<reference path="_references.ts"/>
module SuperGame {
    export enum GAME_MANAGER_STATE{
        INITIAL,
        PAUSED,
        RUNNING,
        FINISHED,
        DESTROYED
    }

    export class GameManager{
        state:GAME_MANAGER_STATE = GAME_MANAGER_STATE.INITIAL;
        id:number;
        game_instance:GameInstance = null;
        mapfile_contents:any = null;
        client_connections_by_player_number:ClientConnection[] = [];
        next_player_number = 0;
        max_number_of_players = 2;
        game_update_interval_ms = 1000/60;
        previous_update_time;
        correction_wait_time = 0;

        constructor(id){
            this.id = id;
        }

        destroy(){
            console.log("Game manager destroy");
            this.state = GAME_MANAGER_STATE.DESTROYED;
            for(var j in this.client_connections_by_player_number){
                if(this.client_connections_by_player_number.hasOwnProperty(j)){
                    this.client_connections_by_player_number[j].disconnect();
                }
            }

            this.client_connections_by_player_number = [];
            this.game_instance = null;
        }

        add_connection(socket){
            if(this.next_player_number > this.max_number_of_players){
                console.log("Game manager full");
                socket.emit('nm', [new NetworkMsg(NM_TYPES.SO_GAME_MANAGER_FULL)]);
            }else{
                console.log("Adding client connection to game manager");
                var connection = new ClientConnection(this, this.next_player_number, socket);
                connection.emit_immediately(new NetworkMsg(NM_TYPES.SO_REQUEST_GAME_MANAGER_SUCCESS, this.next_player_number));
                this.client_connections_by_player_number[this.next_player_number] = connection;
                this.next_player_number++;

                if(this.next_player_number == this.max_number_of_players){
                    this.start_new_game();
                }
            }
        }

        enqueue_on_all_connections(message:NetworkMsg){
            for(var j in this.client_connections_by_player_number){
                if(this.client_connections_by_player_number.hasOwnProperty(j)){
                    this.client_connections_by_player_number[j].enqueue_message(message);
                }
            }
        }

        enqueue_on_all_connections_except(message:NetworkMsg, player_number:number){
            for(var j in this.client_connections_by_player_number){
                if(this.client_connections_by_player_number.hasOwnProperty(j) && j != player_number){
                    this.client_connections_by_player_number[j].enqueue_message(message);
                }
            }
        }

        handle_player_input(input:PlayerInput){
            if(this.game_instance !== null){
                this.game_instance.schedule_player_input(input);
            }
        }

        handle_player_disconnect(player_number:number){
            this.state = GAME_MANAGER_STATE.FINISHED;
        }

        send_corrections(){
            var corrections = [];
            for (var i = 0; i < this.game_instance.world.players.length; i++) {
                var player_body = this.game_instance.world.players[i].body;
                corrections.push(new CorrectionPlayerPosition(CORRECTION_TYPES.PLAYER_POSITION,
                    i,
                    player_body.GetPosition().x,
                    player_body.GetPosition().y,
                    player_body.GetLinearVelocity().x,
                    player_body.GetLinearVelocity().y));
            }

            for (var i = 0; i < this.game_instance.world.items.length; i++) {
                var item_body = this.game_instance.world.items[i].body;
                corrections.push(new CorrectionItemPosition(CORRECTION_TYPES.ITEM_POSITION,
                    i,
                    item_body.GetPosition().x,
                    item_body.GetPosition().y,
                    item_body.GetLinearVelocity().x,
                    item_body.GetLinearVelocity().y,
                    item_body.GetAngle()));
            }

            this.enqueue_on_all_connections(new NetworkMsg(NM_TYPES.SO_CORRECTIONS, corrections));
        }

        start_new_game(){
            console.log("Starting new game");
            this.mapfile_contents = require("../../assets/maps/level1.json");
            this.game_instance = new GameInstance(this.mapfile_contents);
            this.enqueue_on_all_connections(new NetworkMsg(NM_TYPES.SO_MAPFILE, this.mapfile_contents));

            this.previous_update_time = Date.now();
            this.state = GAME_MANAGER_STATE.RUNNING;
            this.wait_players_ready(0);
        }

        wait_players_ready(waited:number){
            console.log("Waiting for players");
            if(waited > 10000){
                console.log("Waiting for players timed out.");
                // timeout
                return;
            }

            for(var i in this.client_connections_by_player_number){
                if(this.client_connections_by_player_number.hasOwnProperty(i)){
                    if(this.client_connections_by_player_number[i].player_state != PLAYER_STATE.READY_FOR_GAME_START){
                        setTimeout(() => {this.wait_players_ready(waited + 100);}, 100);
                        return;
                    }
                }
            }

            this.enqueue_on_all_connections(new NetworkMsg(NM_TYPES.SO_GAME_START));
            this.update();
        }

        update(){
            var now = Date.now();

            if (this.previous_update_time + this.game_update_interval_ms <= now) {
                var millisecondspassed = (now - this.previous_update_time);
                this.previous_update_time = now;
                this.correction_wait_time += millisecondspassed;

                if(this.state == GAME_MANAGER_STATE.RUNNING){
                    this.game_instance.update(millisecondspassed);
                    this.send_corrections();
                }
            }

            if (Date.now() - this.previous_update_time < 5) {
                setTimeout(() => {this.update();}, 5);
            } else {
                setImmediate(() => {this.update();});
            }
        }
    }
}