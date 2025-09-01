import { game } from "./game.js";

export class Vector2 {
    static toNumber = (loc) => loc.x + (loc.y-1)*game.scale[0];

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Sprite {
    constructor(symbol, color, layer) {
        this.symbol = symbol;
        this.color = color;
        this.layer = layer;
    }
}

export class GameObject {
    static objectCount = 0;
    static objects = [];

    constructor(name, sprite, location, isSolid = false) {
        this.name = name;
        this.sprite = sprite;
        this.location = location;
        this.isSolid = isSolid;

        GameObject.objectCount++;
        this.id = GameObject.objectCount;

        this.moveTo = function(loc) {
            if (loc.x < 1|| loc.x > game.scale[0]) return;
            if (loc.y < 1|| loc.y > game.scale[1]) return;

            this.location.x = loc.x;
            this.location.y = loc.y;
        };
        this.move = function(loc) {
            if (this.location.x+loc.x < 1|| this.location.x+loc.x > game.scale[0]) return;
            if (this.location.y+loc.y < 1|| this.location.y+loc.y > game.scale[1]) return;

            this.location.x += loc.x;
            this.location.y += loc.y;
        };
        this.delete = function() {
            GameObject.objects = GameObject.objects.filter(obj => obj != this);
        }
        
        GameObject.objects.push(this);
    }

    static getObjects(param) {
        if (typeof param == 'number') return this.objects.filter(obj => obj.id == param)[0];
        else if (typeof param == 'string') return this.objects.filter(obj => obj.name == param);
        else if (typeof param == 'object') return this.objects.filter(obj => obj === param);
    }    
}

export const hud = {
    post: function(message, clear = false) {
        if (!clear) document.getElementById('hud').innerHTML += '\n' + message;
        else if (clear) document.getElementById('hud').innerHTML = message;
    }
}