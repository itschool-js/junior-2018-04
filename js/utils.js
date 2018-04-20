'use strict';

class XY {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }

    clone() {
        return new XY(this.x, this.y);
    }

    add(xy) {
        return new XY(this.x + xy.x, this.y + xy.y);
    }
}

class Direction extends XY {
    validate() {
        return Math.abs(this.x) <= 1 && Math.abs(this.y) <= 1 && !(this.x == 0 && this.y == 0);
    }
}

/**
 * Deep clone of array, i.e. newArray[i] is a clone of arr[i]
 * @param {Array} arr 
 */
function cloneArray(arr) {
    let newArr = [];
    for (let x of arr) {
        newArr.push('clone' in x ? x.clone() : x);
    }
    return newArr;
}


/**
 * Search for the item in array by its id.
 * Returns the item if found, or null otherwise.
 * @param {Array} arr 
 * @param {String} id 
 */
function getItemById(arr, id) {
    for (let x of arr) {
        if (x.id === id) {
            return x;
        }
    }
    return null;    
}

/**
 * Shuffles array in place. ES6 version (taken from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}