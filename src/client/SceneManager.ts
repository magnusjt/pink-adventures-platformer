///<reference path="_references.ts"/>
module SuperGame {
    export module SceneManager {
        var initialized = false;
        var scenes:any;
        var current_scene:Scene;
        var current_scene_id:string;
        var prev_scene_id:string;

        export function init() {
            if (initialized) {
                return;
            }

            initialized = true;
            scenes = {};
            current_scene = null;
            current_scene_id = "";
            prev_scene_id = "";
        }

        export function go_to_scene(scene_name:string, scene_messages:SceneMessage[] = [], keep_scene_stack = false) {
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

        export function create_scene(scene_id:string, SceneClass:new (scene_id) => Scene):Scene {
            if (scenes.hasOwnProperty(scene_id)) {
                return scenes[scene_id];
            }

            var scene = new SceneClass(scene_id);
            scenes[scene_id] = scene;

            return scene;
        }

        export function go_to_prev_scene(scene_messages:SceneMessage[] = [], keep_scene_stack = false) {
            go_to_scene(prev_scene_id, scene_messages, keep_scene_stack);
        }
    }
}