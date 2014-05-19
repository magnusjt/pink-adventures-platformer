///<reference path="_references.ts"/>
module SuperGame {
    export enum BODY_TYPES {
        DYNAMIC = Box2D.Dynamics.b2Body.b2_dynamicBody,
        STATIC = Box2D.Dynamics.b2Body.b2_staticBody,
        KINEMATIC = Box2D.Dynamics.b2Body.b2_kinematicBody,
    }

    export enum COLLISION_CATEGORIES {
        PLAYER = 0x0001,
        GROUND = 0x0002,
        ITEM = 0x0004
    }

    export class FixtureBuilder {
        /**
         * Density in kg per cubic meter
         */
        private density:number = 0.0001;

        /**
         * Bouncyness
         *
         * 0 - no bounce
         * 1 - no energy lost when bouncing
         */
        private restitution:number = 0;

        /**
         * Friction between 0 and 1
         * 0 - no friction
         * 1 - max friction
         */
        private friction:number = 0;

        /**
         * Sensors can detect collisions, but don't actually collide
         */
        private is_sensor:boolean = false;

        /**
         * Category of the fixture
         */
        private category_bits:number = 0x0001;

        /**
         * Which categories the fixture can collide with
         */
        private mask_bits:number = 0xFFFF;

        /**
         * if either fixture has a groupIndex of zero, use the category/mask rules as above
         * if both groupIndex values are non-zero but different, use the category/mask rules as above
         * if both groupIndex values are the same and positive, collide
         * if both groupIndex values are the same and negative, don't collide
         */
        private group_index:number = 0;

        constructor(density:number, restitution:number, friction:number){
            this.density = density;
            this.restitution = restitution;
            this.friction = friction;
        }

        set_is_sensor(is_sensor:boolean):FixtureBuilder {
            this.is_sensor = is_sensor;
            return this;
        }

        set_category_bits(category_bits:number):FixtureBuilder {
            this.category_bits = category_bits;
            return this;
        }

        set_mask_bits(mask_bits:number):FixtureBuilder {
            this.mask_bits = mask_bits;
            return this;
        }

        set_group_index(group_index:number):FixtureBuilder {
            this.group_index = group_index;
            return this;
        }

        build():Box2D.Dynamics.b2FixtureDef {
            var fixture = new Box2D.Dynamics.b2FixtureDef();
            fixture.density = this.density;
            fixture.restitution = this.restitution;
            fixture.friction = this.friction;
            fixture.isSensor = this.is_sensor;

            var filter_data = new Box2D.Dynamics.b2FilterData();
            filter_data.categoryBits = this.category_bits;
            filter_data.maskBits = this.mask_bits;
            filter_data.groupIndex = this.group_index;

            fixture.filter = filter_data;

            return fixture;
        }
    }

    export class PhysicsFactory {
        public static fixture_builder(density:number, restitution:number, friction:number){
            return new FixtureBuilder(density, restitution, friction);
        }

        public static create_box_body(world:Box2D.Dynamics.b2World, body_type:number, x_pos:number, y_pos:number, width:number, height:number, fixture_def:Box2D.Dynamics.b2FixtureDef, pixels_per_meter:number = 100):Box2D.Dynamics.b2Body {

            var polygon_shape = new Box2D.Collision.Shapes.b2PolygonShape();
            polygon_shape.SetAsBox(width / 2 / pixels_per_meter, height / 2 / pixels_per_meter); // Divide by two because box2d width/height are distance from center
            fixture_def.shape = polygon_shape;

            var body_def = new Box2D.Dynamics.b2BodyDef();
            body_def.type = body_type;
            body_def.position.Set(x_pos / pixels_per_meter, y_pos / pixels_per_meter);

            var body = world.CreateBody(body_def);
            body.CreateFixture(fixture_def);

            return body;
        }

        public static create_polygon_body(world:Box2D.Dynamics.b2World, body_type:number, x_pos:number, y_pos:number, vertices:Box2D.Common.Math.b2Vec2[], fixture_def:Box2D.Dynamics.b2FixtureDef, pixels_per_meter:number = 100):Box2D.Dynamics.b2Body {

            var polygon_shape = new Box2D.Collision.Shapes.b2PolygonShape();
            for (var i = 0; i < vertices.length; i++) {
                vertices[i].x /= pixels_per_meter;
                vertices[i].y /= pixels_per_meter;
            }
            polygon_shape.SetAsArray(vertices);
            fixture_def.shape = polygon_shape;

            var body_def = new Box2D.Dynamics.b2BodyDef();
            body_def.type = body_type;
            body_def.position.Set(x_pos / pixels_per_meter, y_pos / pixels_per_meter);

            var body = world.CreateBody(body_def);
            body.CreateFixture(fixture_def);

            return body;
        }

        public static create_circle_body(world:Box2D.Dynamics.b2World, body_type:number, x_pos:number, y_pos:number, radius:number, fixture_def:Box2D.Dynamics.b2FixtureDef, pixels_per_meter:number = 100):Box2D.Dynamics.b2Body {

            fixture_def.shape = new Box2D.Collision.Shapes.b2CircleShape(radius / pixels_per_meter);

            var body_def = new Box2D.Dynamics.b2BodyDef();
            body_def.type = body_type;
            body_def.position.Set(x_pos / pixels_per_meter, y_pos / pixels_per_meter);

            var body = world.CreateBody(body_def);
            body.CreateFixture(fixture_def);

            return body;
        }

        public static create_weld_joint(body1:Box2D.Dynamics.b2Body, body2:Box2D.Dynamics.b2Body, world:Box2D.Dynamics.b2World) {

            var weld_joint_bottom_def = new Box2D.Dynamics.Joints.b2WeldJointDef();
            weld_joint_bottom_def.Initialize(body1, body2, body1.GetWorldCenter());
            return world.CreateJoint(weld_joint_bottom_def);
        }
    }
}