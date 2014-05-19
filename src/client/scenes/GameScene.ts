///<reference path="../_references.ts"/>
module SuperGame{
    export class GameScene extends Scene{
        stage:PIXI.Stage;
        renderer:PIXI.IPixiRenderer;
        game:Game;
        game_client:GameClient;

        constructor(element_id){
            super(element_id);

            var keyboard = new Keyboard(window);

            var $canvas_element = $("<canvas></canvas>");
            $("#game").append($canvas_element);
            this.renderer = PIXI.autoDetectRenderer(this.$element.width(), this.$element.height(), <HTMLCanvasElement>$canvas_element.get(0), false, false);
            this.stage = new PIXI.Stage(0xFFFFFF);

            this.game = new Game(this.$element.width(), this.$element.height(), this.stage, this.renderer, keyboard);
            this.game_client = new GameClient(this.game);
            this.game.set_game_client(this.game_client);
        }

        public resume(scene_messages:SceneMessage[]){
            super.resume(scene_messages);
            this.game_client.request_game_manager(0);
        }

        public resize(scene_width, scene_height){
            super.resize(scene_width, scene_height);
            this.renderer.resize(scene_width, scene_height);
            this.game.resize(scene_width, scene_height);
        }
    }
}