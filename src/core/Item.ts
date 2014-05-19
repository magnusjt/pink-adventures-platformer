///<reference path="_references.ts"/>
module SuperGame{
    export enum ITEM_TYPES {
        BOX,
        PICKUP
    }

    export class Item {
        body:Box2D.Dynamics.b2Body;
        sprite:PIXI.Sprite;
        item_type:ITEM_TYPES;

        width:number;
        height:number;

        mass:number = 40; // In kgs
        friction = 0.2;
        restitution = 0.01;
        world:World;

        body_type:BODY_TYPES = BODY_TYPES.DYNAMIC;
        is_sensor = false;

        constructor() {

        }

        update(millisecondspassed:number) {
            if(ENVIRONMENT == "CLIENT"){
                this.sprite.position.x = this.body.GetPosition().x * this.world.get_pixels_per_meter();
                this.sprite.position.y = this.body.GetPosition().y * this.world.get_pixels_per_meter();
                this.sprite.rotation = this.body.GetAngle();
            }
        }

        add_to_world(pos_x:number, pos_y:number, world:World, texture?:PIXI.Texture) {
            this.world = world;
            this.width = world.get_pixels_per_meter()/2;
            this.height = world.get_pixels_per_meter()/2;
            var x_start = pos_x - this.width / 2;
            var y_start = pos_y - this.height / 2;

            var width_meters = this.width / this.world.get_pixels_per_meter();
            var height_meters = this.height / this.world.get_pixels_per_meter();
            var cubic_meters = width_meters * width_meters * height_meters;
            var density = this.mass / cubic_meters;

            var body_fixture = PhysicsFactory.fixture_builder(density, this.restitution, this.friction)
                .set_category_bits(COLLISION_CATEGORIES.ITEM)
                .set_mask_bits(COLLISION_CATEGORIES.GROUND | COLLISION_CATEGORIES.PLAYER | COLLISION_CATEGORIES.ITEM)
                .set_is_sensor(this.is_sensor)
                .build();

            this.body = PhysicsFactory.create_box_body(
                this.world.physics_world,
                this.body_type,
                x_start,
                y_start,
                this.width,
                this.height,
                body_fixture,
                this.world.get_pixels_per_meter()
            );

            this.body.SetUserData(new B2UserData(B2_TYPE.ITEM, this));

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

            if(ENVIRONMENT == "CLIENT"){
                this.world.display_world.removeChild(this.sprite);
            }
        }
    }

    export class BoxItem extends Item {
        item_type:ITEM_TYPES = ITEM_TYPES.BOX;
    }

    export class PickupItem extends Item {
        item_type:ITEM_TYPES = ITEM_TYPES.PICKUP;
        body_type:BODY_TYPES = BODY_TYPES.STATIC;
        is_sensor = true;
    }
}