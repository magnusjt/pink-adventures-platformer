# Pinl adventures!

See http://magnustovslid.com/projects/supergame

This is a networked platformer I made back in 2014. To my great amusement I got it running again, so I'm posting it here on github.

Sadly, it's not nearly finished. I think it's because I got bogged down in trying to make the networking aspect smooth. Oh well, maybe I'll pick it back up some day.

## How to run
- Run npm install
- Navigate to src/server and run node ./start
- Go to your browser and open http://localhost:3000. You'll need to open two browser windows to start a game (or you can play on two computers)
- I think there is something like a 10 second timeout for match making, so open the browser windows quickly :P

## How to build
- Back in 2014 grunt was all the rage, so that's what I used. Checkout the gruntfile
- The typescript version seems to be quite old. The code probably needs to be updated to newer versions of typescript if you want to build it

## Features
- Double jump
- Box collisions
- Able to pick up stuff
- There was sound, but now I think the browsers are more strict, so it doesn't seem to work :(
- Networking! Using websockets. There is a central server that coordinates. Clients send intents, and server sends position data.
  The client's perform corrections.
- Maps: The tiled map-editor was used to make maps. Checkout assets
- Physics: Box2D
- Graphics: Pixi.js / webgl

## Licenses
I believe all the assets in the assets folder have some kind of open license. Check those out.
If there's something you feel should be taken down, let me know.