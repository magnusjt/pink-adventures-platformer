// Make box2d available globally
global.Box2D = require("../../lib/Box2D.js" ).Box2D;

var server_module = require("./server.js" );
server_module.GameServer.init();
