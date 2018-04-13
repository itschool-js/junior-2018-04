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

    // cast(spell) {
    //     this.mana -= spell.cost;
    //     this.action = { type: ActionType.CAST, spell: spell };
    // }
}

class FireballSpell {
    constructor(mageId, xy, dir, id) {
        // TODO: implement constructor
    }

    clone() {
        // TODO: implement clone method
    }

    // get cost() { return FIREBALL_COST; }

    // get power() { return FIREBALL_POWER; } 

    // move() {
    //     this.xy = this.xy.add(this.dir);
    //     this.action = { type: ActionType.MOVE };
    // }

    // interact(cell) {
    //     if (cell === Cell.WALL) {
    //         this.action = { type: ActionType.GONE };
    //     }
    //     // } else if (cell instanceof Mage) {
    //     //     this.apply(cell);
    //     // } 
    // }

    // apply(mage) {
    //     this.action = { type: ActionType.APPLY, targetId: mage.id };
    //     mage.health -= this.power;        
    // }

    // validate(mage, level, state) {
    //     if (!this.dir || !this.dir.validate()) {
    //         return null;
    //     }
    //     let spell = new FireballSpell();
    //     spell.dir = this.dir;

    //     if (mage.mana < spell.cost) {
    //         return null;
    //     }

    //     let xy = mage.xy.add(spell.dir);
    //     let cell = level.getCell(state, xy);
    //     if (cell === Cell.WALL || cell instanceof Mage) {
    //         return null;
    //     }

    //     spell.mageId = mage.id;
    //     spell.xy = xy;        
    //     return spell;
    // }
}