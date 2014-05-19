///<reference path="_references.ts"/>
module SuperGame{
    export enum CORRECTION_TYPES{
        PLAYER_POSITION,
        ITEM_POSITION
    }

    export class Correction{
        type: CORRECTION_TYPES;

        constructor(type){
            this.type = type;
        }
    }

    export class CorrectionPlayerPosition extends Correction{
        type:CORRECTION_TYPES = CORRECTION_TYPES.PLAYER_POSITION;
        player_number:number;
        x:number;
        y:number;
        v_y:number;
        v_x:number;

        constructor(type, player_number, x, y, v_x, v_y){
            super(type);
            this.player_number = player_number;
            this.x = x;
            this.y = y;
            this.v_x = v_x;
            this.v_y = v_y;
        }
    }

    export class CorrectionItemPosition extends Correction{
        type:CORRECTION_TYPES = CORRECTION_TYPES.ITEM_POSITION;
        item_number:number;
        x:number;
        y:number;
        v_y:number;
        v_x:number;
        angle: number;

        constructor(type, item_number, x, y, v_x, v_y, angle){
            super(type);
            this.item_number = item_number;
            this.x = x;
            this.y = y;
            this.v_x = v_x;
            this.v_y = v_y;
            this.angle = angle;
        }
    }
}