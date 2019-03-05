var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SuperGame;
(function (SuperGame) {
    SuperGame.DEBUG = false;
    SuperGame.URL_MAPS = "/assets/maps/";
    SuperGame.ENVIRONMENT = "CLIENT";
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var NM_TYPES;
    (function (NM_TYPES) {
        NM_TYPES[NM_TYPES["CO_JUMP"] = 0] = "CO_JUMP";
        NM_TYPES[NM_TYPES["CO_MOVE"] = 1] = "CO_MOVE";
        NM_TYPES[NM_TYPES["CO_MOVE_STOP"] = 2] = "CO_MOVE_STOP";
        NM_TYPES[NM_TYPES["CO_READY_FOR_GAME_START"] = 3] = "CO_READY_FOR_GAME_START";
        NM_TYPES[NM_TYPES["CO_GAME_STARTED"] = 4] = "CO_GAME_STARTED";
        NM_TYPES[NM_TYPES["CO_GAME_QUIT"] = 5] = "CO_GAME_QUIT";
        NM_TYPES[NM_TYPES["SO_CONNECTED"] = 6] = "SO_CONNECTED";
        NM_TYPES[NM_TYPES["SO_REQUEST_GAME_MANAGER_SUCCESS"] = 7] = "SO_REQUEST_GAME_MANAGER_SUCCESS";
        NM_TYPES[NM_TYPES["SO_GAME_MANAGER_FULL"] = 8] = "SO_GAME_MANAGER_FULL";
        NM_TYPES[NM_TYPES["SO_GAME_START"] = 9] = "SO_GAME_START";
        NM_TYPES[NM_TYPES["SO_MAPFILE"] = 10] = "SO_MAPFILE";
        NM_TYPES[NM_TYPES["SO_SHUTDOWN"] = 11] = "SO_SHUTDOWN";
        NM_TYPES[NM_TYPES["SO_CORRECTIONS"] = 12] = "SO_CORRECTIONS";
    })(NM_TYPES = SuperGame.NM_TYPES || (SuperGame.NM_TYPES = {}));
    var NetworkMsg = (function () {
        function NetworkMsg(type, content) {
            if (content === void 0) { content = {}; }
            this.type = type;
            this.content = content;
        }
        return NetworkMsg;
    }());
    SuperGame.NetworkMsg = NetworkMsg;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var CONNECTION_STATE;
    (function (CONNECTION_STATE) {
        CONNECTION_STATE[CONNECTION_STATE["CONNECTED"] = 0] = "CONNECTED";
        CONNECTION_STATE[CONNECTION_STATE["DISCONNECTED"] = 1] = "DISCONNECTED";
    })(CONNECTION_STATE = SuperGame.CONNECTION_STATE || (SuperGame.CONNECTION_STATE = {}));
    var NetworkConnection = (function () {
        function NetworkConnection(socket) {
            this.connection_state = CONNECTION_STATE.DISCONNECTED;
            this.msg_queue = [];
            this.msg_interval_ms = 30;
            this.ping = 30;
            this.socket = socket;
            this.set_ping_listeners();
            this.update();
        }
        NetworkConnection.prototype.set_ping_listeners = function () {
            var _this = this;
            this.socket.on('ping', function (timestamp) {
                _this.socket.emit('ping_response', timestamp);
            });
            this.socket.on('ping_response', function (timestamp) {
                _this.ping = Date.now() - timestamp;
            });
        };
        NetworkConnection.prototype.update = function () {
            var _this = this;
            if (this.connection_state == CONNECTION_STATE.CONNECTED) {
                if (this.msg_queue.length > 0) {
                    this.socket.emit('nm', this.msg_queue);
                    this.msg_queue = [];
                }
                this.socket.emit('ping', Date.now());
            }
            setTimeout(function () { _this.update(); }, this.msg_interval_ms);
        };
        NetworkConnection.prototype.emit_immediately = function (message) {
            if (this.connection_state == CONNECTION_STATE.CONNECTED) {
                this.socket.emit('nm', [message]);
            }
        };
        NetworkConnection.prototype.enqueue_messages = function (messages) {
            this.msg_queue.push.apply(this.msg_queue, messages);
        };
        NetworkConnection.prototype.enqueue_message = function (message) {
            this.msg_queue.push(message);
        };
        NetworkConnection.prototype.disconnect = function () {
            if (this.connection_state == CONNECTION_STATE.CONNECTED) {
                this.socket.disconnect();
            }
        };
        return NetworkConnection;
    }());
    SuperGame.NetworkConnection = NetworkConnection;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var B2_TYPE;
    (function (B2_TYPE) {
        B2_TYPE[B2_TYPE["GROUND"] = 0] = "GROUND";
        B2_TYPE[B2_TYPE["PLAYER"] = 1] = "PLAYER";
        B2_TYPE[B2_TYPE["PLAYER_BOTTOM"] = 2] = "PLAYER_BOTTOM";
        B2_TYPE[B2_TYPE["ITEM"] = 3] = "ITEM";
    })(B2_TYPE = SuperGame.B2_TYPE || (SuperGame.B2_TYPE = {}));
    var unique_id = 0;
    var B2UserData = (function () {
        function B2UserData(type, instance) {
            this.type = type;
            this.instance = instance;
            this.id = unique_id;
            unique_id++;
        }
        return B2UserData;
    }());
    SuperGame.B2UserData = B2UserData;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var BODY_TYPES;
    (function (BODY_TYPES) {
        BODY_TYPES[BODY_TYPES["DYNAMIC"] = Box2D.Dynamics.b2Body.b2_dynamicBody] = "DYNAMIC";
        BODY_TYPES[BODY_TYPES["STATIC"] = Box2D.Dynamics.b2Body.b2_staticBody] = "STATIC";
        BODY_TYPES[BODY_TYPES["KINEMATIC"] = Box2D.Dynamics.b2Body.b2_kinematicBody] = "KINEMATIC";
    })(BODY_TYPES = SuperGame.BODY_TYPES || (SuperGame.BODY_TYPES = {}));
    var COLLISION_CATEGORIES;
    (function (COLLISION_CATEGORIES) {
        COLLISION_CATEGORIES[COLLISION_CATEGORIES["PLAYER"] = 1] = "PLAYER";
        COLLISION_CATEGORIES[COLLISION_CATEGORIES["GROUND"] = 2] = "GROUND";
        COLLISION_CATEGORIES[COLLISION_CATEGORIES["ITEM"] = 4] = "ITEM";
    })(COLLISION_CATEGORIES = SuperGame.COLLISION_CATEGORIES || (SuperGame.COLLISION_CATEGORIES = {}));
    var FixtureBuilder = (function () {
        function FixtureBuilder(density, restitution, friction) {
            this.density = 0.0001;
            this.restitution = 0;
            this.friction = 0;
            this.is_sensor = false;
            this.category_bits = 0x0001;
            this.mask_bits = 0xFFFF;
            this.group_index = 0;
            this.density = density;
            this.restitution = restitution;
            this.friction = friction;
        }
        FixtureBuilder.prototype.set_is_sensor = function (is_sensor) {
            this.is_sensor = is_sensor;
            return this;
        };
        FixtureBuilder.prototype.set_category_bits = function (category_bits) {
            this.category_bits = category_bits;
            return this;
        };
        FixtureBuilder.prototype.set_mask_bits = function (mask_bits) {
            this.mask_bits = mask_bits;
            return this;
        };
        FixtureBuilder.prototype.set_group_index = function (group_index) {
            this.group_index = group_index;
            return this;
        };
        FixtureBuilder.prototype.build = function () {
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
        };
        return FixtureBuilder;
    }());
    SuperGame.FixtureBuilder = FixtureBuilder;
    var PhysicsFactory = (function () {
        function PhysicsFactory() {
        }
        PhysicsFactory.fixture_builder = function (density, restitution, friction) {
            return new FixtureBuilder(density, restitution, friction);
        };
        PhysicsFactory.create_box_body = function (world, body_type, x_pos, y_pos, width, height, fixture_def, pixels_per_meter) {
            if (pixels_per_meter === void 0) { pixels_per_meter = 100; }
            var polygon_shape = new Box2D.Collision.Shapes.b2PolygonShape();
            polygon_shape.SetAsBox(width / 2 / pixels_per_meter, height / 2 / pixels_per_meter);
            fixture_def.shape = polygon_shape;
            var body_def = new Box2D.Dynamics.b2BodyDef();
            body_def.type = body_type;
            body_def.position.Set(x_pos / pixels_per_meter, y_pos / pixels_per_meter);
            var body = world.CreateBody(body_def);
            body.CreateFixture(fixture_def);
            return body;
        };
        PhysicsFactory.create_polygon_body = function (world, body_type, x_pos, y_pos, vertices, fixture_def, pixels_per_meter) {
            if (pixels_per_meter === void 0) { pixels_per_meter = 100; }
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
        };
        PhysicsFactory.create_circle_body = function (world, body_type, x_pos, y_pos, radius, fixture_def, pixels_per_meter) {
            if (pixels_per_meter === void 0) { pixels_per_meter = 100; }
            fixture_def.shape = new Box2D.Collision.Shapes.b2CircleShape(radius / pixels_per_meter);
            var body_def = new Box2D.Dynamics.b2BodyDef();
            body_def.type = body_type;
            body_def.position.Set(x_pos / pixels_per_meter, y_pos / pixels_per_meter);
            var body = world.CreateBody(body_def);
            body.CreateFixture(fixture_def);
            return body;
        };
        PhysicsFactory.create_weld_joint = function (body1, body2, world) {
            var weld_joint_bottom_def = new Box2D.Dynamics.Joints.b2WeldJointDef();
            weld_joint_bottom_def.Initialize(body1, body2, body1.GetWorldCenter());
            return world.CreateJoint(weld_joint_bottom_def);
        };
        return PhysicsFactory;
    }());
    SuperGame.PhysicsFactory = PhysicsFactory;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var ContactListener = (function (_super) {
        __extends(ContactListener, _super);
        function ContactListener() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ContactListener.prototype.BeginContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var udA = (fixtureA.GetBody().GetUserData());
            var udB = (fixtureB.GetBody().GetUserData());
            if (udA.type == SuperGame.B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomBeginContact(udA, udB);
            }
            else if (udB.type == SuperGame.B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomBeginContact(udB, udA);
            }
            else if (udA.type == SuperGame.B2_TYPE.PLAYER && udB.type == SuperGame.B2_TYPE.ITEM) {
                this.HandlePlayerItemBeginContact(udA, udB);
            }
            else if (udA.type == SuperGame.B2_TYPE.ITEM && udB.type == SuperGame.B2_TYPE.PLAYER) {
                this.HandlePlayerItemBeginContact(udB, udA);
            }
        };
        ContactListener.prototype.HandlePlayerBottomBeginContact = function (player_user_data, other_user_data) {
            if (other_user_data.type == SuperGame.B2_TYPE.GROUND || other_user_data.type == SuperGame.B2_TYPE.ITEM) {
                player_user_data.instance.touched_ground();
            }
        };
        ContactListener.prototype.HandlePlayerItemBeginContact = function (player_user_data, item_user_data) {
            player_user_data.instance.handle_collision_with_item(item_user_data.instance);
        };
        ContactListener.prototype.EndContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var udA = (fixtureA.GetBody().GetUserData());
            var udB = (fixtureB.GetBody().GetUserData());
            if (udA.type == SuperGame.B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomEndContact(udA, udB);
            }
            else if (udB.type == SuperGame.B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomEndContact(udB, udA);
            }
        };
        ContactListener.prototype.HandlePlayerBottomEndContact = function (player_user_data, other_user_data) {
            if (other_user_data.type == SuperGame.B2_TYPE.GROUND || other_user_data.type == SuperGame.B2_TYPE.ITEM) {
                player_user_data.instance.left_ground();
            }
        };
        ContactListener.prototype.PostSolve = function (contact, impulse) {
        };
        ContactListener.prototype.PreSolve = function (contact, oldManifold) {
        };
        return ContactListener;
    }(Box2D.Dynamics.b2ContactListener));
    SuperGame.ContactListener = ContactListener;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var World = (function () {
        function World() {
            this.pixels_per_meter = 70;
            this.width = 0;
            this.height = 0;
            this.gravity_y = 30;
            this.gravity_x = 0;
            this.shift_x = 0;
            this.shift_y = 0;
            this.debug_canvas = null;
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.display_world = new PIXI.DisplayObjectContainer();
            }
            this.physics_world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(this.gravity_x, this.gravity_y), false);
            var contact_listener = new SuperGame.ContactListener();
            this.physics_world.SetContactListener(contact_listener);
            this.players = [];
            this.items = [];
            this.players_scheduled_for_removal = [];
            this.items_scheduled_for_removal = [];
        }
        World.prototype.get_width = function () {
            return this.width;
        };
        World.prototype.get_height = function () {
            return this.height;
        };
        World.prototype.get_pixels_per_meter = function () {
            return this.pixels_per_meter;
        };
        World.prototype.get_gravity_x = function () {
            return this.gravity_x;
        };
        World.prototype.get_gravity_y = function () {
            return this.gravity_y;
        };
        World.prototype.set_width = function (width) {
            this.width = width;
        };
        World.prototype.set_height = function (height) {
            this.height = height;
        };
        World.prototype.set_pixels_per_meter = function (pixels_per_meter) {
            this.pixels_per_meter = pixels_per_meter;
        };
        World.prototype.set_gravity_x = function (gravity_x) {
            this.gravity_x = gravity_x;
            this.physics_world.SetGravity(new Box2D.Common.Math.b2Vec2(this.gravity_x, this.gravity_y));
        };
        World.prototype.set_gravity_y = function (gravity_y) {
            this.gravity_y = gravity_y;
            this.physics_world.SetGravity(new Box2D.Common.Math.b2Vec2(this.gravity_x, this.gravity_y));
        };
        World.prototype.reset = function () {
            this.display_world.position.x = 0;
            this.display_world.position.y = 0;
            this.shift_x = 0;
            this.shift_y = 0;
            this.pixels_per_meter = 70;
            this.width = 0;
            this.height = 0;
            while (this.display_world.children.length > 0) {
                this.display_world.removeChild(this.display_world.children[0]);
            }
            var body;
            while (body = this.physics_world.GetBodyList()) {
                this.physics_world.DestroyBody(body);
            }
            this.players = [];
            this.items = [];
        };
        World.prototype.destroy_item = function (item) {
            this.items_scheduled_for_removal.push(item);
        };
        World.prototype.destroy_player = function (player) {
            this.players_scheduled_for_removal.push(player);
        };
        World.prototype.do_scheduled_removals = function () {
            for (var i = 0; i < this.items_scheduled_for_removal.length; i++) {
                var item = this.items_scheduled_for_removal[i];
                item.remove_from_world();
                var index = this.items.indexOf(item);
                this.items.splice(index, 1);
            }
            this.items_scheduled_for_removal = [];
            for (var i = 0; i < this.players_scheduled_for_removal.length; i++) {
                var player = this.players_scheduled_for_removal[i];
                player.remove_from_world();
                var index = this.players.indexOf(player);
                this.players.splice(index, 1);
            }
            this.players_scheduled_for_removal = [];
        };
        World.prototype.set_shift = function (shift_x, shift_y) {
            this.shift_x = shift_x;
            this.shift_y = shift_y;
            this.display_world.position.x = this.shift_x;
            this.display_world.position.y = this.shift_y;
        };
        World.prototype.update_state = function (millisecondspassed) {
            this.do_scheduled_removals();
            for (var i = 0; i < this.players.length; i++) {
                this.players[i].update(millisecondspassed);
            }
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].update(millisecondspassed);
            }
        };
        World.prototype.step = function (millisecondspassed) {
            this.physics_world.Step(millisecondspassed / 1000, 10, 10);
            this.physics_world.ClearForces();
        };
        World.prototype.draw_debug_data = function (scale) {
            if (SuperGame.ENVIRONMENT != "CLIENT")
                return;
            var debug_canvas = this.get_debug_canvas();
            var debug_canvas_context = debug_canvas.getContext("2d");
            debug_canvas_context.save();
            debug_canvas_context.clearRect(0, 0, debug_canvas.width, debug_canvas.height);
            debug_canvas_context.translate(this.shift_x * scale, this.shift_y * scale);
            debug_canvas_context.scale(scale, scale);
            this.physics_world.DrawDebugData();
            debug_canvas_context.restore();
        };
        World.prototype.get_debug_canvas = function () {
            if (SuperGame.ENVIRONMENT != "CLIENT")
                return;
            if (this.debug_canvas !== null)
                return this.debug_canvas;
            this.debug_canvas = document.createElement("canvas");
            this.debug_canvas.setAttribute("id", "debug-canvas");
            document.body.appendChild(this.debug_canvas);
            var debug_renderer = new PIXI.CanvasRenderer($(window).width(), $(window).height(), this.debug_canvas, true);
            $(window).resize(function () {
                debug_renderer.resize($(window).width(), $(window).height());
            });
            var debug_canvas_context = this.debug_canvas.getContext("2d");
            var debugDraw = new Box2D.Dynamics.b2DebugDraw();
            debugDraw.SetSprite(debug_canvas_context);
            debugDraw.SetDrawScale(this.pixels_per_meter);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
            this.physics_world.SetDebugDraw(debugDraw);
            return this.debug_canvas;
        };
        return World;
    }());
    SuperGame.World = World;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var Map = (function () {
        function Map(tmx_map) {
            this.tmx_map = tmx_map;
            this.players = [];
            this.items = [];
            this.base_textures_by_firstgid = [];
            this.textures_by_gid = [];
        }
        Map.prototype.get_players = function () {
            return this.players;
        };
        Map.prototype.get_items = function () {
            return this.items;
        };
        Map.prototype.get_background_color = function () {
            return this.tmx_map.backgroundcolor;
        };
        Map.prototype.add_to_world = function (world) {
            this.world = world;
            this.world.set_pixels_per_meter(this.tmx_map.properties.METER);
            this.world.set_width(this.tmx_map.width * this.tmx_map.tilewidth);
            this.world.set_height(this.tmx_map.height * this.tmx_map.tileheight);
            this.add_layers();
            this.world.players = this.players;
            this.world.items = this.items;
        };
        Map.prototype.add_layers = function () {
            for (var i = 0; i < this.tmx_map.layers.length; i++) {
                if (this.tmx_map.layers[i].type == SuperGame.TMX_LAYER_TYPES.TILE_LAYER && SuperGame.ENVIRONMENT == "CLIENT") {
                    this.add_tilelayer(this.tmx_map.layers[i]);
                }
                else if (this.tmx_map.layers[i].type == SuperGame.TMX_LAYER_TYPES.OBJECT_GROUP) {
                    this.add_objectgroup(this.tmx_map.layers[i]);
                }
                else if (this.tmx_map.layers[i].type == SuperGame.TMX_LAYER_TYPES.IMAGE_LAYER) {
                    this.add_image_layer(this.tmx_map.layers[i]);
                }
            }
        };
        Map.prototype.get_texture_from_gid = function (gid, tileset) {
            if (this.textures_by_gid[gid] !== undefined) {
                return this.textures_by_gid[gid];
            }
            var base_texture;
            if (this.base_textures_by_firstgid[tileset.firstgid] !== undefined) {
                base_texture = this.base_textures_by_firstgid[tileset.firstgid];
            }
            else {
                base_texture = PIXI.BaseTexture.fromImage(SuperGame.URL_MAPS + tileset.image, true, PIXI.scaleModes.LINEAR);
                this.base_textures_by_firstgid[tileset.firstgid] = base_texture;
            }
            var tile_number = gid - tileset.firstgid;
            var image_pos_x = tileset.margin + (tile_number % tileset.tiles_per_row) * (tileset.tilewidth + tileset.spacing);
            var image_pos_y = tileset.margin + (Math.floor(tile_number / tileset.tiles_per_row)) * (tileset.tileheight + tileset.spacing);
            var tilerect = new PIXI.Rectangle(Math.floor(image_pos_x), Math.floor(image_pos_y), tileset.tilewidth, tileset.tileheight);
            var texture = new PIXI.Texture(base_texture, tilerect);
            this.textures_by_gid[gid] = texture;
            return texture;
        };
        Map.prototype.add_tilelayer = function (tilelayer) {
            for (var tile_pos in tilelayer.tiles) {
                if (!tilelayer.tiles.hasOwnProperty(tile_pos))
                    continue;
                var tile = tilelayer.tiles[tile_pos];
                var tileset = this.tmx_map.get_tileset_from_gid(tile.gid);
                var texture = this.get_texture_from_gid(tile.gid, tileset);
                var world_pos_x = this.tmx_map.tilewidth * (tile_pos % tilelayer.width) - (tileset.tilewidth - this.tmx_map.tilewidth);
                var world_pos_y = this.tmx_map.tileheight * Math.floor(tile_pos / tilelayer.width) - (tileset.tileheight - this.tmx_map.tileheight);
                var sprite = new PIXI.Sprite(texture);
                sprite.position.x = Math.floor(world_pos_x);
                sprite.position.y = Math.floor(world_pos_y);
                sprite.scale.x = 1.01;
                sprite.scale.y = 1.01;
                this.world.display_world.addChild(sprite);
            }
        };
        Map.prototype.add_objectgroup = function (objectgroup) {
            if (objectgroup.name == "PLAYERS") {
                for (var i = 0; i < objectgroup.objects.length; i++) {
                    this.add_player_object(objectgroup.objects[i]);
                }
            }
            else if (objectgroup.name == "ITEMS") {
                for (var i = 0; i < objectgroup.objects.length; i++) {
                    this.add_item_object(objectgroup.objects[i]);
                }
            }
            else if (objectgroup.name == "MAP") {
                for (var i = 0; i < objectgroup.objects.length; i++) {
                    this.add_map_object(objectgroup.objects[i]);
                }
            }
        };
        Map.prototype.add_image_layer = function (imagelayer) {
        };
        Map.prototype.add_player_object = function (object) {
            var player = new SuperGame.Player();
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                var tileset = this.tmx_map.get_tileset_from_gid(object.gid);
                var texture = this.get_texture_from_gid(object.gid, tileset);
                player.add_to_world(object.x, object.y, this.world, texture);
            }
            else {
                player.add_to_world(object.x, object.y, this.world);
            }
            this.players.push(player);
        };
        Map.prototype.add_item_object = function (object) {
            var item = null;
            if (object.type == "BOX") {
                item = new SuperGame.BoxItem();
            }
            else if (object.type == "PICKUP") {
                item = new SuperGame.PickupItem();
            }
            if (item !== null) {
                if (SuperGame.ENVIRONMENT == "CLIENT") {
                    var tileset = this.tmx_map.get_tileset_from_gid(object.gid);
                    var texture = this.get_texture_from_gid(object.gid, tileset);
                    item.add_to_world(object.x, object.y, this.world, texture);
                }
                else {
                    item.add_to_world(object.x, object.y, this.world);
                }
                this.items.push(item);
            }
        };
        Map.prototype.add_map_object = function (object) {
            var fixture_def = SuperGame.PhysicsFactory.fixture_builder(1, 0, 0.3).set_category_bits(SuperGame.COLLISION_CATEGORIES.GROUND).build();
            if (object.shape == SuperGame.TMX_OBJECT_SHAPES.POLYGON) {
                if (object.points.length < 3) {
                    return;
                }
                var vertices = [];
                for (var i = 0; i < object.points.length; i++) {
                    vertices.push(new Box2D.Common.Math.b2Vec2(object.points[i].x, object.points[i].y));
                }
                if (vertices[0].x > vertices[1].x) {
                    vertices.reverse();
                }
                var body = SuperGame.PhysicsFactory.create_polygon_body(this.world.physics_world, SuperGame.BODY_TYPES.STATIC, object.x, object.y, vertices, fixture_def, this.world.get_pixels_per_meter());
                body.SetUserData(new SuperGame.B2UserData(SuperGame.B2_TYPE.GROUND, this));
            }
            else if (object.shape == SuperGame.TMX_OBJECT_SHAPES.RECTANGLE) {
                var body = SuperGame.PhysicsFactory.create_box_body(this.world.physics_world, SuperGame.BODY_TYPES.STATIC, object.x + object.width / 2, object.y + object.height / 2, object.width, object.height, fixture_def, this.world.get_pixels_per_meter());
                body.SetUserData(new SuperGame.B2UserData(SuperGame.B2_TYPE.GROUND, this));
            }
            else {
            }
        };
        return Map;
    }());
    SuperGame.Map = Map;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var TMX_OBJECT_SHAPES;
    (function (TMX_OBJECT_SHAPES) {
        TMX_OBJECT_SHAPES[TMX_OBJECT_SHAPES["RECTANGLE"] = 0] = "RECTANGLE";
        TMX_OBJECT_SHAPES[TMX_OBJECT_SHAPES["ELLIPSE"] = 1] = "ELLIPSE";
        TMX_OBJECT_SHAPES[TMX_OBJECT_SHAPES["POLYGON"] = 2] = "POLYGON";
        TMX_OBJECT_SHAPES[TMX_OBJECT_SHAPES["POLYLINE"] = 3] = "POLYLINE";
    })(TMX_OBJECT_SHAPES = SuperGame.TMX_OBJECT_SHAPES || (SuperGame.TMX_OBJECT_SHAPES = {}));
    SuperGame.TMX_LAYER_TYPES = {
        TILE_LAYER: "tilelayer",
        OBJECT_GROUP: "objectgroup",
        IMAGE_LAYER: "imagelayer"
    };
    var TmxTerrain = (function () {
        function TmxTerrain(name, tile) {
            this.name = name;
            this.tile = tile;
        }
        return TmxTerrain;
    }());
    SuperGame.TmxTerrain = TmxTerrain;
    var TmxTile = (function () {
        function TmxTile(gid) {
            this.gid = gid;
        }
        return TmxTile;
    }());
    SuperGame.TmxTile = TmxTile;
    var TmxPoint = (function () {
        function TmxPoint(x, y) {
            this.x = x;
            this.y = y;
        }
        return TmxPoint;
    }());
    SuperGame.TmxPoint = TmxPoint;
    var TmxMap = (function () {
        function TmxMap(json_data) {
            this.version = "1.0";
            this.orientation = "orthogonal";
            this.tilewidth = 32;
            this.tileheight = 32;
            this.width = 32;
            this.height = 32;
            this.backgroundcolor = 0xFFFFFF;
            this.properties = {};
            this.tilesets = [];
            this.layers = [];
            this.parse_map(json_data);
        }
        TmxMap.prototype.parse_map = function (json_data) {
            this.version = json_data.version;
            this.orientation = json_data.orientation;
            this.width = json_data.width;
            this.height = json_data.height;
            this.tilewidth = json_data.tilewidth;
            this.tileheight = json_data.tileheight;
            if (json_data.hasOwnProperty("backgroundcolor")) {
                this.backgroundcolor = json_data.backgroundcolor.replace("#", "0x");
            }
            if (json_data.hasOwnProperty("tilesets")) {
                for (var i = 0; i < json_data.tilesets.length; i++) {
                    var tileset = new TmxTileset(json_data.tilesets[i]);
                    this.tilesets.push(tileset);
                }
            }
            if (json_data.hasOwnProperty("properties")) {
                this.properties = json_data.properties;
            }
            if (json_data.hasOwnProperty("layers")) {
                for (var i = 0; i < json_data.layers.length; i++) {
                    var layer;
                    if (json_data.layers[i].type === SuperGame.TMX_LAYER_TYPES.TILE_LAYER) {
                        layer = new TmxTileLayer(json_data.layers[i]);
                        this.layers.push(layer);
                    }
                    else if (json_data.layers[i].type === SuperGame.TMX_LAYER_TYPES.OBJECT_GROUP) {
                        layer = new TmxObjectgroup(json_data.layers[i]);
                        this.layers.push(layer);
                    }
                    else if (json_data.layers[i].type === SuperGame.TMX_LAYER_TYPES.IMAGE_LAYER) {
                        layer = new TmxImagelayer(json_data.layers[i]);
                        this.layers.push(layer);
                    }
                }
            }
        };
        TmxMap.prototype.get_tileset_from_gid = function (gid) {
            for (var i = 0; i < this.tilesets.length; i++) {
                if (gid >= this.tilesets[i].firstgid && gid <= this.tilesets[i].lastgid) {
                    return this.tilesets[i];
                }
            }
            throw "No tilesets match that gid";
        };
        return TmxMap;
    }());
    SuperGame.TmxMap = TmxMap;
    var TmxTileset = (function () {
        function TmxTileset(json_data) {
            this.tileoffset_x = 0;
            this.tileoffset_y = 0;
            this.firstgid = 0;
            this.lastgid = 0;
            this.name = "";
            this.image = "";
            this.imagewidth = 0;
            this.imageheight = 0;
            this.tilewidth = 0;
            this.tileheight = 0;
            this.spacing = 0;
            this.margin = 0;
            this.tileoffset_x = 0;
            this.tileoffset_y = 0;
            this.tiles_per_row = 0;
            this.tiles_per_column = 0;
            this.properties = {};
            this.terrains = [];
            this.parse_tileset(json_data);
        }
        TmxTileset.prototype.parse_tileset = function (json_data) {
            this.firstgid = json_data.firstgid;
            this.name = json_data.name;
            this.image = json_data.image;
            this.imagewidth = json_data.imagewidth;
            this.imageheight = json_data.imageheight;
            this.tilewidth = json_data.tilewidth;
            this.tileheight = json_data.tileheight;
            this.spacing = json_data.spacing;
            this.margin = json_data.margin;
            this.tiles_per_row = Math.floor((this.imagewidth + this.spacing - 2 * this.margin) / (this.tilewidth + this.spacing));
            this.tiles_per_column = Math.floor((this.imageheight + this.spacing - 2 * this.margin) / (this.tileheight + this.spacing));
            this.lastgid = this.tiles_per_row * this.tiles_per_column + this.firstgid - 1;
            if (json_data.hasOwnProperty("terrains")) {
                for (var i = 0; i < json_data.terrains.length; i++) {
                    var terrain = new TmxTerrain(json_data.terrains[i].name, json_data.terrains[i].tile);
                    this.terrains.push(terrain);
                }
            }
            if (json_data.hasOwnProperty("tileoffset")) {
                this.tileoffset_x = json_data.tileoffset.x;
                this.tileoffset_y = json_data.tileoffset.y;
            }
            if (json_data.hasOwnProperty("properties")) {
                this.properties = json_data.properties;
            }
        };
        return TmxTileset;
    }());
    SuperGame.TmxTileset = TmxTileset;
    var TmxLayer = (function () {
        function TmxLayer(json_data) {
            this.name = "";
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.opacity = 1;
            this.visible = 1;
            this.properties = {};
            this.parse_layer(json_data);
        }
        TmxLayer.prototype.parse_layer = function (json_data) {
            this.name = json_data.name;
            this.x = json_data.x;
            this.y = json_data.y;
            this.width = json_data.width;
            this.height = json_data.height;
            this.opacity = json_data.opacity;
            this.visible = json_data.visible;
            if (json_data.hasOwnProperty("properties")) {
                this.properties = json_data.properties;
            }
        };
        return TmxLayer;
    }());
    SuperGame.TmxLayer = TmxLayer;
    var TmxTileLayer = (function (_super) {
        __extends(TmxTileLayer, _super);
        function TmxTileLayer(json_data) {
            var _this = _super.call(this, json_data) || this;
            _this.type = SuperGame.TMX_LAYER_TYPES.TILE_LAYER;
            _this.tiles = [];
            _this.parse_tilelayer(json_data);
            return _this;
        }
        TmxTileLayer.prototype.parse_tilelayer = function (json_data) {
            for (var i = 0; i < json_data.data.length; i++) {
                if (json_data.data[i] > 0) {
                    this.tiles[i] = new TmxTile(json_data.data[i]);
                }
            }
        };
        return TmxTileLayer;
    }(TmxLayer));
    SuperGame.TmxTileLayer = TmxTileLayer;
    var TmxObjectgroup = (function (_super) {
        __extends(TmxObjectgroup, _super);
        function TmxObjectgroup(json_data) {
            var _this = _super.call(this, json_data) || this;
            _this.type = SuperGame.TMX_LAYER_TYPES.OBJECT_GROUP;
            _this.objects = [];
            _this.parse_objectgroup(json_data);
            return _this;
        }
        TmxObjectgroup.prototype.parse_objectgroup = function (json_data) {
            for (var i = 0; i < json_data.objects.length; i++) {
                var object = new TmxObject(json_data.objects[i]);
                this.objects.push(object);
            }
        };
        return TmxObjectgroup;
    }(TmxLayer));
    SuperGame.TmxObjectgroup = TmxObjectgroup;
    var TmxObject = (function () {
        function TmxObject(json_data) {
            this.gid = 0;
            this.name = "";
            this.type = "";
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.rotation = 0;
            this.visible = 1;
            this.shape = TMX_OBJECT_SHAPES.RECTANGLE;
            this.properties = {};
            this.points = [];
            this.parse_object(json_data);
        }
        TmxObject.prototype.parse_object = function (json_data) {
            this.name = json_data.name;
            this.x = json_data.x;
            this.y = json_data.y;
            this.width = json_data.width;
            this.height = json_data.height;
            this.rotation = json_data.rotation;
            this.visible = json_data.visible;
            this.type = json_data.type;
            if (json_data.hasOwnProperty("ellipse") && json_data.ellipse === "true") {
                this.shape = TMX_OBJECT_SHAPES.ELLIPSE;
            }
            else if (json_data.hasOwnProperty("polygon")) {
                this.shape = TMX_OBJECT_SHAPES.POLYGON;
                for (var i = 0; i < json_data.polygon.length; i++) {
                    this.points.push(new TmxPoint(json_data.polygon[i].x, json_data.polygon[i].y));
                }
            }
            else if (json_data.hasOwnProperty("polyline")) {
                this.shape = TMX_OBJECT_SHAPES.POLYLINE;
                for (var i = 0; i < json_data.polyline.length; i++) {
                    this.points.push(new TmxPoint(json_data.polyline[i].x, json_data.polyline[i].y));
                }
            }
            else if (json_data.hasOwnProperty("gid")) {
                this.shape = TMX_OBJECT_SHAPES.RECTANGLE;
                this.gid = json_data.gid;
            }
            else {
                this.shape = TMX_OBJECT_SHAPES.RECTANGLE;
            }
            if (json_data.hasOwnProperty("properties")) {
                this.properties = json_data.properties;
            }
        };
        return TmxObject;
    }());
    SuperGame.TmxObject = TmxObject;
    var TmxImagelayer = (function (_super) {
        __extends(TmxImagelayer, _super);
        function TmxImagelayer(json_data) {
            var _this = _super.call(this, json_data) || this;
            _this.type = SuperGame.TMX_LAYER_TYPES.IMAGE_LAYER;
            _this.image = "";
            _this.parse_imagelayer(json_data);
            return _this;
        }
        TmxImagelayer.prototype.parse_imagelayer = function (json_data) {
            this.image = json_data.image;
        };
        return TmxImagelayer;
    }(TmxLayer));
    SuperGame.TmxImagelayer = TmxImagelayer;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var MOVE_DIRECTION;
    (function (MOVE_DIRECTION) {
        MOVE_DIRECTION[MOVE_DIRECTION["LEFT"] = 0] = "LEFT";
        MOVE_DIRECTION[MOVE_DIRECTION["RIGHT"] = 1] = "RIGHT";
        MOVE_DIRECTION[MOVE_DIRECTION["NONE"] = 2] = "NONE";
    })(MOVE_DIRECTION = SuperGame.MOVE_DIRECTION || (SuperGame.MOVE_DIRECTION = {}));
    var Player = (function () {
        function Player() {
            this.mass = 40;
            this.friction = 0;
            this.restitution = 0;
            this.velocity = 6;
            this.move_direction = MOVE_DIRECTION.NONE;
            this.scheduled_jumps = 0;
            this.jump_velocity = 13;
            this.is_touching_ground = false;
            this.available_jumps_left = 1;
        }
        Player.prototype.add_to_world = function (pos_x, pos_y, world, texture) {
            this.world = world;
            this.width = world.get_pixels_per_meter() / 2;
            this.height = world.get_pixels_per_meter() / 2;
            this.bottom_sensor_width = this.width / 2;
            this.bottom_sensor_height = this.height / 6;
            var x_start = pos_x - this.width / 2;
            var y_start = pos_y - this.height / 2;
            var width_meters = (this.width / this.world.get_pixels_per_meter());
            var cubic_meters = width_meters * width_meters * width_meters * 3.14 * 4 / 3;
            var density = this.mass / cubic_meters;
            var body_fixture = SuperGame.PhysicsFactory.fixture_builder(density, this.restitution, this.friction)
                .set_category_bits(SuperGame.COLLISION_CATEGORIES.PLAYER)
                .set_mask_bits(SuperGame.COLLISION_CATEGORIES.GROUND | SuperGame.COLLISION_CATEGORIES.ITEM)
                .build();
            this.body = SuperGame.PhysicsFactory.create_circle_body(this.world.physics_world, SuperGame.BODY_TYPES.DYNAMIC, x_start, y_start, this.width / 2, body_fixture, this.world.get_pixels_per_meter());
            this.body.SetUserData(new SuperGame.B2UserData(SuperGame.B2_TYPE.PLAYER, this));
            this.body.SetFixedRotation(true);
            var bottom_body_fixture = SuperGame.PhysicsFactory.fixture_builder(0.0001, 0, 0)
                .set_is_sensor(true)
                .build();
            bottom_body_fixture.userData = new SuperGame.B2UserData(SuperGame.B2_TYPE.PLAYER_BOTTOM, this);
            this.bottom_body = SuperGame.PhysicsFactory.create_box_body(this.world.physics_world, SuperGame.BODY_TYPES.DYNAMIC, x_start, y_start + this.height / 2 - this.bottom_sensor_height / 2, this.bottom_sensor_width, this.bottom_sensor_height, bottom_body_fixture, this.world.get_pixels_per_meter());
            this.bottom_body.SetUserData(new SuperGame.B2UserData(SuperGame.B2_TYPE.PLAYER_BOTTOM, this));
            SuperGame.PhysicsFactory.create_weld_joint(this.body, this.bottom_body, this.world.physics_world);
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.sprite = new PIXI.Sprite(texture);
                this.sprite.anchor.x = 0.5;
                this.sprite.anchor.y = 0.5;
                this.sprite.position.x = x_start;
                this.sprite.position.y = y_start;
                this.world.display_world.addChild(this.sprite);
            }
        };
        Player.prototype.remove_from_world = function () {
            this.world.physics_world.DestroyBody(this.body);
            this.world.physics_world.DestroyBody(this.bottom_body);
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.world.display_world.removeChild(this.sprite);
            }
        };
        Player.prototype.update = function (millisecondspassed) {
            this.move();
            while (this.scheduled_jumps > 0) {
                this.jump();
                this.scheduled_jumps--;
            }
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.sprite.position.x = this.body.GetPosition().x * this.world.get_pixels_per_meter();
                this.sprite.position.y = this.body.GetPosition().y * this.world.get_pixels_per_meter();
                this.sprite.rotation = this.body.GetAngle();
                if (this.move_direction == MOVE_DIRECTION.LEFT) {
                    this.sprite.scale.x = -1 * Math.abs(this.sprite.scale.x);
                }
                else if (this.move_direction == MOVE_DIRECTION.RIGHT) {
                    this.sprite.scale.x = Math.abs(this.sprite.scale.x);
                }
            }
        };
        Player.prototype.handle_collision_with_item = function (item) {
            if (item.item_type == SuperGame.ITEM_TYPES.PICKUP) {
                this.world.destroy_item(item);
            }
        };
        Player.prototype.set_move_direction = function (direction) {
            this.move_direction = direction;
        };
        Player.prototype.schedule_jump = function () {
            this.scheduled_jumps++;
        };
        Player.prototype.touched_ground = function () {
            this.is_touching_ground = true;
            this.available_jumps_left = 2;
        };
        Player.prototype.left_ground = function () {
            this.is_touching_ground = false;
        };
        Player.prototype.move = function () {
            var velocity = this.velocity;
            if (this.move_direction == MOVE_DIRECTION.LEFT) {
                velocity *= -1;
            }
            else if (this.move_direction == MOVE_DIRECTION.NONE) {
                velocity = 0;
            }
            var delta_velocity = velocity - this.body.GetLinearVelocity().x;
            var impulse = this.body.GetMass() * delta_velocity;
            this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(impulse, 0), this.body.GetWorldCenter());
        };
        Player.prototype.jump = function () {
            if (this.available_jumps_left > 0) {
                var impulse = this.body.GetMass() * this.jump_velocity * -1;
                var v = this.body.GetLinearVelocity();
                if (v.y < 0) {
                    v.y = 0;
                    this.body.SetLinearVelocity(v);
                }
                this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0, impulse), this.body.GetWorldCenter());
                this.available_jumps_left--;
            }
        };
        return Player;
    }());
    SuperGame.Player = Player;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var ITEM_TYPES;
    (function (ITEM_TYPES) {
        ITEM_TYPES[ITEM_TYPES["BOX"] = 0] = "BOX";
        ITEM_TYPES[ITEM_TYPES["PICKUP"] = 1] = "PICKUP";
    })(ITEM_TYPES = SuperGame.ITEM_TYPES || (SuperGame.ITEM_TYPES = {}));
    var Item = (function () {
        function Item() {
            this.mass = 40;
            this.friction = 0.2;
            this.restitution = 0.01;
            this.body_type = SuperGame.BODY_TYPES.DYNAMIC;
            this.is_sensor = false;
        }
        Item.prototype.update = function (millisecondspassed) {
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.sprite.position.x = this.body.GetPosition().x * this.world.get_pixels_per_meter();
                this.sprite.position.y = this.body.GetPosition().y * this.world.get_pixels_per_meter();
                this.sprite.rotation = this.body.GetAngle();
            }
        };
        Item.prototype.add_to_world = function (pos_x, pos_y, world, texture) {
            this.world = world;
            this.width = world.get_pixels_per_meter() / 2;
            this.height = world.get_pixels_per_meter() / 2;
            var x_start = pos_x - this.width / 2;
            var y_start = pos_y - this.height / 2;
            var width_meters = this.width / this.world.get_pixels_per_meter();
            var height_meters = this.height / this.world.get_pixels_per_meter();
            var cubic_meters = width_meters * width_meters * height_meters;
            var density = this.mass / cubic_meters;
            var body_fixture = SuperGame.PhysicsFactory.fixture_builder(density, this.restitution, this.friction)
                .set_category_bits(SuperGame.COLLISION_CATEGORIES.ITEM)
                .set_mask_bits(SuperGame.COLLISION_CATEGORIES.GROUND | SuperGame.COLLISION_CATEGORIES.PLAYER | SuperGame.COLLISION_CATEGORIES.ITEM)
                .set_is_sensor(this.is_sensor)
                .build();
            this.body = SuperGame.PhysicsFactory.create_box_body(this.world.physics_world, this.body_type, x_start, y_start, this.width, this.height, body_fixture, this.world.get_pixels_per_meter());
            this.body.SetUserData(new SuperGame.B2UserData(SuperGame.B2_TYPE.ITEM, this));
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.sprite = new PIXI.Sprite(texture);
                this.sprite.anchor.x = 0.5;
                this.sprite.anchor.y = 0.5;
                this.sprite.position.x = x_start;
                this.sprite.position.y = y_start;
                this.world.display_world.addChild(this.sprite);
            }
        };
        Item.prototype.remove_from_world = function () {
            this.world.physics_world.DestroyBody(this.body);
            if (SuperGame.ENVIRONMENT == "CLIENT") {
                this.world.display_world.removeChild(this.sprite);
            }
        };
        return Item;
    }());
    SuperGame.Item = Item;
    var BoxItem = (function (_super) {
        __extends(BoxItem, _super);
        function BoxItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.item_type = ITEM_TYPES.BOX;
            return _this;
        }
        return BoxItem;
    }(Item));
    SuperGame.BoxItem = BoxItem;
    var PickupItem = (function (_super) {
        __extends(PickupItem, _super);
        function PickupItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.item_type = ITEM_TYPES.PICKUP;
            _this.body_type = SuperGame.BODY_TYPES.STATIC;
            _this.is_sensor = true;
            return _this;
        }
        return PickupItem;
    }(Item));
    SuperGame.PickupItem = PickupItem;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var CORRECTION_TYPES;
    (function (CORRECTION_TYPES) {
        CORRECTION_TYPES[CORRECTION_TYPES["PLAYER_POSITION"] = 0] = "PLAYER_POSITION";
        CORRECTION_TYPES[CORRECTION_TYPES["ITEM_POSITION"] = 1] = "ITEM_POSITION";
    })(CORRECTION_TYPES = SuperGame.CORRECTION_TYPES || (SuperGame.CORRECTION_TYPES = {}));
    var Correction = (function () {
        function Correction(type) {
            this.type = type;
        }
        return Correction;
    }());
    SuperGame.Correction = Correction;
    var CorrectionPlayerPosition = (function (_super) {
        __extends(CorrectionPlayerPosition, _super);
        function CorrectionPlayerPosition(type, player_number, x, y, v_x, v_y) {
            var _this = _super.call(this, type) || this;
            _this.type = CORRECTION_TYPES.PLAYER_POSITION;
            _this.player_number = player_number;
            _this.x = x;
            _this.y = y;
            _this.v_x = v_x;
            _this.v_y = v_y;
            return _this;
        }
        return CorrectionPlayerPosition;
    }(Correction));
    SuperGame.CorrectionPlayerPosition = CorrectionPlayerPosition;
    var CorrectionItemPosition = (function (_super) {
        __extends(CorrectionItemPosition, _super);
        function CorrectionItemPosition(type, item_number, x, y, v_x, v_y, angle) {
            var _this = _super.call(this, type) || this;
            _this.type = CORRECTION_TYPES.ITEM_POSITION;
            _this.item_number = item_number;
            _this.x = x;
            _this.y = y;
            _this.v_x = v_x;
            _this.v_y = v_y;
            _this.angle = angle;
            return _this;
        }
        return CorrectionItemPosition;
    }(Correction));
    SuperGame.CorrectionItemPosition = CorrectionItemPosition;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var Scene = (function () {
        function Scene(element_id) {
            var _this = this;
            this.paused = true;
            this.$element = $("#" + element_id);
            $(window).resize(function () {
                _this.resize(_this.$element.width(), _this.$element.height());
            });
        }
        Scene.prototype.pause = function () {
            this.paused = true;
            this.$element.hide();
        };
        Scene.prototype.resume = function (scene_messages) {
            this.paused = false;
            this.$element.show();
        };
        Scene.prototype.is_paused = function () {
            return this.paused;
        };
        Scene.prototype.resize = function (scene_width, scene_height) {
        };
        return Scene;
    }());
    SuperGame.Scene = Scene;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene(element_id) {
            var _this = _super.call(this, element_id) || this;
            var keyboard = new SuperGame.Keyboard(window);
            var $canvas_element = $("<canvas></canvas>");
            $("#game").append($canvas_element);
            _this.renderer = PIXI.autoDetectRenderer(_this.$element.width(), _this.$element.height(), $canvas_element.get(0), false, false);
            _this.stage = new PIXI.Stage(0xFFFFFF);
            _this.game = new SuperGame.Game(_this.$element.width(), _this.$element.height(), _this.stage, _this.renderer, keyboard);
            _this.game_client = new SuperGame.GameClient(_this.game);
            _this.game.set_game_client(_this.game_client);
            return _this;
        }
        GameScene.prototype.resume = function (scene_messages) {
            _super.prototype.resume.call(this, scene_messages);
            this.game_client.request_game_manager(0);
        };
        GameScene.prototype.resize = function (scene_width, scene_height) {
            _super.prototype.resize.call(this, scene_width, scene_height);
            this.renderer.resize(scene_width, scene_height);
            this.game.resize(scene_width, scene_height);
        };
        return GameScene;
    }(SuperGame.Scene));
    SuperGame.GameScene = GameScene;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var LoadingScene = (function (_super) {
        __extends(LoadingScene, _super);
        function LoadingScene(element_id) {
            var _this = _super.call(this, element_id) || this;
            _this.$element.append("<div id='loading_text'></div>");
            return _this;
        }
        LoadingScene.prototype.resume = function (scene_messages) {
            _super.prototype.resume.call(this, scene_messages);
            this.load_graphics();
        };
        LoadingScene.prototype.set_loading_text = function (text) {
            $("#loading_text").html(text);
        };
        LoadingScene.prototype.remove_loading_text = function () {
            $("#loading_text").remove();
        };
        LoadingScene.prototype.load_graphics = function () {
            var _this = this;
            this.set_loading_text("Loading graphics");
            var graphic_files = [
                "assets/pink.png",
                "assets/platformerGraphicsDeluxe_Updated/Tiles/tiles_spritesheet.png",
                "assets/platformerGraphicsDeluxe_Updated/Items/mushroomRed.png",
                "assets/platformerGraphicsDeluxe_Updated/Items/mushroomBrown.png",
                "assets/platformerGraphicsDeluxe_Updated/Player/p1_stand.png"
            ];
            var loader = new PIXI.AssetLoader(graphic_files);
            var n_files = graphic_files.length;
            var files_loaded = 0;
            loader.onProgress = function () {
                files_loaded++;
                _this.set_loading_text("Loading graphics (" + files_loaded + "/" + n_files + ")");
            };
            loader.onComplete = function () {
                _this.load_sounds();
            };
            loader.load();
        };
        LoadingScene.prototype.load_sounds = function () {
            var _this = this;
            this.set_loading_text("Loading sounds");
            var sounds = [
                { src: "assets/button_sounds/button-1.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_1 },
                { src: "assets/button_sounds/button-2.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_2 },
                { src: "assets/button_sounds/button-3.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_3 },
                { src: "assets/button_sounds/button-4.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_4 },
                { src: "assets/button_sounds/button-5.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_5 },
                { src: "assets/button_sounds/button-6.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_6 },
                { src: "assets/button_sounds/button-7.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_7 },
                { src: "assets/button_sounds/button-8.wav", id: SuperGame.SoundManager.SOUND_IDS.BUTTON_8 },
                { src: "assets/sounds/rain-on-my-buds74bpm.mp3", id: SuperGame.SoundManager.SOUND_IDS.PAUSE_1 },
                { src: "assets/sounds/dodgy-c__dodgy-c-hip-hop-rockgod-beatz.mp3", id: SuperGame.SoundManager.SOUND_IDS.MENUS_1 }
            ];
            var n_sounds = sounds.length;
            var sounds_loaded = 0;
            SuperGame.SoundManager.init(sounds, function () {
                _this.loading_done();
            }, function () {
                sounds_loaded++;
                _this.set_loading_text("Loading sounds (" + sounds_loaded + "/" + n_sounds + ")");
            });
        };
        LoadingScene.prototype.loading_done = function () {
            SuperGame.SceneManager.go_to_scene("game");
        };
        return LoadingScene;
    }(SuperGame.Scene));
    SuperGame.LoadingScene = LoadingScene;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var GameClient = (function (_super) {
        __extends(GameClient, _super);
        function GameClient(game) {
            var _this = _super.call(this, io.connect('')) || this;
            _this.game = game;
            _this.set_listeners();
            return _this;
        }
        GameClient.prototype.set_listeners = function () {
            var _this = this;
            this.socket.on('nm', function (network_msgs) {
                for (var i = 0; i < network_msgs.length; i++) {
                    var network_msg = network_msgs[i];
                    switch (network_msg.type) {
                        case SuperGame.NM_TYPES.SO_CONNECTED:
                            _this.connection_state = SuperGame.CONNECTION_STATE.CONNECTED;
                            break;
                        case SuperGame.NM_TYPES.SO_GAME_MANAGER_FULL:
                            console.log("Game manager was full");
                            break;
                        case SuperGame.NM_TYPES.SO_REQUEST_GAME_MANAGER_SUCCESS:
                            _this.player_number = network_msg.content;
                            break;
                        case SuperGame.NM_TYPES.SO_MAPFILE:
                            _this.map = new SuperGame.Map(new SuperGame.TmxMap(network_msg.content));
                            _this.emit_immediately(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_READY_FOR_GAME_START));
                            break;
                        case SuperGame.NM_TYPES.SO_GAME_START:
                            _this.game.setup_from_map(_this.map, _this.player_number);
                            _this.game.start();
                            _this.emit_immediately(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_GAME_STARTED));
                            break;
                        case SuperGame.NM_TYPES.SO_CORRECTIONS:
                            _this.game.schedule_corrections(network_msg.content);
                    }
                }
            });
        };
        GameClient.prototype.request_game_manager = function (id) {
            if (id === void 0) { id = 0; }
            this.socket.emit('request_game_manager', id);
        };
        return GameClient;
    }(SuperGame.NetworkConnection));
    SuperGame.GameClient = GameClient;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var Game = (function () {
        function Game(scene_width, scene_height, stage, renderer, keyboard) {
            this.stage = stage;
            this.renderer = renderer;
            this.keyboard = keyboard;
            this.previous_timestamp = Date.now();
            this.scene_width = scene_width;
            this.scene_height = scene_height;
            this.scheduled_corrections = [];
            this.scheduled_input = [];
            this.world = new SuperGame.World();
            this.camera = new SuperGame.Camera(scene_width, scene_height);
            this.display_object_container = new PIXI.DisplayObjectContainer();
            this.display_object_container.addChild(this.world.display_world);
            this.stage.addChild(this.display_object_container);
            this.set_keyboard_listeners();
        }
        Game.prototype.set_keyboard_listeners = function () {
            var _this = this;
            this.keyboard.on_keydown(SuperGame.KEY_CODES.LEFT, function () {
                _this.player.set_move_direction(SuperGame.MOVE_DIRECTION.LEFT);
                _this.game_client.enqueue_message(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_MOVE, { direction: SuperGame.MOVE_DIRECTION.LEFT }));
            });
            this.keyboard.on_keyup(SuperGame.KEY_CODES.LEFT, function () {
                if (_this.player.move_direction == SuperGame.MOVE_DIRECTION.LEFT) {
                    _this.player.set_move_direction(SuperGame.MOVE_DIRECTION.NONE);
                    _this.game_client.enqueue_message(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_MOVE, { direction: SuperGame.MOVE_DIRECTION.NONE }));
                }
            });
            this.keyboard.on_keydown(SuperGame.KEY_CODES.RIGHT, function () {
                _this.player.set_move_direction(SuperGame.MOVE_DIRECTION.RIGHT);
                _this.game_client.enqueue_message(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_MOVE, { direction: SuperGame.MOVE_DIRECTION.RIGHT }));
            });
            this.keyboard.on_keyup(SuperGame.KEY_CODES.RIGHT, function () {
                if (_this.player.move_direction == SuperGame.MOVE_DIRECTION.RIGHT) {
                    _this.player.set_move_direction(SuperGame.MOVE_DIRECTION.NONE);
                    _this.game_client.enqueue_message(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_MOVE, { direction: SuperGame.MOVE_DIRECTION.NONE }));
                }
            });
            this.keyboard.on_keydown(SuperGame.KEY_CODES.SPACE, function () {
                _this.player.schedule_jump();
                _this.game_client.enqueue_message(new SuperGame.NetworkMsg(SuperGame.NM_TYPES.CO_JUMP));
            });
        };
        Game.prototype.set_game_client = function (game_client) {
            this.game_client = game_client;
        };
        Game.prototype.schedule_corrections = function (corrections) {
            this.scheduled_corrections.push.apply(this.scheduled_corrections, corrections);
        };
        Game.prototype.setup_from_map = function (map, player_number) {
            this.reset();
            map.add_to_world(this.world);
            this.player = this.world.players[player_number];
            this.resize(this.scene_width, this.scene_height);
        };
        Game.prototype.reset = function () {
            this.world.reset();
            this.camera.reset();
        };
        Game.prototype.resize = function (scene_width, scene_height) {
            this.camera.resize(scene_width, scene_height, this.world.get_pixels_per_meter());
            var scale = this.camera.get_world_scale();
            this.display_object_container.scale.x = scale;
            this.display_object_container.scale.y = scale;
        };
        Game.prototype.apply_corrections = function () {
            for (var i = 0; i < this.scheduled_corrections.length; i++) {
                var correction = this.scheduled_corrections[i];
                if (correction.type == SuperGame.CORRECTION_TYPES.PLAYER_POSITION) {
                    var player_pos_correction = correction;
                    this.world.players[player_pos_correction.player_number].body.SetPosition(new Box2D.Common.Math.b2Vec2(player_pos_correction.x, player_pos_correction.y));
                    this.world.players[player_pos_correction.player_number].body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(player_pos_correction.v_x, player_pos_correction.v_y));
                    if (player_pos_correction.v_x > 0.1) {
                    }
                    else if (player_pos_correction.v_x < 0.1) {
                    }
                }
                else if (correction.type = SuperGame.CORRECTION_TYPES.ITEM_POSITION) {
                    var item_pos_correction = correction;
                    this.world.items[item_pos_correction.item_number].body.SetPosition(new Box2D.Common.Math.b2Vec2(item_pos_correction.x, item_pos_correction.y));
                    this.world.items[item_pos_correction.item_number].body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(item_pos_correction.v_x, item_pos_correction.v_y));
                    this.world.items[item_pos_correction.item_number].body.SetAngle(item_pos_correction.angle);
                }
            }
            this.scheduled_corrections = [];
        };
        Game.prototype.update_state = function (millisecondspassed) {
            this.apply_corrections();
            this.world.update_state(millisecondspassed);
            this.camera.set_position(this.player.body.GetPosition().x * this.world.get_pixels_per_meter(), this.player.body.GetPosition().y * this.world.get_pixels_per_meter());
            var world_shift = this.camera.get_world_shift(this.world.get_width(), this.world.get_height());
            this.world.set_shift(world_shift.x, world_shift.y);
            this.world.step(millisecondspassed);
        };
        Game.prototype.start = function () {
            var _this = this;
            requestAnimationFrame(function (timestamp) { _this.update(timestamp); });
        };
        Game.prototype.update = function (timestamp) {
            var _this = this;
            requestAnimationFrame(function (timestamp) { _this.update(timestamp); });
            var millisecondspassed = timestamp - this.previous_timestamp;
            this.previous_timestamp = timestamp;
            this.update_state(millisecondspassed);
            this.renderer.render(this.stage);
        };
        return Game;
    }());
    SuperGame.Game = Game;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var SceneManager;
    (function (SceneManager) {
        var initialized = false;
        var scenes;
        var current_scene;
        var current_scene_id;
        var prev_scene_id;
        function init() {
            if (initialized) {
                return;
            }
            initialized = true;
            scenes = {};
            current_scene = null;
            current_scene_id = "";
            prev_scene_id = "";
        }
        SceneManager.init = init;
        function go_to_scene(scene_name, scene_messages, keep_scene_stack) {
            if (scene_messages === void 0) { scene_messages = []; }
            if (keep_scene_stack === void 0) { keep_scene_stack = false; }
            if (!scenes.hasOwnProperty(scene_name)) {
                throw scene_name + " hasn't been created yet";
            }
            if (current_scene !== null) {
                current_scene.pause();
            }
            prev_scene_id = current_scene_id;
            current_scene_id = scene_name;
            current_scene = scenes[scene_name];
            current_scene.resume(scene_messages);
        }
        SceneManager.go_to_scene = go_to_scene;
        function create_scene(scene_id, SceneClass) {
            if (scenes.hasOwnProperty(scene_id)) {
                return scenes[scene_id];
            }
            var scene = new SceneClass(scene_id);
            scenes[scene_id] = scene;
            return scene;
        }
        SceneManager.create_scene = create_scene;
        function go_to_prev_scene(scene_messages, keep_scene_stack) {
            if (scene_messages === void 0) { scene_messages = []; }
            if (keep_scene_stack === void 0) { keep_scene_stack = false; }
            go_to_scene(prev_scene_id, scene_messages, keep_scene_stack);
        }
        SceneManager.go_to_prev_scene = go_to_prev_scene;
    })(SceneManager = SuperGame.SceneManager || (SuperGame.SceneManager = {}));
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var SoundManager;
    (function (SoundManager) {
        var initialized = false;
        SoundManager.SOUND_IDS = {
            BUTTON_1: "button_1",
            BUTTON_2: "button_2",
            BUTTON_3: "button_3",
            BUTTON_4: "button_4",
            BUTTON_5: "button_5",
            BUTTON_6: "button_6",
            BUTTON_7: "button_7",
            BUTTON_8: "button_8",
            PAUSE_1: "pause_1",
            MENUS_1: "menus_1"
        };
        function init(sounds, callback_loaded, callback_progress) {
            if (initialized) {
                return;
            }
            initialized = true;
            var sounds_loaded = 0;
            var n_sounds = sounds.length;
            createjs.Sound.addEventListener("fileload", function (event) {
                sounds_loaded++;
                callback_progress();
                if (sounds_loaded >= n_sounds) {
                    callback_loaded();
                }
            });
            for (var i = 0; i < sounds.length; i++) {
                createjs.Sound.registerSound(sounds[i]);
            }
        }
        SoundManager.init = init;
    })(SoundManager = SuperGame.SoundManager || (SuperGame.SoundManager = {}));
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var SceneMessage = (function () {
        function SceneMessage(type, content) {
            this.type = type;
            this.content = content;
        }
        return SceneMessage;
    }());
    SuperGame.SceneMessage = SceneMessage;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var Camera = (function () {
        function Camera(viewport_width, viewport_height) {
            this.meters_per_viewport_height = 12;
            this.viewport_width = viewport_width;
            this.viewport_height = viewport_height;
            this.set_variables();
            this.display_container = new PIXI.DisplayObjectContainer();
        }
        Camera.prototype.set_variables = function () {
            this.camera_width = this.viewport_width;
            this.camera_height = this.viewport_height;
            this.box_width = this.camera_width * 0.2;
            this.box_height = this.camera_height * 0.2;
            this.x = 0;
            this.y = 0;
            this.box_x = 0;
            this.box_y = 0;
            this.scale = 1;
        };
        Camera.prototype.reset = function () {
            this.set_variables();
            while (this.display_container.children.length > 0) {
                this.display_container.removeChild(this.display_container.children[0]);
            }
        };
        Camera.prototype.get_world_shift = function (world_width, world_height) {
            var camera_half_width = this.camera_width / 2;
            var camera_half_height = this.camera_height / 2;
            if (this.x < camera_half_width) {
                this.x = camera_half_width;
            }
            if (this.x + camera_half_width > world_width) {
                this.x = world_width - camera_half_width;
            }
            if (this.y < camera_half_height) {
                this.y = camera_half_height;
            }
            if (this.y + camera_half_height > world_height) {
                this.y = world_height - camera_half_height;
            }
            var shift_x = -1 * this.x;
            var shift_y = -1 * this.y;
            shift_x += camera_half_width;
            shift_y += camera_half_height;
            if (world_width < this.camera_width) {
                shift_x -= (this.camera_width - world_width) / 2;
            }
            if (world_height < this.camera_height) {
                shift_y -= (this.camera_height - world_height) / 2;
            }
            return { x: shift_x, y: shift_y };
        };
        Camera.prototype.get_world_scale = function () {
            return this.scale;
        };
        Camera.prototype.resize = function (viewport_width, viewport_height, pixels_per_meter) {
            this.viewport_width = viewport_width;
            this.viewport_height = viewport_height;
            this.scale = (viewport_height / pixels_per_meter) / this.meters_per_viewport_height;
            this.camera_width = this.viewport_width / this.scale;
            this.camera_height = this.viewport_height / this.scale;
            this.box_width = this.camera_width * 0.2;
            this.box_height = this.camera_height * 0.2;
        };
        Camera.prototype.set_position = function (x, y) {
            if (x < this.box_x) {
                this.box_x = x;
            }
            else if (x > this.box_x + this.box_width) {
                this.box_x = x - this.box_width;
            }
            if (y < this.box_y) {
                this.box_y = y;
            }
            else if (y > this.box_y + this.box_height) {
                this.box_y = y - this.box_height;
            }
            this.x = this.box_x + this.box_width / 2;
            this.y = this.box_y + this.box_height / 2;
        };
        return Camera;
    }());
    SuperGame.Camera = Camera;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var KEY_CODES;
    (function (KEY_CODES) {
        KEY_CODES[KEY_CODES["BACKSPACE"] = 8] = "BACKSPACE";
        KEY_CODES[KEY_CODES["ENTER"] = 13] = "ENTER";
        KEY_CODES[KEY_CODES["SHIFT"] = 16] = "SHIFT";
        KEY_CODES[KEY_CODES["CTRL"] = 17] = "CTRL";
        KEY_CODES[KEY_CODES["ALT"] = 18] = "ALT";
        KEY_CODES[KEY_CODES["CAPSLOCK"] = 20] = "CAPSLOCK";
        KEY_CODES[KEY_CODES["ESC"] = 27] = "ESC";
        KEY_CODES[KEY_CODES["DELETE"] = 46] = "DELETE";
        KEY_CODES[KEY_CODES["SPACE"] = 32] = "SPACE";
        KEY_CODES[KEY_CODES["LEFT"] = 37] = "LEFT";
        KEY_CODES[KEY_CODES["UP"] = 38] = "UP";
        KEY_CODES[KEY_CODES["RIGHT"] = 39] = "RIGHT";
        KEY_CODES[KEY_CODES["DOWN"] = 40] = "DOWN";
        KEY_CODES[KEY_CODES["A"] = 65] = "A";
        KEY_CODES[KEY_CODES["B"] = 66] = "B";
        KEY_CODES[KEY_CODES["C"] = 67] = "C";
        KEY_CODES[KEY_CODES["D"] = 68] = "D";
        KEY_CODES[KEY_CODES["E"] = 69] = "E";
        KEY_CODES[KEY_CODES["F"] = 70] = "F";
        KEY_CODES[KEY_CODES["G"] = 71] = "G";
        KEY_CODES[KEY_CODES["H"] = 72] = "H";
        KEY_CODES[KEY_CODES["I"] = 73] = "I";
        KEY_CODES[KEY_CODES["J"] = 74] = "J";
        KEY_CODES[KEY_CODES["K"] = 75] = "K";
        KEY_CODES[KEY_CODES["L"] = 76] = "L";
        KEY_CODES[KEY_CODES["M"] = 76] = "M";
        KEY_CODES[KEY_CODES["N"] = 78] = "N";
        KEY_CODES[KEY_CODES["O"] = 79] = "O";
        KEY_CODES[KEY_CODES["P"] = 80] = "P";
        KEY_CODES[KEY_CODES["Q"] = 81] = "Q";
        KEY_CODES[KEY_CODES["R"] = 82] = "R";
        KEY_CODES[KEY_CODES["S"] = 83] = "S";
        KEY_CODES[KEY_CODES["T"] = 84] = "T";
        KEY_CODES[KEY_CODES["U"] = 85] = "U";
        KEY_CODES[KEY_CODES["V"] = 86] = "V";
        KEY_CODES[KEY_CODES["W"] = 87] = "W";
        KEY_CODES[KEY_CODES["X"] = 88] = "X";
        KEY_CODES[KEY_CODES["Y"] = 89] = "Y";
        KEY_CODES[KEY_CODES["Z"] = 90] = "Z";
        KEY_CODES[KEY_CODES["ZERO"] = 48] = "ZERO";
        KEY_CODES[KEY_CODES["ONE"] = 49] = "ONE";
        KEY_CODES[KEY_CODES["TWO"] = 50] = "TWO";
        KEY_CODES[KEY_CODES["THREE"] = 51] = "THREE";
        KEY_CODES[KEY_CODES["FOUR"] = 52] = "FOUR";
        KEY_CODES[KEY_CODES["FIVE"] = 53] = "FIVE";
        KEY_CODES[KEY_CODES["SIX"] = 54] = "SIX";
        KEY_CODES[KEY_CODES["SEVEN"] = 55] = "SEVEN";
        KEY_CODES[KEY_CODES["EIGHT"] = 56] = "EIGHT";
        KEY_CODES[KEY_CODES["NINE"] = 57] = "NINE";
    })(KEY_CODES = SuperGame.KEY_CODES || (SuperGame.KEY_CODES = {}));
    var Keyboard = (function () {
        function Keyboard(elem) {
            this.keydown_callbacks = {};
            this.keyup_callbacks = {};
            this.keystates = [];
            for (var i = 0; i < 256; i++) {
                this.keystates.push(false);
            }
            this.listen(elem);
        }
        Keyboard.prototype.listen = function (elem) {
            var _this = this;
            $(elem).keydown(function (e) {
                _this.keystates[e.which] = true;
                if (_this.keydown_callbacks[e.which] !== undefined) {
                    $.each(_this.keydown_callbacks[e.which], function (key, f) {
                        f();
                    });
                }
            });
            $(elem).keyup(function (e) {
                _this.keystates[e.which] = false;
                if (_this.keyup_callbacks[e.which] !== undefined) {
                    $.each(_this.keyup_callbacks[e.which], function (key, f) {
                        f();
                    });
                }
            });
        };
        Keyboard.prototype.on_keydown = function (keycode, f) {
            if (this.keydown_callbacks[keycode] === undefined) {
                this.keydown_callbacks[keycode] = [];
            }
            this.keydown_callbacks[keycode].push(f);
        };
        Keyboard.prototype.on_keyup = function (keycode, f) {
            if (this.keyup_callbacks[keycode] === undefined) {
                this.keyup_callbacks[keycode] = [];
            }
            this.keyup_callbacks[keycode].push(f);
        };
        Keyboard.prototype.key_is_pressed = function (keycode) {
            return this.keystates[keycode];
        };
        return Keyboard;
    }());
    SuperGame.Keyboard = Keyboard;
})(SuperGame || (SuperGame = {}));
var SuperGame;
(function (SuperGame) {
    var Main = (function () {
        function Main() {
            SuperGame.SceneManager.init();
            SuperGame.SceneManager.create_scene("loading", SuperGame.LoadingScene);
            SuperGame.SceneManager.create_scene("game", SuperGame.GameScene);
            SuperGame.SceneManager.go_to_scene("loading");
        }
        return Main;
    }());
    SuperGame.Main = Main;
})(SuperGame || (SuperGame = {}));
$(window).load(function () {
    new SuperGame.Main();
});
//# sourceMappingURL=client.js.map