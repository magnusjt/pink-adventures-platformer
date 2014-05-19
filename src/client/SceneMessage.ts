///<reference path="_references.ts"/>
module SuperGame {
    export class SceneMessage {
        type:string;
        content:any;

        constructor(type, content) {
            this.type = type;
            this.content = content;
        }
    }
}