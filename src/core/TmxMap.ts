///<reference path="_references.ts"/>

/*
 Special map requirements:

 - Map should set the background color, and have the following properties
 - METER : how many pixels should equal a meter

 - Map objectgroups should have the following properties
 - TYPE : GROUND, PLAYERS

 - Player spawn points should be a separate objectgroup, where the spawn points are tiles.
 The tile gives the texture to use for the player. The object should have the following properties:
 PLAYER : PINK, GREEN

 - Collidables can be rectangles or polygons. Remember that polygons must be convex, and there
 is an upper bound on number of vertices in Box2D. By default 8, but can be increased.

 - Imagelayers are currently not supported.


 https://github.com/bjorn/tiled/wiki/TMX-Map-Format#tileoffset
 */
module SuperGame {
    export enum TMX_OBJECT_SHAPES {
        RECTANGLE,
        ELLIPSE,
        POLYGON,
        POLYLINE
    }

    export var TMX_LAYER_TYPES = {
        TILE_LAYER: "tilelayer",
        OBJECT_GROUP: "objectgroup",
        IMAGE_LAYER: "imagelayer"
    };

    export class TmxTerrain {
        name:string;
        tile:number; // Tile id of the tile that represents the terrain visually

        constructor(name, tile) {
            this.name = name;
            this.tile = tile;
        }
    }

    export class TmxTile {
        gid:number;

        constructor(gid) {
            this.gid = gid;
        }
    }

    export class TmxPoint {
        x:number;
        y:number;

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    export class TmxMap {
        version:string;
        orientation:string;
        tilewidth:number;
        tileheight:number;
        width:number;
        height:number;
        backgroundcolor:number;

        // Can contain
        properties:any;
        tilesets:TmxTileset[];
        layers:TmxLayer[];

        constructor(json_data:any) {
            this.version = "1.0";
            this.orientation = "orthogonal";
            this.tilewidth = 32;
            this.tileheight = 32;
            this.width = 32;
            this.height = 32;
            this.backgroundcolor = 0xFFFFFF;

            // Can contain
            this.properties = {};
            this.tilesets = [];
            this.layers = [];

            this.parse_map(json_data);
        }

        private parse_map(json_data:any) {
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
                    if (json_data.layers[i].type === TMX_LAYER_TYPES.TILE_LAYER) {
                        layer = new TmxTileLayer(json_data.layers[i]);
                        this.layers.push(layer);
                    } else if (json_data.layers[i].type === TMX_LAYER_TYPES.OBJECT_GROUP) {
                        layer = new TmxObjectgroup(json_data.layers[i]);
                        this.layers.push(layer);
                    } else if (json_data.layers[i].type === TMX_LAYER_TYPES.IMAGE_LAYER) {
                        layer = new TmxImagelayer(json_data.layers[i]);
                        this.layers.push(layer);
                    }
                }
            }
        }

        public get_tileset_from_gid(gid) {
            for (var i = 0; i < this.tilesets.length; i++) {
                if (gid >= this.tilesets[i].firstgid && gid <= this.tilesets[i].lastgid) {
                    return this.tilesets[i];
                }
            }

            throw "No tilesets match that gid";
        }
    }

    export class TmxTileset {
        firstgid:number;
        lastgid:number;
        name:string;

        image:string; // name of tile image (path relative to mapfile)
        imagewidth:number; // image width in pixels
        imageheight:number;

        tilewidth:number; // Maximum width of tiles in this tileset
        tileheight:number;

        tiles_per_row:number;
        tiles_per_column:number;

        spacing:number; // Space in pixels between tiles (applies to tileset image)
        margin:number; // Margin around tiles

        tileoffset_x = 0;
        tileoffset_y = 0;

        // Can contain
        properties:any;
        terrains:TmxTerrain[];

        constructor(json_data:any) {
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

        private parse_tileset(json_data:any) {
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
        }
    }

    export class TmxLayer {
        name:string;
        x:number; // x coord in tiles (defaults to 0)
        y:number; // y coord in tiles (defaults to 0)
        width:number; // meaningless
        height:number; // meaningless
        opacity:number; // 0 to 1, defaults to 1
        visible:number; // 0 or 1, defaults to 1
        type:string;


        // Can contain
        properties:any;

        constructor(json_data) {
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

        private parse_layer(json_data) {
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
        }
    }

    export class TmxTileLayer extends TmxLayer {
        tiles:TmxTile[]; // sparse array

        constructor(json_data) {
            super(json_data);
            this.type = TMX_LAYER_TYPES.TILE_LAYER;
            this.tiles = [];

            this.parse_tilelayer(json_data);
        }

        private parse_tilelayer(json_data:any) {
            for (var i = 0; i < json_data.data.length; i++) {
                if (json_data.data[i] > 0) {
                    this.tiles[i] = new TmxTile(json_data.data[i]);
                }
            }
        }
    }

    export class TmxObjectgroup extends TmxLayer {
        objects:TmxObject[];

        constructor(json_data) {
            super(json_data);
            this.type = TMX_LAYER_TYPES.OBJECT_GROUP;
            this.objects = [];

            this.parse_objectgroup(json_data);
        }

        private parse_objectgroup(json_data:any) {
            for (var i = 0; i < json_data.objects.length; i++) {
                var object = new TmxObject(json_data.objects[i]);
                this.objects.push(object);
            }
        }
    }

    export class TmxObject {
        gid:number; // If the object is a tile, this refers to the tile
        name:string;
        type:string;
        x:number; // x coord in pixels
        y:number;
        width:number; // Width in pixels, defaults to 0
        height:number;
        rotation:number; // Rotation in degrees. Defaults to 0.
        visible:number;// defaults to 1
        shape:TMX_OBJECT_SHAPES;

        // Can contain
        properties:any;
        points:TmxPoint[]; // Only if type is polygon or polyline

        constructor(json_data) {
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

        private parse_object(json_data:any) {
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
            } else if (json_data.hasOwnProperty("polygon")) {
                this.shape = TMX_OBJECT_SHAPES.POLYGON;
                for (var i = 0; i < json_data.polygon.length; i++) {
                    this.points.push(new TmxPoint(json_data.polygon[i].x, json_data.polygon[i].y));
                }
            } else if (json_data.hasOwnProperty("polyline")) {
                this.shape = TMX_OBJECT_SHAPES.POLYLINE;
                for (var i = 0; i < json_data.polyline.length; i++) {
                    this.points.push(new TmxPoint(json_data.polyline[i].x, json_data.polyline[i].y));
                }
            } else if (json_data.hasOwnProperty("gid")) {
                this.shape = TMX_OBJECT_SHAPES.RECTANGLE;
                this.gid = json_data.gid;
            } else {
                this.shape = TMX_OBJECT_SHAPES.RECTANGLE;
            }

            if (json_data.hasOwnProperty("properties")) {
                this.properties = json_data.properties;
            }
        }
    }

    export class TmxImagelayer extends TmxLayer {
        // A layer consisting of a single image
        image:string; // image name

        constructor(json_data) {
            super(json_data);
            this.type = TMX_LAYER_TYPES.IMAGE_LAYER;
            this.image = "";

            this.parse_imagelayer(json_data);
        }

        private parse_imagelayer(json_data:any) {
            this.image = json_data.image;
        }
    }
}