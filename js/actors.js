'use strict';

class Mage {
    constructor(id, teamId, color, xy, health = MAGE_HEALTH, mana = MAGE_MANA) {
        this.id = id;
        this.teamId = teamId;
        this.color = color;
        this.xy = xy;
        this.health = health;
        this.mana = mana;
    }

    clone() {
        let mage = new Mage(this.id, this.teamId, this.color, this.xy.clone(), this.health, this.mana);
        mage.action = this.action;
        return mage;
    }

    move(dir) {
        this.xy = this.xy.add(dir);
        this.action = { type: ActionType.MOVE, dir: dir };
    }

    cast(spell) {
        this.mana -= spell.cost;
        this.action = { type: ActionType.CAST, spell: spell };
    }

    interact(cell, dir) {
        if (cell instanceof Bottle) {
            let bottle = cell;
            this.move(dir);
            bottle.action = { type: ActionType.APPLY };
            if (bottle.type == HEALTH) {
                this.health += bottle.value;
            } else {
                this.mana += bottle.value;
            }
        } else {
            this.idle();
        }
    }

    idle() {
        this.action = { type: ActionType.IDLE };
    }
}

class FireballSpell {
    constructor(mageId, xy, dir, id) {
        // constructor
        this.mageId = mageId;
        this.xy = xy;
        this.dir = dir;
        if (id) {
            this.id = id;
        } else {
            this.id = ++idCounter;
            this.action = { type: ActionType.NEW };
        }
        this.color = 'yellow';
    }

    clone() {
        var spell = new FireballSpell(this.mageId, this.xy, this.dir, this.id);
        spell.action = this.action;
        return spell;
    }

    get cost() { return FIREBALL_COST; }

    get power() { return FIREBALL_POWER; }

    move() {
        // TODO: implement
        this.xy = this.xy.add(this.dir);
        this.action = { type: ActionType.MOVE };
    }

    interact(cell) {
        if (cell === Cell.WALL) {
            this.action = { type: ActionType.GONE };
        } else if (cell instanceof Mage) {
            this.apply(cell);
        } else {
            this.move(cell.xy);
        }
    }

    apply(mage) {
        this.action = { type: ActionType.APPLY, targetId: mage.id };
        mage.health -= this.power;
    }
}

// TODO: implement class Bottle which can be a bottle of health or a bottle of mana
// When a mage enters a cell with a bottle, he should drink it 
// - i.e. his health/mana changes accordingly and the bottle disappears from the game

class Bottle {
    constructor(type, value, xy, id) {
        this.type = type;
        this.value = value;
        this.xy = xy;
        if (id) {
            this.id = id;
        } else {
            this.id = ++idCounter;
            this.action = { type: ActionType.NEW };
        }
    }

    clone() {
        let bottle = new Bottle(this.type, this.value, this.xy, this.id);
        bottle.action = this.action;
        return bottle;
    }
}