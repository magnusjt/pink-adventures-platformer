///<reference path="_references.ts"/>

/*
 * Note about resizing:
 * The stage starts out with the same size as the screen.
 * On resize, the canvas changes size, and along with it the stage.
 *
 * We need to react to this by changing the size of the camera, and scale everything so the
 * ratio between objects and screen size are the same (in height, not width).
 *
 *
 * Note about scaling:
 * Sometimes we wish to scale everything in the game.
 * We therefore have a separate displayobjectcontainer
 * that we put everything in, and scale that. This way,
 * all sprites on the stage are scaled.
 *
 * In addition to this, we need to scale the camera.
 * The camera needs to become larger if the sprites on
 * the screen are smaller. Camera scaling does not
 * affect the sizes on the screen, but it affects where the
 * camera is placed.
 *
 * Third, we need to scale the debug canvas. This is
 * more or less the same procedure as for the displayobjectcontainer.
 *
 */

module SuperGame {
    export class Game {
        private previous_timestamp:number;

        private scene_width;
        private scene_height;
        private renderer:PIXI.IPixiRenderer;
        private stage:PIXI.Stage;
        private display_object_container:PIXI.DisplayObjectContainer;
        game_client:GameClient;
        camera:Camera;
        world:World;
        player:Player;
        keyboard:Keyboard;

        private scheduled_input: any[];
        private scheduled_corrections: Correction[];

        constructor(scene_width, scene_height, stage, renderer, keyboard) {
            this.stage = stage;
            this.renderer = renderer;
            this.keyboard = keyboard;
            this.previous_timestamp = Date.now();
            this.scene_width = scene_width;
            this.scene_height = scene_height;

            this.scheduled_corrections = [];
            this.scheduled_input = [];

            this.world = new World();
            this.camera = new Camera(scene_width, scene_height);

            this.display_object_container = new PIXI.DisplayObjectContainer();
            this.display_object_container.addChild(this.world.display_world);
            this.stage.addChild(this.display_object_container);
            this.set_keyboard_listeners();
        }

        set_keyboard_listeners(){
            this.keyboard.on_keydown(KEY_CODES.LEFT, () => {
                this.player.set_move_direction(MOVE_DIRECTION.LEFT);
                this.game_client.enqueue_message(new NetworkMsg(NM_TYPES.CO_MOVE, {direction: MOVE_DIRECTION.LEFT}));
            });
            this.keyboard.on_keyup(KEY_CODES.LEFT, () => {
                if(this.player.move_direction == MOVE_DIRECTION.LEFT){
                    this.player.set_move_direction(MOVE_DIRECTION.NONE);
                    this.game_client.enqueue_message(new NetworkMsg(NM_TYPES.CO_MOVE, {direction: MOVE_DIRECTION.NONE}));
                }
            });
            this.keyboard.on_keydown(KEY_CODES.RIGHT, () => {
                this.player.set_move_direction(MOVE_DIRECTION.RIGHT);
                this.game_client.enqueue_message(new NetworkMsg(NM_TYPES.CO_MOVE, {direction: MOVE_DIRECTION.RIGHT}));
            });
            this.keyboard.on_keyup(KEY_CODES.RIGHT, () => {
                if(this.player.move_direction == MOVE_DIRECTION.RIGHT){
                    this.player.set_move_direction(MOVE_DIRECTION.NONE);
                    this.game_client.enqueue_message(new NetworkMsg(NM_TYPES.CO_MOVE, {direction: MOVE_DIRECTION.NONE}));
                }
            });
            this.keyboard.on_keydown(KEY_CODES.SPACE, () => {
                this.player.schedule_jump();
                this.game_client.enqueue_message(new NetworkMsg(NM_TYPES.CO_JUMP));
            });
        }

        set_game_client(game_client:GameClient){
            this.game_client = game_client;
        }

        schedule_corrections(corrections:Correction[]){
            this.scheduled_corrections.push.apply(this.scheduled_corrections, corrections);
        }

        setup_from_map(map:Map, player_number) {
            this.reset();

            map.add_to_world(this.world);
            this.player = this.world.players[player_number];
            this.resize(this.scene_width, this.scene_height);
        }

        reset() {
            this.world.reset();
            this.camera.reset();
        }

        resize(scene_width, scene_height) {
            this.camera.resize(scene_width, scene_height, this.world.get_pixels_per_meter());
            var scale = this.camera.get_world_scale();
            this.display_object_container.scale.x = scale;
            this.display_object_container.scale.y = scale;
        }

        apply_corrections(){
            for(var i = 0; i < this.scheduled_corrections.length; i++){
                var correction = this.scheduled_corrections[i];

                if(correction.type == CORRECTION_TYPES.PLAYER_POSITION){
                    var player_pos_correction = <CorrectionPlayerPosition>correction;
                    this.world.players[player_pos_correction.player_number].body.SetPosition(new Box2D.Common.Math.b2Vec2(player_pos_correction.x, player_pos_correction.y));
                    this.world.players[player_pos_correction.player_number].body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(player_pos_correction.v_x, player_pos_correction.v_y));
                    if(player_pos_correction.v_x > 0.1){
                        //this.world.players[player_pos_correction.player_number].face_direction(MOVE_DIRECTION.RIGHT);
                    }else if(player_pos_correction.v_x < 0.1){
                        //this.world.players[player_pos_correction.player_number].face_direction(MOVE_DIRECTION.LEFT);
                    }
                }else if(correction.type = CORRECTION_TYPES.ITEM_POSITION){
                    var item_pos_correction = <CorrectionItemPosition>correction;
                    this.world.items[item_pos_correction.item_number].body.SetPosition(new Box2D.Common.Math.b2Vec2(item_pos_correction.x, item_pos_correction.y));
                    this.world.items[item_pos_correction.item_number].body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(item_pos_correction.v_x, item_pos_correction.v_y));
                    this.world.items[item_pos_correction.item_number].body.SetAngle(item_pos_correction.angle);
                }
            }

            this.scheduled_corrections = [];
        }

        /**
         * Update game state
         */
        update_state(millisecondspassed:number) {
            this.apply_corrections();
            this.world.update_state(millisecondspassed);

            this.camera.set_position(this.player.body.GetPosition().x*this.world.get_pixels_per_meter(), this.player.body.GetPosition().y*this.world.get_pixels_per_meter());
            var world_shift = this.camera.get_world_shift(this.world.get_width(), this.world.get_height());
            this.world.set_shift(world_shift.x, world_shift.y);

            this.world.step(millisecondspassed);
        }

        start(){
            requestAnimationFrame((timestamp:number) => {this.update(timestamp);});
        }

        /**
         * The main game loop. Renders the current stage, and requests the next frame.
         */
        update(timestamp:number) {
            requestAnimationFrame((timestamp:number) => {this.update(timestamp);});
            var millisecondspassed = timestamp - this.previous_timestamp;
            this.previous_timestamp = timestamp;

            this.update_state(millisecondspassed);
            this.renderer.render(this.stage);
        }
    }
}