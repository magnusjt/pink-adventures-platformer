///<reference path="_references.ts"/>
module SuperGame {
    export enum KEY_CODES {
        BACKSPACE = 8,
        ENTER = 13,
        SHIFT = 16,
        CTRL = 17,
        ALT = 18, // Also alt gr
        CAPSLOCK = 20,
        ESC = 27,
        DELETE = 46,
        SPACE = 32,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 76,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        ZERO = 48,
        ONE = 49,
        TWO = 50,
        THREE = 51,
        FOUR = 52,
        FIVE = 53,
        SIX = 54,
        SEVEN = 55,
        EIGHT = 56,
        NINE = 57,
    }

    export class Keyboard {
        keystates:boolean[];
        keydown_callbacks:{};
        keyup_callbacks:{};

        constructor(elem) {
            this.keydown_callbacks = {};
            this.keyup_callbacks = {};
            this.keystates = [];

            for (var i = 0; i < 256; i++) {
                this.keystates.push(false);
            }

            this.listen(elem);
        }

        listen(elem) {
            $(elem).keydown((e:JQueryKeyEventObject) => {
                //e.preventDefault();
                this.keystates[e.which] = true;
                if(this.keydown_callbacks[e.which] !== undefined){
                    $.each(this.keydown_callbacks[e.which], function (key, f) {
                        f();
                    });
                }
            });

            $(elem).keyup((e:JQueryKeyEventObject) => {
                //e.preventDefault();
                this.keystates[e.which] = false;
                if(this.keyup_callbacks[e.which] !== undefined){
                    $.each(this.keyup_callbacks[e.which], function (key, f) {
                        f();
                    });
                }
            });
        }

        on_keydown(keycode:KEY_CODES, f:() => void) {
            if(this.keydown_callbacks[keycode] === undefined){
                this.keydown_callbacks[keycode] = [];
            }
            this.keydown_callbacks[keycode].push(f);
        }

        on_keyup(keycode:KEY_CODES, f:() => void) {
            if(this.keyup_callbacks[keycode] === undefined){
                this.keyup_callbacks[keycode] = [];
            }
            this.keyup_callbacks[keycode].push(f);
        }

        /**
         * Check if a certain keycode is currently pressed
         */
        key_is_pressed(keycode:number) {
            return this.keystates[keycode];
        }
    }
}