/**
 * The different body collision types.
 * These are used in the contact listener to take the appropriate action
 */
module SuperGame{
    export enum B2_TYPE {
        GROUND,
        PLAYER,
        PLAYER_BOTTOM,
        ITEM
    }

    /**
     * Just in case we want a unique id
     * for our collisions
     */
    var unique_id = 0;

    /**
     * This class is used on collidable bodies.
     * We add this class as the UserDate, which in turn
     * can be gotten in the contactlistener.
     */
    export class B2UserData {
        // Type of collidable
        type:B2_TYPE;

        // The actual object of the collidable (ex. Player)
        instance:any;

        // A unique id for this userdata
        id:number;

        constructor(type:B2_TYPE, instance:any) {
            this.type = type;
            this.instance = instance;
            this.id = unique_id;
            unique_id++;
        }
    }
}