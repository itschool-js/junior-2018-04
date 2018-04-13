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
    // TODO: implement cloneArray
}

/**
 * Search for the item in array by its id.
 * Returns the item if found, or null otherwise.
 * @param {Array} arr 
 * @param {String} id 
 */
function getItemById(arr, id) {
    // TODO: implement getItemById
}