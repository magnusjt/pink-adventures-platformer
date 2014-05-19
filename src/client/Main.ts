///<reference path="_references.ts"/>
module SuperGame {
    export class Main {
        constructor() {
            SceneManager.init();
            SceneManager.create_scene("loading", SuperGame.LoadingScene);
            SceneManager.create_scene("game", SuperGame.GameScene);
            SceneManager.go_to_scene("loading");
        }
    }
}

// Use load function to wait for everything including fonts
$(window).load(function(){
    new SuperGame.Main();
});