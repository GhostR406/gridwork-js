import { Vector2, Sprite, GameObject } from "./classes.js";
import * as events from "./events.js";
import { start } from "./game/start.js";

export const game = {
    fps: 60,
    scale: [
        15,
        10
    ],
    paused: false,
    pause: () => { game.paused = true; },
    resume: () => { game.paused = false; }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('grid').style.gridTemplateColumns = `repeat(${game.scale[0]}, 1fr)`;
    document.getElementById('grid').style.gridTemplateRows = 'auto';

    const screen = document.getElementById('grid');
    
    for (let i = 1; i <= game.scale[0]*game.scale[1]; i++) {
        screen.insertAdjacentHTML("beforeend", `<div class="cell" id="${i}"></div>`);

        document.getElementById(`${i}`).addEventListener('click', () => {
            events.onClickRegistry.forEach(ev => {
                if (typeof ev[0] == 'number') {
                    if (i == GameObject.getObjects(ev[0]).location.toNumber()) ev[1]();
                }
                else if (typeof ev[0] == 'string') {
                    if (GameObject.getObjects(ev[0]).map(obj => obj.location.toNumber()).includes(i)) ev[1]();
                }
                else if (ev[0].x != undefined && ev[0].y != undefined) {
                    if (i == ev[0].toNumber()) ev[1]();
                }
                else if (typeof ev[0] == 'object') {
                    if (i == ev[0].location.toNumber()) ev[1]();
                }
            })
        })
    }

    setInterval(() => {
        const width = game.scale[0];
        const total = width * game.scale[1];

        // clear to default
        for (let i = 1; i <= total; i++) {
            const cell = document.getElementById(String(i));
            cell.textContent = 'X';
            cell.style.color = 'grey';
        }

        // choose top object per cell
        const topByIndex = new Map(); // index -> obj
        for (const obj of GameObject.objects) {
            const idx = obj.location.toNumber(width);
            const cur = topByIndex.get(idx);
            if (!cur || obj.sprite.layer > cur.sprite.layer) {
            topByIndex.set(idx, obj);
            }
        }

        // draw them
        for (const [idx, obj] of topByIndex) {
            const cell = document.getElementById(String(idx));
            cell.textContent = obj.sprite.symbol;
            cell.style.color = obj.sprite.color;
        }
    }, 1000/game.fps)

    setInterval(() => {
        if (game.paused) return;
        
        events.onCollideRegistry.forEach(collision => {
            if (typeof collision[0] == 'number') {
                if (typeof collision[1] == 'number') {
                    if (GameObject.getObjects(collision[0]).location.toNumber() == GameObject.getObjects(collision[1]).location.toNumber()) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'string') {
                    if (GameObject.objects.filter(obj => obj.name == collision[1]).map(obj => obj.location.toNumber()).includes(GameObject.getObjects(collision[0]).location.toNumber())) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'object') {
                    if (GameObject.getObjects(collision[0]).location.toNumber() == collision[1].location.toNumber()) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
            }
            else if (typeof collision[0] == 'string') {
                if (typeof collision[1] == 'number') {
                    if (GameObject.objects.filter(obj => obj.name == collision[0]).map(obj => obj.location.toNumber()).includes(GameObject.getObjects(collision[1]).location.toNumber())) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'string') {
                    let call = false;
                    for (const obj1 of GameObject.objects.filter(obj => obj.name == collision[0]).map(obj => obj.location.toNumber())) {
                        let breakout = false;
                        for (const obj2 of GameObject.objects.filter(obj => obj.name == collision[1]).map(obj => obj.location.toNumber())) {
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
                    if (GameObject.objects.filter(obj => obj.name == collision[0]).map(obj => obj.location.toNumber()).includes(collision[1].location.toNumber())) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
            }
            else if (typeof collision[0] == 'object') {
                if (typeof collision[1] == 'number') {
                    if (GameObject.getObjects(collision[1]).location.toNumber() == collision[0].location.toNumber()) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'string') {
                    if (GameObject.objects.filter(obj => obj.name == collision[1]).map(obj => obj.location.toNumber()).includes(collision[0].location.toNumber())) {
                        if (collision[4] && collision[5]) return;
                        collision[2]();
                        collision[5] = true;
                    }
                    else if (collision[4] && collision[5]) collision[5] = false;
                }
                else if (typeof collision[1] == 'object') {
                    if (collision[0].location.toNumber() == collision[1].location.toNumber()) {
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
            if (game.paused && !ev[5]) return;

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
            if (game.paused && !ev[4]) return;

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