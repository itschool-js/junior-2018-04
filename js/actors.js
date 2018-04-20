'use strict';

class Mage {
    constructor(id, teamId, color, xy, status = Status.LIVE, health = MAGE_HEALTH, mana = MAGE_MANA, effects = []) {
        this.id = id;
        this.teamId = teamId;
        this.color = color;
        this.xy = xy;
        this.status = status;
        this.health = health;
        this.mana = mana;
        this.effects = effects;
    }

    clone() {
        let mage = new Mage(this.id, this.teamId, this.color, this.xy.clone(), this.status, this.health, this.mana, cloneArray(this.effects));
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

    idle() {
        this.action = { type: ActionType.IDLE };
    }

    /*interact(cell, dir) {
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
    }*/
    interact(cell, dir) {
        if (cell instanceof Bottle) {
            let bottle = cell;
            this.move(dir);
            bottle.action = { type: ActionType.APPLY };
            (new EnergyEffect(bottle.type, bottle.value)).apply(this);
        } else {
            this.idle();
        }
    }
}

class Spell {
    constructor(mageId, id) {
        this.mageId = mageId;
        if (id) {
            this.id = id;
        } else {
            this.id = ++idCounter;
            this.action = { type: ActionType.NEW };
        }
    }

    get cost() {}

    get power() {}    

    apply() {}

    validate(mage) {}
}

class MovingSpell extends Spell {
    constructor(mageId, xy, dir, id) {
        super(mageId, id);
        this.xy = xy;
        this.dir = dir;        
    }

    clone() {
        var spell = new this.constructor(this.mageId, this.xy, this.dir, this.id);
        spell.action = this.action;
        return spell;
    }

    move() {
        this.xy = this.xy.add(this.dir);
        this.action = { type: ActionType.MOVE };
    }

    apply(mage) {
        this.action = { type: ActionType.APPLY, targetId: mage.id };
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

    validate(mage) {
        if (!this.dir || !this.dir.validate()) {
            return null;
        }
        let spell = new this.constructor();
        spell.dir = this.dir;

        if (mage.mana < spell.cost) {
            return null;
        }

        let xy = mage.xy.add(spell.dir);
        let cell = GameEntities.instance.level.getCell(GameEntities.instance.state, xy);
        if (cell === Cell.WALL || cell instanceof Mage) {
            return null;
        }

        spell.mageId = mage.id;
        spell.xy = xy;        
        return spell;
    }
}

class FireballSpell extends MovingSpell {
    constructor(mageId, xy, dir, id) {
        super(mageId, xy, dir, id);
        this.color = 'yellow';
    }

    get cost() { return FIREBALL_COST; }

    get power() { return FIREBALL_POWER; }

    apply(mage) {
        super.apply(mage);
        (new EnergyEffect(HEALTH, -this.power)).apply(mage);
        let points = mage.status == Status.DEAD ? DEATH_BONUS : HIT_BONUS;
        document.dispatchEvent(new CustomEvent(ScoreEventType, { detail: { mageId: this.mageId, targetId: mage.id, points: points } }));
    }
}

class ImmediateSpell extends Spell {
    constructor(mageId, targetId, id) {
        super(mageId, id);
        this.targetId = targetId;
    }

    validate(mage) {
        if (!this.targetId) {
            return null;
        }
        let spell = new this.constructor();
        spell.targetId = this.targetId;

        if (mage.mana < spell.cost) {
            return null;
        }

        let targetMage = getItemById(GameEntities.instance.state.mages, spell.targetId);

        if (targetMage && targetMage.status != Status.DEAD) {
            spell.targetMage = targetMage;
            return spell;
        } else {
            return null;
        }
    }
}

class HealSpell extends ImmediateSpell {
    get cost() { return HEAL_COST; }

    get power() { return HEAL_POWER; }

    apply() {        
        new EnergyEffect(HEALTH, this.power).apply(this.targetMage);
    }
}


class Effect {
    constructor(duration, action, id) {
        this.duration = duration;     
        this.action = action;
        this.id = id;
    }

    turn(mage) {
        if (this.action.type == ActionType.NEW) {
            return;
        }
        this.duration--;
        if (this.duration == 0) {
            this.remove(mage);
        }
    }

    apply(mage) {        
        mage.effects.push(this);
    }

    /**
     * Remove this effect from the mage
     * @param {Mage} mage 
     */
    remove(mage) {        
        mage.effects = mage.effects.filter(eff => eff !== this);
    }
}

class EnergyEffect extends Effect {
    constructor(type, value, duration = 1, action = {type: ActionType.NEW}, id = ++idCounter) {
        super(duration, action, id);
        this.type = type;
        this.value = value;
    }

    clone() {
        return new EnergyEffect(this.type, this.value, this.duration, {type: ActionType.IDLE}, this.id);
    }

    apply(mage) {
        super.apply(mage);
        if (this.type == HEALTH) {
            mage.health = Math.min(mage.health + this.value, MAGE_HEALTH);
            if (mage.health <= 0) {
                mage.action = { type: ActionType.KILLED };
                (new DeathEffect).apply(mage);
            }
        } else if (this.type == MANA) {
            mage.mana = Math.min(mage.mana + this.value, MAGE_MANA);
        }
        
    }
}

class DeathEffect extends Effect {
    constructor(duration = DEATH_EFFECT_DURATION, action = {type: ActionType.NEW}, id = ++idCounter) {
        super(duration, action, id);
    }

    clone() {
        return new DeathEffect(this.duration, {type: ActionType.IDLE}, this.id);
    }

    apply(mage) {
        mage.effects = [];
        mage.status = Status.DEAD;
        super.apply(mage);
    }

    remove(mage) {
        super.remove(mage);
        mage.action = { type: ActionType.NEW };
        mage.status = Status.LIVE;
        mage.health = MAGE_HEALTH;
        mage.mana = MAGE_MANA;
        mage.xy = GameEntities.instance.level.getRandomEmptyCell(GameEntities.instance.state);
    }
}


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