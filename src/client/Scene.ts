///<reference path="_references.ts"/>
module SuperGame {
    export class Scene {
        public $element:JQuery;
        public paused:boolean = true;

        constructor(element_id) {
            this.$element = $("#" + element_id);


            $(window).resize(() => {
                this.resize(this.$element.width(), this.$element.height());
            });
        }

        public pause() {
            this.paused = true;
            this.$element.hide();
        }

        // On resume or start of a scene
        public resume(scene_messages:SceneMessage[]) {
            this.paused = false;
            this.$element.show();
        }

        public is_paused() {
            return this.paused;
        }

        public resize(scene_width, scene_height){

        }
    }
}