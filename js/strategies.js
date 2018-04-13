'use strict';

class MageStrategy {
    constructor(myId) {
        this.id = myId;
    }

    init(state) {}
    turn(state) {}
}

class KeyboardMageStrategy extends MageStrategy {
    turn(state) {
        let com = prompt('Mage ' + this.id + ': ');
        let action = { id: this.id };
        switch (com) {
            case 'a':
                action.type = ActionType.MOVE;
                action.dir = new Direction(-1, 0);
                break;
            case 's':
                action.type = ActionType.MOVE;
                action.dir = new Direction(0, 1);
                break;
            case 'd':
                action.type = ActionType.MOVE;
                action.dir = new Direction(1, 0);
                break;
            case 'w':
                action.type = ActionType.MOVE;
                action.dir = new Direction(0, -1);
                break;
            case 'j':
                action.type = ActionType.CAST;
                action.spell = new FireballSpell();
                action.spell.dir = new Direction(-1, 0);
                break;
            case 'k':
                action.type = ActionType.CAST;
                action.spell = new FireballSpell();
                action.spell.dir = new Direction(0, 1);
                break;
            case 'l':
                action.type = ActionType.CAST;
                action.spell = new FireballSpell();
                action.spell.dir = new Direction(1, 0);
                break;
            case 'i':
                action.type = ActionType.CAST;
                action.spell = new FireballSpell();
                action.spell.dir = new Direction(0, -1);
                break;
            case 'q':
                throw 'Stop the game';
        }
        return action;
    }
}

class RandomMageStrategy extends MageStrategy {
    turn(state) {
        // TODO: implement throwing a Fireball spell from time to time
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1)];
        return {
            id: this.id,
            type: ActionType.MOVE,
            dir: dir[Math.floor(Math.random() * dir.length)]
        }
    }
}