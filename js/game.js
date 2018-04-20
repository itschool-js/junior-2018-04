'use strict';

let idCounter = 0;

class GameEntities {
    static get instance() { return _gameEntities; }

    get level() { return this._level; }
    set level(level) { this._level = level; }

    get state() { return this._state; }
    set state(state) { this._state = state; }
}
const _gameEntities = new GameEntities();


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
        this.level = GameEntities.instance.level = level;

        this.tick = 0;

        this.state = new State(teams, [], [], []);

        for (let strat of strategies) {
            this.state.mages.push(new Mage(strat.id, strat.team.id, strat.team.color, this.level.getRandomEmptyCell(this.state)));
        }
        // this.state.mages.push(new Mage(strategies[0].id, strategies[0].team.id, strategies[0].team.color, new XY(4, 5)));
        // this.state.mages.push(new Mage(strategies[1].id, strategies[1].team.id, strategies[1].team.color, new XY(10, 4)));

        this.strategies = strategies;
        for (let strat of strategies) {
            strat.init(this.level, this.state);
        }
        this.level.init(this.state);
    }

    makeTick() {
        let state = GameEntities.instance.state = this.state.clone();
        state.tick = this.tick;

        let isMageTurn = this.tick % MAGE_TICK == 0;

        let actions = [];
        if (isMageTurn) {
            for (let strat of this.strategies) {
                let mage = getItemById(this.state.mages, strat.id);
                if (mage.status == Status.LIVE) {
                    actions.push(strat.turn(this.state));
                }
            }
        }

        let scoreEventHandler = function (e) {
            let mage = getItemById(state.mages, e.detail.mageId);
            let targetMage = getItemById(state.mages, e.detail.targetId);
            if (mage.teamId == targetMage.teamId) {
                // friendly fire
                e.detail.points = -e.detail.points;
            }
            let team = getItemById(state.teams, mage.teamId);
            team.score += e.detail.points;
            console.log(team.id + ' ' + team.score);
        }
        document.addEventListener(ScoreEventType, scoreEventHandler);

        // filter gone or applied spells
        state.spells = state.spells.filter(function (spell) {
            return spell.action.type != ActionType.GONE && spell.action.type != ActionType.APPLY;
        });

        // filter gone bottles
        state.bottles = state.bottles.filter(function (bottle) {
            return bottle.action.type != ActionType.APPLY;
        });

        // spells
        for (let spell of state.spells) {
            let xy = spell.xy.add(spell.dir);
            let cell = this.level.getCell(state, xy);
            if (cell === Cell.EMPTY) {
                spell.move();
            } else {
                spell.interact(cell);
            }
        }

        if (isMageTurn) {
            // mages
            let mageIds = [];
            for (let mage of state.mages) {
                mageIds.push(mage.id);
            }
            shuffle(mageIds);

            for (let mageId of mageIds) {
                let mage = getItemById(state.mages, mageId);
                let act = getItemById(actions, mage.id);
                if (!act) {
                    mage.idle();
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
                        } else {
                            mage.idle();
                        }
                        break;
                    case ActionType.CAST:
                        let spell = act.spell.validate(mage, state, this.level);
                        if (spell) {
                            if (spell instanceof MovingSpell) {
                                state.spells.push(spell);
                            } else if (spell instanceof ImmediateSpell) {
                                spell.apply();
                            }
                            mage.cast(spell);
                        } else {
                            mage.idle();
                        }
                        break;
                    case ActionType.IDLE:
                    default:
                        mage.idle();
                        break;
                }
            }
        }

        // bottles
        for (let bottle of state.bottles) {
            if (!bottle.action || bottle.action.type != ActionType.APPLY) {
                bottle.action = { type: ActionType.IDLE };
            }
        }

        if (isMageTurn) {
            // effects
            for (let mage of state.mages) {
                for (let eff of mage.effects) {
                    eff.turn(mage);
                }
            }

            // bottle generation
            let chance = Math.floor(Math.random() * BOTTLE_CHANCE);
            if (chance == 0) {
                let type = Math.random() <= BOTTLE_HEALTH_PROB ? HEALTH : MANA;
                let value = type == HEALTH ? BOTTLE_HEALTH : BOTTLE_MANA;
                let bottle = new Bottle(type, value, this.level.getRandomEmptyCell(state));
                state.bottles.push(bottle);
            }
        }

        this.state = state;
        //console.log(JSON.stringify(state));
        this.level.update(this.state);
        document.removeEventListener(ScoreEventType, scoreEventHandler);

        this.tick++;
        if (this.tick <= MAX_TURN) {
            let self = this;
            setTimeout(function () {
                self.makeTick();
            }, TICK_DURATION);
        }
    }
}


let level = new HtmlLevel(PLANS[1], GRID_SIZE);

let teams = [];
teams.push(new Team('Blue team', 'blue'));
teams.push(new Team('Orange team', 'orange'));
teams.push(new Team('Red team', 'red'));
teams.push(new Team('Purple team', 'purple'));
teams.push(new Team('Yellow team', 'yellow'));

let strategies = [];
// strategies.push(new RandomMageStrategy(teams[0], 1));
// strategies.push(new RandomMageStrategy(teams[1], 2));
// strategies.push(new KeyboardMageStrategy(teams[0], 1));
// strategies.push(new KeyboardMageStrategy(teams[1], 2));

strategies.push(new StrategyBlueTeam1(teams[0], 'blue1'));
strategies.push(new StrategyBlueTeam2(teams[0], 'blue2'));
strategies.push(new StrategyBlueTeam3(teams[0], 'blue3'));
strategies.push(new StrategyBlueTeam4(teams[0], 'blue4'));
strategies.push(new StrategyOrangeTeam1(teams[1], 'orange1'));
strategies.push(new StrategyOrangeTeam2(teams[1], 'orange2'));
strategies.push(new StrategyOrangeTeam3(teams[1], 'orange3'));
strategies.push(new StrategyOrangeTeam4(teams[1], 'orange4'));
strategies.push(new StrategyRedTeam1(teams[2], 'red1'));
strategies.push(new StrategyRedTeam2(teams[2], 'red2'));
strategies.push(new StrategyRedTeam3(teams[2], 'red3'));
strategies.push(new StrategyRedTeam4(teams[2], 'red4'));
strategies.push(new StrategyPurpleTeam1(teams[3], 'purple1'));
strategies.push(new StrategyPurpleTeam2(teams[3], 'purple2'));
strategies.push(new StrategyPurpleTeam3(teams[3], 'purple3'));
strategies.push(new StrategyPurpleTeam4(teams[3], 'purple4'));
strategies.push(new StrategyYellowTeam1(teams[4], 'yellow1'));
strategies.push(new StrategyYellowTeam2(teams[4], 'yellow2'));
strategies.push(new StrategyYellowTeam3(teams[4], 'yellow3'));
strategies.push(new StrategyYellowTeam4(teams[4], 'yellow4'));

let game = new Game(level, teams, strategies);
setTimeout(function () {
    game.makeTick();
}, TICK_DURATION);