///<reference path="_references.ts"/>
module SuperGame {
    export class Map {
        private tmx_map:TmxMap;

        private world:World;
        private players:Player[];
        private items:Item[];

        private base_textures_by_firstgid:PIXI.BaseTexture[]; // Texure that contains the entire tileset. Create subtextures from this.
        private textures_by_gid:PIXI.Texture[];

        constructor(tmx_map) {
            this.tmx_map = tmx_map;
            this.players = [];
            this.items = [];

            this.base_textures_by_firstgid = [];
            this.textures_by_gid = [];
        }

        public get_players() {
            return this.players;
        }

        public get_items() {
            return this.items;
        }

        public get_background_color() {
            return this.tmx_map.backgroundcolor;
        }

        public add_to_world(world:World) {
            this.world = world;
            this.world.set_pixels_per_meter(this.tmx_map.properties.METER);
            this.world.set_width(this.tmx_map.width * this.tmx_map.tilewidth);
            this.world.set_height(this.tmx_map.height * this.tmx_map.tileheight);
            this.add_layers();
            this.world.players = this.players;
            this.world.items = this.items;
        }

        private add_layers() {
            for (var i = 0; i < this.tmx_map.layers.length; i++) {
                if (this.tmx_map.layers[i].type == TMX_LAYER_TYPES.TILE_LAYER && ENVIRONMENT == "CLIENT") {
                    this.add_tilelayer(<TmxTileLayer>this.tmx_map.layers[i]);
                } else if (this.tmx_map.layers[i].type == TMX_LAYER_TYPES.OBJECT_GROUP) {
                    this.add_objectgroup(<TmxObjectgroup>this.tmx_map.layers[i]);
                } else if (this.tmx_map.layers[i].type == TMX_LAYER_TYPES.IMAGE_LAYER) {
                    this.add_image_layer(<TmxImagelayer>this.tmx_map.layers[i]);
                }
            }
        }

        private get_texture_from_gid(gid, tileset:TmxTileset) {
            if (this.textures_by_gid[gid] !== undefined) {
                return this.textures_by_gid[gid];
            }

            var base_texture;
            if (this.base_textures_by_firstgid[tileset.firstgid] !== undefined) {
                base_texture = this.base_textures_by_firstgid[tileset.firstgid];
            } else {
                base_texture = PIXI.BaseTexture.fromImage(URL_MAPS + tileset.image, true, PIXI.scaleModes.LINEAR);
                this.base_textures_by_firstgid[tileset.firstgid] = base_texture;
            }

            var tile_number = gid - tileset.firstgid;
            var image_pos_x = tileset.margin + (tile_number % tileset.tiles_per_row) * (tileset.tilewidth + tileset.spacing);
            var image_pos_y = tileset.margin + (Math.floor(tile_number / tileset.tiles_per_row)) * (tileset.tileheight + tileset.spacing);
            var tilerect = new PIXI.Rectangle(Math.floor(image_pos_x), Math.floor(image_pos_y), tileset.tilewidth, tileset.tileheight);
            var texture = new PIXI.Texture(base_texture, tilerect);
            this.textures_by_gid[gid] = texture;
            return texture;
        }

        private add_tilelayer(tilelayer:TmxTileLayer) {
            for (var tile_pos in tilelayer.tiles) {
                if (!tilelayer.tiles.hasOwnProperty(tile_pos)) continue;

                var tile = tilelayer.tiles[tile_pos];
                var tileset = this.tmx_map.get_tileset_from_gid(tile.gid);
                var texture = this.get_texture_from_gid(tile.gid, tileset);

                // The map tilewidth in pixels dictates the position according to tile width in number of tiles
                // However, tiles in the tileset may be bigger or smaller than the map tiles, and oddly enough
                // tiled put the tile position at the bottom left of the tileset tile. Therefore substract the difference to
                // move the tile to the correct position (top left).
                var world_pos_x = this.tmx_map.tilewidth * (tile_pos % tilelayer.width) - (tileset.tilewidth - this.tmx_map.tilewidth);
                var world_pos_y = this.tmx_map.tileheight * Math.floor(tile_pos / tilelayer.width) - (tileset.tileheight - this.tmx_map.tileheight);

                var sprite = new PIXI.Sprite(texture);
                sprite.position.x = Math.floor(world_pos_x);
                sprite.position.y = Math.floor(world_pos_y);

                // Note: Tiny hack going on here. Let the sprites be a tiny bit bigger, so we avoid white-line gap rounding problems.
                sprite.scale.x = 1.01;
                sprite.scale.y = 1.01;

                this.world.display_world.addChild(sprite);
            }
        }

