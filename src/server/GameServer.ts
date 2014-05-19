///<reference path="_references.ts"/>
module SuperGame {
    export module GameServer {
        var connect = require('connect');
        var socketio = require('socket.io');
        var io;
        var game_managers_by_id:GameManager[] = [];
        var garbage_collect_interval_ms = 1000;

        export function init() {
            // Start http server for static files
            var s = connect().use(connect.static('../../')).listen(80);

            // Start socket io server, listening on the http server
            io = socketio.listen(s);
            io.set("log level", 1);

            set_listeners();
            garbage_collect();
        }
        //Do the hax in the lax maaaaiiin
        function set_listeners() {
            io.sockets.on('connection', function (socket) {
                socket.emit('nm', [new NetworkMsg(NM_TYPES.SO_CONNECTED)]);

                socket.on('request_game_manager', function(data){
                    if(game_managers_by_id[data.id] === undefined){
                        game_managers_by_id[data.id] = new GameManager(data);
                    }

                    game_managers_by_id[data.id].add_connection(socket);
                });


            });
        }

        function garbage_collect(){
            for(var i in game_managers_by_id){
                if(game_managers_by_id.hasOwnProperty(i)){
                    if(game_managers_by_id[i].state == GAME_MANAGER_STATE.FINISHED){
                        console.log("Garbage collecting game manager");
                        game_managers_by_id[i].destroy();
                        delete game_managers_by_id[i];
                    }
                }
            }

            setTimeout(garbage_collect, garbage_collect_interval_ms);
        }
    }
}
