'use strict';

const GRID_SIZE = 20;

const MAGE_TURN = 6;

const MAX_TURN = 200 * MAGE_TURN;
const TURN_DURATION = 100;

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

const ICE_BOLT_COST = 20;
const ICE_BOLT_POWER = 5;

const CURE_COST = 40;
const CURE_POWER = 50;

const SPEED_COST = 40;
const SPEED_POWER = 5;

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
    NEW: 'new',
    GONE: 'gone',
    APPLY: 'apply',
    IDLE: 'idle'
}
Object.freeze(ActionType);