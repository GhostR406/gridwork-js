import { Vector2, Sprite, GameObject, Room, hud } from "../classes.js";
import { game } from "../game.js";
import * as events from "../events.js";

export function start() {
    const player = new GameObject('player', new Sprite('0', 'lime', 0), new Vector2(3, 1), game.room.id);
    player.health = { current: 10, max: 10 };

    events.onKey.subscribe('w', () => {
        player.move(new Vector2(0, -1));
    }, false)
    events.onKey.subscribe('a', () => {
        player.move(new Vector2(-1, 0));
    }, false)
    events.onKey.subscribe('s', () => {
        player.move(new Vector2(0, 1));
    }, false)
    events.onKey.subscribe('d', () => {
        player.move(new Vector2(1, 0));
    }, false)

    events.onKey.subscribe('Escape', () => {
        if (game.paused) {
            game.resume();
            hud.post(`HEALTH: ${player.health.current} / ${player.health.max}`, true);
        }
        else {
            game.pause();
            hud.post(`[ PAUSED ]`, true);
        }
    }, false, true)

    events.onCollide.clear();
    events.onCollide.subscribe(player, 'trapdoor', () => {
        if (!Room.getRoom(1)) {
            new Room('a', loopBack, () => {}, { width: 10, height: 10 });
        }

        if (game.room.id == 0) {
            game.room = Room.getRoom(1);
            Room.getRoom(1).objects = [];
        } else if (game.room.id == 1) {
            game.room = Room.getRoom(0);
            Room.getRoom(0).objects = [];
        }
    }, true)

    hud.post(`HEALTH: ${player.health.current} / ${player.health.max}`, true);

    for (let i = 1; i <= 20; i++) {
        if (i == player.location.toNumber()) continue;

        if (Math.random() > 0.5) new GameObject('wall', new Sprite('#', 'lightgray', 1), new Vector2(Math.ceil(Math.random()*game.room.scale.width), Math.ceil(Math.random()*game.room.scale.height)), game.room.id, true)
        else new GameObject('trapdoor', new Sprite('@', 'lightgray', 1), new Vector2(Math.ceil(Math.random()*game.room.scale.width), Math.ceil(Math.random()*game.room.scale.height)), game.room.id)
    }
}

function loopBack(room) {
    start();
}