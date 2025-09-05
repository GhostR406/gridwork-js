import { Vector2, Sprite, GameObject, Room, posOf } from "./classes.js";
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

let roomID = -1;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('grid').style.gridTemplateColumns = `repeat(${game.scale[0]}, 1fr)`;
    document.getElementById('grid').style.gridTemplateRows = 'auto';

    const screen = document.getElementById('grid');
    
    for (let i = 1; i <= game.scale[0]*game.scale[1]; i++) {
        screen.insertAdjacentHTML("beforeend", `<div class="cell" id="${i}"></div>`);

        document.getElementById(`${i}`).addEventListener('click', () => {
            events.onClickRegistry.forEach(ev => {
                if (typeof ev[0] == 'number') {
                    if (i == GameObject.getObjects(ev[0]).location.toNumber(room.scale.width)) ev[1]();
                }
                else if (typeof ev[0] == 'string') {
                    if (GameObject.getObjects(ev[0]).map(obj => obj.location.toNumber(room.scale.width)).includes(i)) ev[1]();
                }
                else if (ev[0].x != undefined && ev[0].y != undefined) {
                    if (i == ev[0].toNumber(room.scale.width)) ev[1]();
                }
                else if (typeof ev[0] == 'object') {
                    if (i == ev[0].location.toNumber(room.scale.width)) ev[1]();
                }
            })
        })
    }

    setInterval(() => {
        const room = game.room;
        if (!room) return;

        if (room.id !== roomID) {
            game.scale[0] = room.scale.width;
            game.scale[1] = room.scale.height;

            if (roomID >= 0) Room.getRoom(roomID).onExit();
            roomID = room.id;

            const grid = document.getElementById('grid');
            grid.innerHTML = "";
            grid.style.gridTemplateColumns = `repeat(${room.scale.width}, 1fr)`;
            grid.style.gridTemplateRows = `repeat(${room.scale.height}, 1fr)`;

            for (let i = 1; i <= room.scale.width * room.scale.height; i++) {
                grid.insertAdjacentHTML("beforeend", `<div class="cell" id="${i}"></div>`);
            }

            room.onEnter();
        }

        const width = room.scale.width;
        const total = width * room.scale.height;

        for (let i = 1; i <= total; i++) {
            const cell = document.getElementById(String(i));
            cell.textContent = 'X';
            cell.style.color = 'grey';
        }

        const topByIndex = new Map();
        for (const obj of room.objects) {
        const idx = posOf(obj, room);
        const cur = topByIndex.get(idx);
        if (!cur || obj.sprite.layer > cur.sprite.layer) {
            topByIndex.set(idx, obj);
        }
    }

        for (const [idx, obj] of topByIndex) {
            const cell = document.getElementById(String(idx));
            cell.textContent = obj.sprite.symbol;
            cell.style.color = obj.sprite.color;
        }
    }, 1000 / game.fps);

    setInterval(() => {
        if (game.paused || !game.room) return;
        const room = game.room;
        const width = room.scale.width;

        const posOf = obj => obj.location.toNumber(width);

        const positionsOfName = name =>
            room.objects.filter(obj => obj.name === name).map(obj => posOf(obj, room));

        events.onCollideRegistry.forEach(collision => {
            let [a, b, callback, , once, triggered] = collision;
            let call = false;

            if (typeof a === "number") {
                const objA = GameObject.getObjects(a);
                if (!objA) return;

                if (typeof b === "number") {
                    const objB = GameObject.getObjects(b);
                    if (objB && posOf(objA, room) === posOf(objB, room)) call = true;

                } else if (typeof b === "string") {
                    if (positionsOfName(b).includes(posOf(objA, room))) call = true;

                } else if (b?.location) {
                    if (posOf(objA, room) === posOf(b, room)) call = true;
                }

            } else if (typeof a === "string") {
                const objsA = positionsOfName(a);

                if (typeof b === "number") {
                    const objB = GameObject.getObjects(b);
                    if (objB && objsA.includes(posOf(objB, room))) call = true;

                } else if (typeof b === "string") {
                    const objsB = positionsOfName(b);
                    if (objsA.some(idx => objsB.includes(idx))) call = true;

                } else if (b?.location) {
                    if (objsA.includes(posOf(b, room))) call = true;
                }

            } else if (a?.location) {
                const idxA = posOf(a, room);

                if (typeof b === "number") {
                    const objB = GameObject.getObjects(b);
                    if (objB && idxA === posOf(objB, room)) call = true;

                } else if (typeof b === "string") {
                    if (positionsOfName(b).includes(idxA)) call = true;

                } else if (b?.location) {
                    if (idxA === posOf(b, room)) call = true;
                }
            }

            if (call) {
                if (once && triggered) return;
                callback();
                collision[5] = true;
            } else if (once && triggered) {
                collision[5] = false;
            }

            

        });
    }, 1000 / game.fps);

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
    
    game.room = new Room('main', () => { start(); }, () => {}, { width: 15, height: 10})
})