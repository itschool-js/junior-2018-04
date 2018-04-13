'use strict';

class State {
    constructor(mages) {        
        this.mages = mages;     
    }

    clone() {
        return new State(cloneArray(this.mages));
    }
}


/*
let state = new State([
    new Mage(1, 'dodgerblue', new XY(4, 5)),
    new Mage(2, 'orange', new XY(10, 4))
]);
let newState = state.clone();
console.log(state.mages);
console.log(newState.mages);
console.log(state.mages[0] == newState.mages[0]);
*/



/*
let level = new Level(PLANS[0]);
console.log(level.getCell(state, new XY(1, 2)));
console.log(level.getCell(state, new XY(4, 5)));
*/

class Game {
    constructor(level, strategies) {
        this.level = level;
        this.turn = 1;

        this.state = new State([], []);
        
        this.state.mages.push(new Mage(strategies[0].id, 'dodgerblue', new XY(4, 5)));
        this.state.mages.push(new Mage(strategies[1].id, 'orange', new XY(10, 4)));

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

        // mages
        for (let mage of state.mages) {
            let act = getItemById(actions, mage.id);
            switch (act.type) {
                case ActionType.MOVE:
                    if (act.dir.validate()) {
                        let xy = mage.xy.add(act.dir);
                        let cell = this.level.getCell(state, xy);
                        if (cell === Cell.EMPTY) {
                            mage.move(act.dir);
                        }
                    }
                    break;
                // case ActionType.CAST:
                //     let spell = act.spell;
                //     spell.mageId = mage.id;                    
                //     spell.xy = mage.xy.add(spell.dir);                    
                //     mage.cast(spell);                    
                //     state.spells.push(spell);                    
                //     break;
            }
        }

        this.state = state;
        this.level.update(this.state);

        this.turn++;
        if (this.turn <= MAX_TURN) {
            let self = this;
            setTimeout(function () {
                self.makeTurn();
            }, TURN_DURATION);
        }
    }
}

/*
let level = new HtmlLevel(PLANS[0], GRID_SIZE);

let strategies = [];
// strategies.push(new RandomMageStrategy(1));
// strategies.push(new RandomMageStrategy(2));
strategies.push(new KeyboardMageStrategy(1));
strategies.push(new KeyboardMageStrategy(2));

let game = new Game(level, strategies);
setTimeout(function() {
    game.makeTurn();
}, 0);
*/