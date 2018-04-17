'use strict';

class Mage {
    constructor(id, color, xy, health = MAGE_HEALTH, mana = MAGE_MANA) {
        this.id = id;
        this.color = color;
        this.xy = xy;
        this.health = health;
        this.mana = mana;
    }

    clone() {
        let mage = new Mage(this.id, this.color, this.xy.clone(), this.health, this.mana);
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
}

class FireballSpell {
    constructor(mageId, xy, dir, id) {
        let idCounter = 0;

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
        while ( plan[this.y.add(this.dir.y)][this.x.add(this.dir.x)] == Cell.EMPTY ) {
            this.xy = this.xy.add(this.dir);
            this.action = { type: ActionType.MOVE, dir: this.dir };
        }
    }

    interact(cell) {
        if (cell === Cell.WALL) {
            this.action = { type: ActionType.GONE };
        } else if (cell instanceof Mage) {
            this.apply(cell);
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
/*
class Bottle {
    constructor (xy, type) {
        this.xy = xy;
        this.type = type;
    }
    
    interact(cell) {
        if (cell instanceof Mage) {
            this.apply(cell);
            this.action = { type: ActionType.GONE };
        }
    }

    apply(mage) {
        if ( type == 'health' ) {
            mage.health += BOTTLE_HEALTH;        
        } else if ( type == 'mana') {
            mage.mana += BOTTLE_MANA;
        }
        this.action = { type: ActionType.APPLY };
    }
}*/