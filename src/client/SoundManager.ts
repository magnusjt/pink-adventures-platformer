///<reference path="_references.ts"/>
module SuperGame {
    export module SoundManager {
        var initialized = false;

        export var SOUND_IDS = {
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

        export function init(sounds:{src:string;id:string;
        }[], callback_loaded, callback_progress) {
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
    }
}