        private add_objectgroup(objectgroup:TmxObjectgroup) {
            if (objectgroup.name == "PLAYERS") {
                for (var i = 0; i < objectgroup.objects.length; i++) {
                    this.add_player_object(objectgroup.objects[i]);
                }
            } else if (objectgroup.name == "ITEMS") {
                for (var i = 0; i < objectgroup.objects.length; i++) {
                    this.add_item_object(objectgroup.objects[i]);
                }
            } else if (objectgroup.name == "MAP") {
                for (var i = 0; i < objectgroup.objects.length; i++) {
                    this.add_map_object(objectgroup.objects[i]);
                }
            }
        }

        private add_image_layer(imagelayer:TmxImagelayer) {
            // Not implemented
        }

        private add_player_object(object:TmxObject) {
            var player = new Player();

            if(ENVIRONMENT == "CLIENT"){
                var tileset = this.tmx_map.get_tileset_from_gid(object.gid);
                var texture = this.get_texture_from_gid(object.gid, tileset);
                player.add_to_world(object.x, object.y, this.world, texture);
            }else{
                player.add_to_world(object.x, object.y, this.world);
            }

            this.players.push(player);
        }

        private add_item_object(object:TmxObject) {
            var item:any = null;

            if (object.type == "BOX") {
                item = new BoxItem();
            } else if (object.type == "PICKUP") {
                item = new PickupItem();
            }

            if (item !== null) {
                if(ENVIRONMENT == "CLIENT"){
                    var tileset = this.tmx_map.get_tileset_from_gid(object.gid);
                    var texture = this.get_texture_from_gid(object.gid, tileset);
                    item.add_to_world(object.x, object.y, this.world, texture);
                }else{
                    item.add_to_world(object.x, object.y, this.world);
                }

                this.items.push(item);
            }
        }

        private add_map_object(object:TmxObject) {
            var fixture_def = PhysicsFactory.fixture_builder(1, 0, 0.3).set_category_bits(COLLISION_CATEGORIES.GROUND).build();

            if (object.shape == TMX_OBJECT_SHAPES.POLYGON) {
                if (object.points.length < 3) {
                    return;
                }

                var vertices = [];
                for (var i = 0; i < object.points.length; i++) {
                    vertices.push(new Box2D.Common.Math.b2Vec2(object.points[i].x, object.points[i].y));
                }

                // Check if points are in counter clockwise order, and reverse if that's the case
                if (vertices[0].x > vertices[1].x) {
                    vertices.reverse();
                }

                var body = PhysicsFactory.create_polygon_body(this.world.physics_world,
                    BODY_TYPES.STATIC,
                    object.x,
                    object.y,
                    vertices,
                    fixture_def,
                    this.world.get_pixels_per_meter());

                body.SetUserData(new B2UserData(B2_TYPE.GROUND, this));
            } else if (object.shape == TMX_OBJECT_SHAPES.RECTANGLE) {
                var body = PhysicsFactory.create_box_body(this.world.physics_world,
                    BODY_TYPES.STATIC,
                    object.x + object.width / 2,
                    object.y + object.height / 2,
                    object.width, object.height,
                    fixture_def,
                    this.world.get_pixels_per_meter());

                body.SetUserData(new B2UserData(B2_TYPE.GROUND, this));
            } else {
                // Only polygon and rect supported currently
            }
        }
    }
}