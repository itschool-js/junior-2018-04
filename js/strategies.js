'use strict';

class MageStrategy {
    constructor(myTeam, myId) {
        this.team = myTeam;
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
        let action = { id: this.id };
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1)];
        let n = Math.floor(Math.random() * dir.length);
        let chance = Math.floor(Math.random() * 100);
        if (chance < 80) {
            action.type = ActionType.MOVE;
            action.dir = dir[n];
        } else {            
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = dir[n];
        }        
        return action;
    }
}

class ArtificialIntelligence extends MageStrategy{
    turn(state) {
        let action = { id: this.id };
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1)];
        let mage;

        for (let x of state.mages) {
            if ( x.id == 2 ) {
                mage=x;
                break;
            }
        }

        let coor = mage.xy;

        let target_mage;
        let target_spell;

        for (let d of dir) {

            let new_coor = coor;
            top:
            while ( true ) {
                new_coor = new_coor.add(d);
                if ( level.getCell(state, new_coor) != Cell.EMPTY ) {
                    if ( level.getCell(state, new_coor) instanceof Mage ) {
                        target_mage = d;
                    }/* else if ( level.getCell(state, new_coor) instanceof FireballSpell ) {
                        target_spell = d;
                    }*/
                    break top;
                }
            }
        }
        
        if (target_mage) {
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = target_mage;
            
        }/* else if (target_spell) {
            if ( target_spell == dir[0] || target_spell == dir[1] ) {
                if ( level.getCell(state,cor.add(dir[2])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[2];
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[3];
                }
            } else if ( target_spell == dir[2] || target_spell == dir[3] ) {
                if ( level.getCell(state,cor.add(dir[0])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[0];                
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[1];
                }
            } 
        }*/ else {  
            let n = Math.floor(Math.random() * dir.length);
            action.type = ActionType.MOVE;
            action.dir = dir[n]; 
        }     
        return action;  
    }
}