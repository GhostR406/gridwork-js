export let onKeyRegistery = [];
export const onKey = {
    id: 0,
    subscribe: function(key, func, hold = true) {
        this.id++;
        onKeyRegistery.push([key, func, this.id, hold, false]);
        return this.id;
    },
    unsubscribe: function(id) { onKeyRegistery = onKeyRegistery.filter(ev => ev[2] != id) }
}

export let onMouseRegistry = [];
export const onMouse = {
    id: 0,
    subscribe: function(func, button = left, hold = true) {
        this.id++;
        onMouseRegistry.push([func, button == 'left' ? 0 : 2, this.id, hold]);
        return this.id;
    },
    unsubscribe: function(id) { onMouseRegistry = onMouseRegistry.filter(ev => ev[1] != id) }
}

export let onCollideRegistry = [];
export const onCollide = {
    id: 0,
    subscribe: function(obj1, obj2, func, once = false) {
        this.id++;
        onCollideRegistry.push([obj1, obj2, func, this.id, once, false]);
        return this.id;
    },
    unsubscribe: function(id) { onCollideRegistry = onCollideRegistry.filter(ev => ev[2] != id) }
}