///<reference path="_references.ts"/>
module SuperGame {
    export class Camera {
        // The width and height of the camera
        // These say how many pixels the camera should show
        private camera_width:number;
        private camera_height:number;

        // How large is the screen at the moment?
        private viewport_width:number;
        private viewport_height:number;

        // Coordinates of the camera in world space
        private x:number;
        private y:number;

        // The screen will need to be scaled so
        // that the entire camera can be fitted inside.
        // This is the scale factor that is needed.
        private scale:number;
        private meters_per_viewport_height:number = 12;

        // Focus box size.
        // The camera will only move if the coordinates go outside the box.
        // This avoids excessive camera movement
        private box_x:number;
        private box_y:number;
        private box_width:number;
        private box_height:number;

        // Display object. Could be used in case
        // we needed a "HUD" or sprites that don't move
        // with the world
        display_container:PIXI.DisplayObjectContainer;

        constructor(viewport_width:number, viewport_height:number) {
            this.viewport_width = viewport_width;
            this.viewport_height = viewport_height;

            this.set_variables();

            this.display_container = new PIXI.DisplayObjectContainer();
        }

        private set_variables() {
            this.camera_width = this.viewport_width;
            this.camera_height = this.viewport_height;
            this.box_width = this.camera_width * 0.2;
            this.box_height = this.camera_height * 0.2;
            this.x = 0;
            this.y = 0;
            this.box_x = 0;
            this.box_y = 0;
            this.scale = 1;
        }

        reset() {
            this.set_variables();

            while (this.display_container.children.length > 0) {
                this.display_container.removeChild(this.display_container.children[0]);
            }
        }

        /**
         * Returns the amount of shift needed in x and y direction
         * for coordinates in rect to be visible inside camera, and centered.
         *
         * Normally, you can just set the position of the display object
         * to the shift coordinates in order to move it "inside" the camera.
         * This is because normally every display object share 0,0 as the top left.
         *
         * NB: The shift is relative to coordinates 0,0.
         *
         * NB: The shift algo uses the world width/height to ensure
         *     that the camera never shows anything outside of the rect.
         */
        public get_world_shift(world_width, world_height) {
            // Helper variables used since we always want the camera
            // centered on the coordinates
            var camera_half_width = this.camera_width / 2;
            var camera_half_height = this.camera_height / 2;

            // Clamp to rect boundaries if the camera would cross the boundaries.
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

            // Create the shift to camera coordinates.
            // Remember the coordinates this.x and this.y is in world space.
            var shift_x = -1 * this.x;
            var shift_y = -1 * this.y;

            // Further shift so the coordinates are in
            // the center of the camera
            shift_x += camera_half_width;
            shift_y += camera_half_height;

            // In case the world is smaller than the screen, ensure that the world is centered on the screen
            if (world_width < this.camera_width) {
                shift_x -= (this.camera_width - world_width) / 2;
            }
            if (world_height < this.camera_height) {
                shift_y -= (this.camera_height - world_height) / 2;
            }

            return {x: shift_x, y: shift_y};
        }

        public get_world_scale() {
            return this.scale;
        }

        public resize(viewport_width:number, viewport_height:number, pixels_per_meter:number) {
            this.viewport_width = viewport_width;
            this.viewport_height = viewport_height;
            this.scale = (viewport_height / pixels_per_meter) / this.meters_per_viewport_height;

            this.camera_width = this.viewport_width/this.scale;
            this.camera_height = this.viewport_height/this.scale;
            this.box_width = this.camera_width*0.2;
            this.box_height = this.camera_height*0.2;
        }

        /**
         * Sets camera coordinates in world space
         */
        public set_position(x:number, y:number) {
            // The camera position should always be set
            // to the center of the focus box
            // The focus box only moves if the coordinates exceed the box

            if (x < this.box_x) {
                this.box_x = x;
            } else if (x > this.box_x + this.box_width) {
                this.box_x = x - this.box_width;
            }

            if (y < this.box_y) {
                this.box_y = y;
            } else if (y > this.box_y + this.box_height) {
                this.box_y = y - this.box_height;
            }

            // Set coordinates to center of focus box
            this.x = this.box_x + this.box_width / 2;
            this.y = this.box_y + this.box_height / 2;
        }
    }
}
