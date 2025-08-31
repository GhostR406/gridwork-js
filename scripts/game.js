import { Vector2, Sprite, GameObject } from "./classes.js";
import * as events from "./events.js";
import { start } from "./game/start.js";

export const game = {
    fps: 60,
    scale: [
        15,
        10
    ]
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('grid').style.gridTemplateColumns = `repeat(${game.scale[0]}, 1fr)`;
    document.getElementById('grid').style.gridTemplateRows = 'auto';

    setInterval(() => {
        const screen = document.getElementById('grid');

        screen.innerHTML = '';
        for (let i = 1; i <= game.scale[0]*game.scale[1]; i++) {
            let sprite = new Sprite('X', 'grey', -100);

            const objs = GameObject.objects.filter(obj => obj.sprite.layer == Math.max(...GameObject.objects.filter(obj => Vector2.toNumber(obj.location) == i).map(obj => obj.sprite.layer)));
            if (objs.length > 0) sprite = objs[0].sprite;

            screen.innerHTML += `<div id="${i}" class="cell">${sprite.symbol}</div>`;
            document.getElementById(`${i}`).style.color = sprite.color;
        }
    }, Math.round(1000/game.fps))

    setInterval(() => {
        events.onCollideRegistry.forEach(collision => {
            if (typeof collision[0] == 'number') {
                if (typeof collision[1] == 'number') {
                    if (Vector2.toNumber(GameObject.getObjects(collision[0]).location) == Vector2.toNumber(GameObject.getObjects(collision[1]).location)) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'string') {
                    if (GameObject.objects.filter(obj => obj.name == collision[1]).map(obj => Vector2.toNumber(obj.location)).includes(Vector2.toNumber(GameObject.getObjects(collision[0]).location))) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'object') {
                    if (Vector2.toNumber(GameObject.getObjects(collision[0]).location) == Vector2.toNumber(collision[1].location)) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
            }
            else if (typeof collision[0] == 'string') {
                if (typeof collision[1] == 'number') {
                    if (GameObject.objects.filter(obj => obj.name == collision[0]).map(obj => Vector2.toNumber(obj.location)).includes(Vector2.toNumber(GameObject.getObjects(collision[1]).location))) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'string') {
                    let call = false;
                    for (const obj1 of GameObject.objects.filter(obj => obj.name == collision[0]).map(obj => Vector2.toNumber(obj.location))) {
                        let breakout = false;
                        for (const obj2 of GameObject.objects.filter(obj => obj.name == collision[1]).map(obj => Vector2.toNumber(obj.location))) {
                            if (obj1 == obj2) {
                                breakout = true;
                                break;
                            }
                        }
                        if (breakout) {
                            call = true;
                            break;
                        }
                    }
                    if (call) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'object') {
                    if (GameObject.objects.filter(obj => obj.name == collision[0]).map(obj => Vector2.toNumber(obj.location)).includes(Vector2.toNumber(collision[1].location))) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
            }
            else if (typeof collision[0] == 'object') {
                if (typeof collision[1] == 'number') {
                    if (Vector2.toNumber(GameObject.getObjects(collision[1]).location) == Vector2.toNumber(collision[0].location)) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'string') {
                    if (GameObject.objects.filter(obj => obj.name == collision[1]).map(obj => Vector2.toNumber(obj.location)).includes(Vector2.toNumber(collision[0].location))) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'object') {
                    if (Vector2.toNumber(collision[0].location) == Vector2.toNumber(collision[1].location)) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
            }
        })
    })

    document.addEventListener('keydown', ({key}) => {
        events.onKeyRegistery.forEach(ev => {
            if (key == ev[0] && (!ev[3] && !ev[4])) {
                ev[1]();
                ev[4] = true;
            }
            else if (key == ev[0] && ev[3]) {
                ev[1]();
            };
        })
    })
    document.addEventListener('keyup', () => {
        events.onKeyRegistery.forEach(ev => { ev[4] = false; })
    })

    document.addEventListener('contextmenu', event => event.preventDefault());
    let mousedown = false;
    let mouseInterval = -1;
    document.addEventListener('mousedown', (mouse) => {
        events.onMouseRegistry.forEach(ev => {
            if (!ev[3] && mouse.button == ev[1]) {
                ev[0]();
            }
            else if (ev[3] && mouse.button == ev[1]) {
                mousedown = true;
                mouseInterval = setInterval(() => { ev[0](); }, 1000/game.fps);
            }
        })
    })
    document.addEventListener('mouseup', (mouse) => {
        if (mouse.button != 0) return;
        events.onMouseRegistry.forEach(ev => {
            if (mousedown) {
                clearInterval(mouseInterval);
                mouseInterval = -1;
                mousedown = false;
            }
        })
    })
    
    start();
})