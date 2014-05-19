///<reference path="_references.ts"/>
module SuperGame {
    export enum PLAYER_INPUT_TYPES{
        MOVE,
        MOVE_STOP,
        JUMP
    }

    export class PlayerInput {
        type:PLAYER_INPUT_TYPES;
        player_number:number;
        content:any;

        constructor(type, player_number, content){
            this.type = type;
            this.player_number = player_number;
            this.content = content;
        }
    }

    export class GameInstance {
        world:World;
        scheduled_input:PlayerInput[];

        constructor(mapfile_contents) {
            this.scheduled_input = [];
            this.world = new World();
            var map = new Map(new TmxMap(mapfile_contents));
            map.add_to_world(this.world);
        }

        public schedule_player_input(input:PlayerInput){
            if(input.type == PLAYER_INPUT_TYPES.MOVE){
                this.world.players[input.player_number].set_move_direction(input.content.direction);
            }else if(input.type == PLAYER_INPUT_TYPES.JUMP){
                this.world.players[input.player_number].schedule_jump();
                console.log("Jump scheduled");
            }
        }

        public update(millisecondspassed:number){
            this.world.update_state(millisecondspassed);
            this.world.step(millisecondspassed);
        }
    }
}