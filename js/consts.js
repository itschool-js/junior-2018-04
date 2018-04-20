'use strict';

const GRID_SIZE = 20;

const MAGE_TICK = 6;
const SPELL_TICK = 1;

const MAX_TURN = 200 * MAGE_TICK;
const TICK_DURATION = 100;

const MAGE_HEALTH = 100;
const MAGE_MANA = 100;

const HEALTH = 'health';
const MANA = 'mana';

const BOTTLE_HEALTH = 50;
const BOTTLE_MANA = 100;

const BOTTLE_CHANCE = 10;
const BOTTLE_HEALTH_PROB = 0.5;

const FIREBALL_COST = 10;
const FIREBALL_POWER = 20;

const HEAL_COST = 40;
const HEAL_POWER = 50;

const HIT_BONUS = 20;
const DEATH_BONUS = 4 * HIT_BONUS;

const DEATH_EFFECT_DURATION = 10;

const Cell = {
    EMPTY: ' ',
    WALL: '#'
}
Object.freeze(Cell);

const ActionType = {
    MOVE: 'move',
    CAST: 'cast',
    IDLE: 'idle',
    NEW: 'new',
    GONE: 'gone',
    APPLY: 'apply',
    KILLED: 'killed'
}
Object.freeze(ActionType);

const Status = {
    LIVE: 'live',
    DEAD: 'dead'
}
Object.freeze(Status);

const ScoreEventType = 'score';