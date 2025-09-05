export let onKeyRegistery = [];
export const onKey = {
    id: 0,
    subscribe: function(key, func, hold = true, unpauseable = false) {
        this.id++;
        onKeyRegistery.push([key, func, this.id, hold, false, unpauseable]);
        return this.id;
    },
    unsubscribe: function(id) { onKeyRegistery = onKeyRegistery.filter(ev => ev[2] != id) }
}

export let onMouseRegistry = [];
export const onMouse = {
    id: 0,
    subscribe: function(func, button = left, hold = true, unpauseable = false) {
        this.id++;
        onMouseRegistry.push([func, button == 'left' ? 0 : 2, this.id, hold, unpauseable]);
        return this.id;
    },
    unsubscribe: function(id) { onMouseRegistry = onMouseRegistry.filter(ev => ev[2] != id) }
}

export let onClickRegistry = [];
export const onClick = {
    id: 0,
    subscribe: function(obj, func) {
        this.id++;
        onClickRegistry.push([obj, func, this.id]);
        return this.id;
    },
    unsubscribe: function(id) { onClickRegistry = onClickRegistry.filter(ev => ev[2] != id) }
}

export let onCollideRegistry = [];
export const onCollide = {
    id: 0,
    subscribe: function(obj1, obj2, func, once = false) {
        this.id++;
        onCollideRegistry.push([obj1, obj2, func, this.id, once, false]);
        return this.id;
    },
    unsubscribe: function(id) { onCollideRegistry = onCollideRegistry.filter(ev => ev[3] != id) },
    clear: function() { onCollideRegistry = [] }
}