///<reference path="_references.ts"/>
module SuperGame {
    export enum NM_TYPES{
        CO_JUMP,
        CO_MOVE,
        CO_MOVE_STOP,
        CO_READY_FOR_GAME_START,
        CO_GAME_STARTED,
        CO_GAME_QUIT,

        SO_CONNECTED,
        SO_REQUEST_GAME_MANAGER_SUCCESS,
        SO_GAME_MANAGER_FULL,
        SO_GAME_START,
        SO_MAPFILE,
        SO_SHUTDOWN,
        SO_CORRECTIONS
    }

    export class NetworkMsg{
        type:NM_TYPES;
        content:any;

        constructor(type:NM_TYPES, content:any = {}){
            this.type = type;
            this.content = content;
        }
    }
}