///<reference path="../../lib/box2d.d.ts"/>
///<reference path="../../lib/node.d.ts"/>

///<reference path="../core/Defines.ts"/>
///<reference path="../core/Correction.ts"/>
///<reference path="../core/B2UserData.ts"/>
///<reference path="../core/PhysicsFactory.ts"/>
///<reference path="../core/ContactListener.ts"/>
///<reference path="../core/World.ts"/>
///<reference path="../core/Map.ts"/>
///<reference path="../core/TmxMap.ts"/>
///<reference path="../core/Player.ts"/>
///<reference path="../core/Item.ts"/>
///<reference path="../core/NetworkMsg.ts"/>
///<reference path="../core/NetworkConnection.ts"/>

///<reference path="ClientConnection.ts"/>
///<reference path="GameInstance.ts"/>
///<reference path="GameManager.ts"/>
///<reference path="GameServer.ts"/>

SuperGame.ENVIRONMENT = "SERVER";
exports.GameServer = SuperGame.GameServer;