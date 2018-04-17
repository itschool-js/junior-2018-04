'use strict';

let idCounter = 0;

class Team {
    constructor(id, color, score = 0) {
        this.id = id;
        this.color = color;
        this.score = score;
    }

    clone() {
        return new Team(this.id, this.color, this.score);
    }
}

class State {
    // TODO: add spells to the state

    constructor(teams, mages, spells, bottles) {
        this.teams = teams;
        this.mages = mages;
        this.spells = spells;
        this.bottles = bottles;
    }

    clone() {
        return new State(cloneArray(this.teams), cloneArray(this.mages), cloneArray(this.spells), cloneArray(this.bottles));
    }
}

class Game {
    constructor(level, teams, strategies) {
        this.level = level;
        this.turn = 1;

        this.state = new State(teams, [], [], []);
        /*for (let strat of strategies) {
            this.state.mages.push(new Mage(strat.id, strat.team.id, strat.team.color, this.level.getRandomEmptyCell(this.state)));
        }*/
        this.state.mages.push(new Mage(strategies[0].id, strategies[0].team.id, strategies[0].team.color, new XY(4, 5)));
        this.state.mages.push(new Mage(strategies[1].id, strategies[1].team.id, strategies[1].team.color, new XY(10, 4)));

        this.strategies = strategies;
        for (let strat of strategies) {
            strat.init(this.state);
        }
        this.level.init(this.state);
    }

    makeTurn() {
        let actions = [];
        for (let strat of this.strategies) {
            actions.push(strat.turn(this.state));
        }

        let state = this.state.clone();
        
        // spells
        // TODO: process spells     
        for (let spell of state.spells) {
            let xy = spell.xy.add(spell.dir);
            let cell = this.level.getCell(state, xy);
            if (cell === Cell.EMPTY) {
                spell.move();
            } else {
                spell.interact(cell);
            }
        }

        // mages
        for (let mage of state.mages) {
            let act = getItemById(actions, mage.id);
            if (!act) {
                continue;
            }
            switch (act.type) {
                case ActionType.MOVE:
                    if (act.dir.validate()) {
                        let xy = mage.xy.add(act.dir);
                        let cell = this.level.getCell(state, xy);
                        if (cell === Cell.EMPTY) {
                            mage.move(act.dir);
                        } else {
                            mage.interact(cell, act.dir);
                        }
                    }
                    break;
                case ActionType.CAST:
                    let spell = act.spell;
                    spell.mageId = mage.id;
                    spell.xy = mage.xy.add(spell.dir);
                    mage.cast(spell);
                    state.spells.push(spell);
                    break;
            }
        }

        // bottles
        for (let bottle of state.bottles) {
            if (!bottle.action || bottle.action.type != ActionType.APPLY) {
                bottle.action = { type: ActionType.IDLE };
            }
        }

        // bottle generation
        // let chance = Math.floor(Math.random() * BOTTLE_CHANCE);
        // if (chance == 0) {
        // let type = Math.random() <= BOTTLE_HEALTH_PROB ? HEALTH : MANA;
        // let value = type == HEALTH ? BOTTLE_HEALTH : BOTTLE_MANA;
        // let bottle = new Bottle(type, value, this.level.getRandomEmptyCell(state));
        // state.bottles.push(bottle);
        // }

        this.state = state;
        this.level.update(this.state);

        this.turn++;
        if (this.turn <= MAX_TURN) {
            setTimeout(this.makeTurn.bind(this), TURN_DURATION);
        }
    }
}


let level = new HtmlLevel(PLANS[0], GRID_SIZE);

let teams = [];
teams.push(new Team('Blue team', 'dodgerblue'));
teams.push(new Team('Orange team', 'orange'));

let strategies = [];
// strategies.push(new RandomMageStrategy(teams[0], 1));
// strategies.push(new RandomMageStrategy(teams[1], 2));
strategies.push(new KeyboardMageStrategy(teams[0], 1));
strategies.push(new KeyboardMageStrategy(teams[1], 2));

let game = new Game(level, teams, strategies);
setTimeout(function () {
    game.makeTurn();
}, 0);



