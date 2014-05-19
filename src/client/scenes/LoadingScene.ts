///<reference path="../_references.ts"/>
module SuperGame{
    export class LoadingScene extends Scene{
        constructor(element_id){
            super(element_id);
            this.$element.append("<div id='loading_text'></div>");
        }

        public resume(scene_messages:SceneMessage[]){
            super.resume(scene_messages);
            this.load_graphics();
        }

        private set_loading_text(text) {
            $("#loading_text").html(text);
        }

        private remove_loading_text() {
            $("#loading_text").remove();
        }

        private load_graphics() {
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
            loader.onProgress = () => {
                files_loaded++;
                this.set_loading_text("Loading graphics (" + files_loaded + "/" + n_files + ")");
            };

            loader.onComplete = () => {
                this.load_sounds()
            };
            loader.load();
        }

        private load_sounds() {
            this.set_loading_text("Loading sounds");

            var sounds = [
                {src: "assets/button_sounds/button-1.wav", id: SoundManager.SOUND_IDS.BUTTON_1},
                {src: "assets/button_sounds/button-2.wav", id: SoundManager.SOUND_IDS.BUTTON_2},
                {src: "assets/button_sounds/button-3.wav", id: SoundManager.SOUND_IDS.BUTTON_3},
                {src: "assets/button_sounds/button-4.wav", id: SoundManager.SOUND_IDS.BUTTON_4},
                {src: "assets/button_sounds/button-5.wav", id: SoundManager.SOUND_IDS.BUTTON_5},
                {src: "assets/button_sounds/button-6.wav", id: SoundManager.SOUND_IDS.BUTTON_6},
                {src: "assets/button_sounds/button-7.wav", id: SoundManager.SOUND_IDS.BUTTON_7},
                {src: "assets/button_sounds/button-8.wav", id: SoundManager.SOUND_IDS.BUTTON_8},
                {src: "assets/sounds/rain-on-my-buds74bpm.mp3", id: SoundManager.SOUND_IDS.PAUSE_1},
                {src: "assets/sounds/dodgy-c__dodgy-c-hip-hop-rockgod-beatz.mp3", id: SoundManager.SOUND_IDS.MENUS_1}
            ];

            var n_sounds = sounds.length;
            var sounds_loaded = 0;

            SoundManager.init(sounds, () => {
                this.loading_done()
            }, () => {
                sounds_loaded++;
                this.set_loading_text("Loading sounds (" + sounds_loaded + "/" + n_sounds + ")");
            });
        }

        private loading_done() {
            SceneManager.go_to_scene("game");
        }
    }
}