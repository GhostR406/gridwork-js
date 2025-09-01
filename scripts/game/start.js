import { Vector2, Sprite, GameObject, hud } from "../classes.js";
import * as events from "../events.js";

export function start() {
    const player = new GameObject('player', new Sprite('0', 'lime', 0), new Vector2(3, 1));
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

    hud.post(`HEALTH: ${player.health.current} / ${player.health.max}`, true);

    for (let i = 1; i <= 20; i++) {
        new GameObject('wall', new Sprite('#', 'lightgray', 1), new Vector2(Math.ceil(Math.random()*15), Math.ceil(Math.random()*10)), true)
    }
}