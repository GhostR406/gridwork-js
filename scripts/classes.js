import { game } from "./game.js";

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.toNumber = function(width = game.room.scale.width) {
            return this.x + (this.y - 1) * width;
        }
    }
}

export class Sprite {
    constructor(symbol, color, layer) {
        this.symbol = symbol;
        this.color = color;
        this.layer = layer;
    }
}

export class Room {
    static rooms = [];
    static getRoom(id) {
        return Room.rooms.find(room => room.id == id);
    }

    constructor(name, onEnter, onExit, scale = {width: 15, height: 10}) {
        this.name = name;
        this.onEnter = onEnter;
        this.onExit = onExit;
        this.scale = scale;

        this.objects = [];

        this.id = Room.rooms.length;

        Room.rooms.push(this);
    }
}

export class GameObject {
    static objects = [];
    static objectCount = 0;

    constructor(name, sprite, location, roomID = game.room.id, isSolid = false) {
        const room = Room.getRoom(roomID);
        if (!room) return;

        this.name = name;
        this.sprite = sprite;
        this.location = location;
        this.isSolid = isSolid;

        GameObject.objectCount++;
        this.id = GameObject.objectCount;

        this.moveTo = (loc) => {
            if (loc.x < 1 || loc.x > room.scale.width) return;
            if (loc.y < 1 || loc.y > room.scale.height) return;

            const newPos = loc.toNumber(room.scale.width);
            if (room.objects.some(obj => obj.isSolid && obj !== this && posOf(obj, room) === newPos)) {
                return;
            }

            this.location = loc;
        };

        this.move = (delta) => {
            const moveTo = new Vector2(this.location.x + delta.x, this.location.y + delta.y);
            this.moveTo(moveTo);
        };

        this.delete = () => {
            room.objects = room.objects.filter(obj => obj !== this);
            GameObject.objects = GameObject.objects.filter(obj => obj !== this);
        };

        room.objects.push(this);
        GameObject.objects.push(this);
    }

    static getObjects(param) {
        const objs = game.room.objects;
        if (typeof param === 'number') return objs.find(obj => obj.id === param);
        else if (typeof param === 'string') return objs.filter(obj => obj.name === param);
        else if (typeof param === 'object') return objs.find(obj => obj === param);
        return null;
    }
}

export const hud = {
    post: function(message, clear = false) {
        if (!clear) document.getElementById('hud').innerHTML += '\n' + message;
        else if (clear) document.getElementById('hud').innerHTML = message;
    }
}

export function posOf(obj, room) {
    return obj.location.toNumber(room.scale.width);
}