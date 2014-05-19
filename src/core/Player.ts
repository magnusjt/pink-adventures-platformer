///<reference path="_references.ts"/>
module SuperGame {
    export enum MOVE_DIRECTION{
        LEFT,
        RIGHT,
        NONE
    }

    export class Player {
        world:World;

        body:Box2D.Dynamics.b2Body;
        bottom_body:Box2D.Dynamics.b2Body;
        sprite:PIXI.Sprite;

        mass:number = 40; // in kgs
        friction = 0;
        restitution = 0;

        width:number;
        height:number;
        bottom_sensor_width:number;
        bottom_sensor_height:number;

        velocity:number = 6;
        move_direction:MOVE_DIRECTION = MOVE_DIRECTION.NONE;

        scheduled_jumps = 0;
        jump_velocity:number = 13;
        is_touching_ground:boolean = false;
        available_jumps_left:number = 1;

        constructor() {
        }

        add_to_world(pos_x, pos_y, world:World, texture?:PIXI.Texture) {
            this.world = world;
            this.width = world.get_pixels_per_meter()/2;
            this.height = world.get_pixels_per_meter()/2;
            this.bottom_sensor_width = this.width / 2;
            this.bottom_sensor_height = this.height / 6;

            var x_start = pos_x - this.width / 2;
            var y_start = pos_y - this.height / 2;

            var width_meters = (this.width / this.world.get_pixels_per_meter());
            var cubic_meters = width_meters * width_meters * width_meters * 3.14 * 4 / 3; // sphere volume
            var density = this.mass / cubic_meters;

            /**
             * Main player body
             */
            var body_fixture = PhysicsFactory.fixture_builder(density, this.restitution, this.friction)
                .set_category_bits(COLLISION_CATEGORIES.PLAYER)
                .set_mask_bits(COLLISION_CATEGORIES.GROUND | COLLISION_CATEGORIES.ITEM)
                .build();

            this.body = PhysicsFactory.create_circle_body(
                this.world.physics_world,
                BODY_TYPES.DYNAMIC,
                x_start,
                y_start,
                this.width / 2,
                body_fixture,
                this.world.get_pixels_per_meter()
            );

            this.body.SetUserData(new B2UserData(B2_TYPE.PLAYER, this));
            this.body.SetFixedRotation(true);

            /**
             * Bottom sensor
             */
            var bottom_body_fixture = PhysicsFactory.fixture_builder(0.0001, 0, 0)
                .set_is_sensor(true)
                .build();

            bottom_body_fixture.userData = new B2UserData(B2_TYPE.PLAYER_BOTTOM, this);

            this.bottom_body = PhysicsFactory.create_box_body(
                this.world.physics_world,
                BODY_TYPES.DYNAMIC,
                x_start,
                y_start + this.height / 2 - this.bottom_sensor_height / 2,
                this.bottom_sensor_width,
                this.bottom_sensor_height,
                bottom_body_fixture,
                this.world.get_pixels_per_meter()
            );

            this.bottom_body.SetUserData(new B2UserData(B2_TYPE.PLAYER_BOTTOM, this));
            PhysicsFactory.create_weld_joint(this.body, this.bottom_body, this.world.physics_world);

            if(ENVIRONMENT == "CLIENT"){
                this.sprite = new PIXI.Sprite(texture);
                this.sprite.anchor.x = 0.5;
                this.sprite.anchor.y = 0.5;
                this.sprite.position.x = x_start;
                this.sprite.position.y = y_start;
                this.world.display_world.addChild(this.sprite);
            }
        }

        remove_from_world() {
            this.world.physics_world.DestroyBody(this.body);
            this.world.physics_world.DestroyBody(this.bottom_body);

            if(ENVIRONMENT == "CLIENT"){
                this.world.display_world.removeChild(this.sprite);
            }
        }

        update(millisecondspassed:number) {
            this.move();
            while(this.scheduled_jumps > 0){
                this.jump();
                this.scheduled_jumps--;
            }

            if(ENVIRONMENT == "CLIENT"){
                this.sprite.position.x = this.body.GetPosition().x * this.world.get_pixels_per_meter();
                this.sprite.position.y = this.body.GetPosition().y * this.world.get_pixels_per_meter();
                this.sprite.rotation = this.body.GetAngle();

                if(this.move_direction == MOVE_DIRECTION.LEFT){
                    this.sprite.scale.x = -1 * Math.abs(this.sprite.scale.x);
                }else if(this.move_direction == MOVE_DIRECTION.RIGHT){
                    this.sprite.scale.x = Math.abs(this.sprite.scale.x);
                }
            }
        }

        handle_collision_with_item(item:Item) {
            if (item.item_type == ITEM_TYPES.PICKUP) {
                this.world.destroy_item(item);
            }
        }

        set_move_direction(direction:MOVE_DIRECTION){
            this.move_direction = direction;
        }

        schedule_jump(){
            this.scheduled_jumps++;
        }

        touched_ground() {
            this.is_touching_ground = true;
            this.available_jumps_left = 2;
        }

        left_ground() {
            this.is_touching_ground = false;
        }

        private move() {
            var velocity = this.velocity;
            if(this.move_direction == MOVE_DIRECTION.LEFT){
                velocity *= -1;
            }else if(this.move_direction == MOVE_DIRECTION.NONE){
                velocity = 0;
            }

            var delta_velocity = velocity - this.body.GetLinearVelocity().x;
            var impulse = this.body.GetMass() * delta_velocity;
            this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, 0), this.body.GetWorldCenter());
        }

        private jump() {
            if (this.available_jumps_left > 0) {
                var impulse = this.body.GetMass() * this.jump_velocity * -1;

                // If the player is already moving upwards,
                // reset the upwards velocity to 0. That
                // way the double jump won't get a crazy boost
                var v = this.body.GetLinearVelocity();
                if (v.y < 0) {
                    v.y = 0;
                    this.body.SetLinearVelocity(v);
                }

                this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0, impulse), this.body.GetWorldCenter());
                this.available_jumps_left--;
            }
        }
    }
}