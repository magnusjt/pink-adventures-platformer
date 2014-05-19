///<reference path="_references.ts"/>
module SuperGame {
    export class World {
        private pixels_per_meter:number = 70;
        private width:number = 0;
        private height:number = 0;
        private gravity_y:number = 30;
        private gravity_x:number = 0;
        private shift_x:number = 0;
        private shift_y:number = 0;

        public display_world:PIXI.DisplayObjectContainer;
        public physics_world:Box2D.Dynamics.b2World;

        public players:Player[];
        public items:Item[];
        private players_scheduled_for_removal:Player[];
        private items_scheduled_for_removal:Item[];

        private debug_canvas:HTMLCanvasElement = null;

        constructor() {
            if(ENVIRONMENT == "CLIENT"){
                this.display_world = new PIXI.DisplayObjectContainer();
            }

            this.physics_world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(this.gravity_x, this.gravity_y), false);
            var contact_listener = new ContactListener();
            this.physics_world.SetContactListener(contact_listener);

            this.players = [];
            this.items = [];
            this.players_scheduled_for_removal = [];
            this.items_scheduled_for_removal = [];
        }

        get_width() {
            return this.width;
        }

        get_height() {
            return this.height;
        }

        get_pixels_per_meter() {
            return this.pixels_per_meter;
        }

        get_gravity_x() {
            return this.gravity_x;
        }

        get_gravity_y() {
            return this.gravity_y;
        }

        set_width(width) {
            this.width = width;
        }

        set_height(height) {
            this.height = height;
        }

        set_pixels_per_meter(pixels_per_meter) {
            this.pixels_per_meter = pixels_per_meter;
        }

        set_gravity_x(gravity_x) {
            this.gravity_x = gravity_x;
            this.physics_world.SetGravity(new Box2D.Common.Math.b2Vec2(this.gravity_x, this.gravity_y));
        }

        set_gravity_y(gravity_y) {
            this.gravity_y = gravity_y;
            this.physics_world.SetGravity(new Box2D.Common.Math.b2Vec2(this.gravity_x, this.gravity_y));
        }

        reset() {
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
        }

        destroy_item(item:Item) {
            this.items_scheduled_for_removal.push(item);
        }

        destroy_player(player:Player) {
            this.players_scheduled_for_removal.push(player);
        }

        do_scheduled_removals() {
            // Remove items
            for (var i = 0; i < this.items_scheduled_for_removal.length; i++) {
                var item = this.items_scheduled_for_removal[i];
                item.remove_from_world();
                var index = this.items.indexOf(item);
                this.items.splice(index, 1);
            }

            this.items_scheduled_for_removal = [];

            // Same for players
            for (var i = 0; i < this.players_scheduled_for_removal.length; i++) {
                var player = this.players_scheduled_for_removal[i];
                player.remove_from_world();
                var index = this.players.indexOf(player);
                this.players.splice(index, 1);
            }

            this.players_scheduled_for_removal = [];

        }

        set_shift(shift_x, shift_y) {
            this.shift_x = shift_x;
            this.shift_y = shift_y;

            this.display_world.position.x = this.shift_x;
            this.display_world.position.y = this.shift_y;
        }

        update_state(millisecondspassed:number) {
            this.do_scheduled_removals();

            for (var i = 0; i < this.players.length; i++) {
                this.players[i].update(millisecondspassed);
            }

            for (var i = 0; i < this.items.length; i++) {
                this.items[i].update(millisecondspassed);
            }
        }

        step(millisecondspassed:number) {
            this.physics_world.Step(millisecondspassed / 1000, 10, 10);
            this.physics_world.ClearForces();
        }

        draw_debug_data(scale) {
            if(ENVIRONMENT != "CLIENT") return;

            // http://stackoverflow.com/questions/15733535/how-to-change-position-of-debug-draw-visualization-of-box2d-js
            // Also need to scale the debug canvas if necessary

            var debug_canvas = this.get_debug_canvas();
            var debug_canvas_context = <CanvasRenderingContext2D>debug_canvas.getContext("2d");

            debug_canvas_context.save();
            debug_canvas_context.clearRect(0, 0, debug_canvas.width, debug_canvas.height);
            debug_canvas_context.translate(this.shift_x * scale, this.shift_y * scale);
            debug_canvas_context.scale(scale, scale);
            this.physics_world.DrawDebugData();
            debug_canvas_context.restore();
        }

        private get_debug_canvas() {
            if(ENVIRONMENT != "CLIENT") return;
            if (this.debug_canvas !== null) return this.debug_canvas;

            this.debug_canvas = document.createElement("canvas");
            this.debug_canvas.setAttribute("id", "debug-canvas");
            document.body.appendChild(this.debug_canvas);
            var debug_renderer = new PIXI.CanvasRenderer($(window).width(), $(window).height(), this.debug_canvas, true);

            $(window).resize(() => {
                debug_renderer.resize($(window).width(), $(window).height());
            });

            var debug_canvas_context = <CanvasRenderingContext2D>this.debug_canvas.getContext("2d");
            var debugDraw = new Box2D.Dynamics.b2DebugDraw();
            debugDraw.SetSprite(debug_canvas_context);
            debugDraw.SetDrawScale(this.pixels_per_meter);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
            this.physics_world.SetDebugDraw(debugDraw);

            return this.debug_canvas;
        }
    }
}