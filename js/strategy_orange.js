'use strict';


class StrategyOrangeTeam1 extends MageStrategy {
    // Проверка клетки на угрозы
    checkDanger(state,xy0) {
        let result = 0;
        for (let x = xy0.x - MAGE_TICK*2; x <= xy0.x + MAGE_TICK*2; x++)
            for (let y = xy0.y - MAGE_TICK*2; y <= xy0.y + MAGE_TICK*2; y++) {
                let xy = new XY(x,y);
                if ((x > 0 && x < level.width && y > 0 && y < level.height)  
                && (x == xy0.x || y == xy0.y || x+y == xy0.x+xy0.y || x-y == xy0.x-xy0.y)) {

                    let cell = level.getCell(state,xy);
                    
                    if (((x < xy0.x-1 || x > xy0.x+1 || y < xy0.y-1 || y > xy0.y+1))
                    && (cell instanceof Mage) && (cell.status != Status.DEAD) 
                    && (cell.teamId != this.team.id)) {
                        if (x >= xy0.x - (MAGE_TICK+1) && x <= xy0.x + (MAGE_TICK+1) && y >= xy0.y - (MAGE_TICK+1) && y <= xy0.y + (MAGE_TICK+1)) {
                            if (result == 0)
                                result = cell;    
                            else if (result instanceof Mage)
                                result = 2;
                            else
                                result++;
                        }
                    }
  
                    if ((x < xy0.x - MAGE_TICK || x > xy0.x + MAGE_TICK || y < xy0.y - MAGE_TICK || y > xy0.y + MAGE_TICK)
                    && (cell instanceof FireballSpell) && cell.action.type != ActionType.GONE && cell.action.type != ActionType.APPLY) {
                        let fireDir = this.getDirTo(cell.xy,xy0);
                        if (fireDir.x == cell.dir.x && fireDir.y == cell.dir.y)
                            return cell;
                    }
                }
            }
        return result;
    }
    // Проверка клетки на проходимость  
    checkWay(state,xy) {
        let cell = level.getCell(state,xy);
        if ((cell instanceof Mage) || (cell == '#'))
            return false
        else
            return true;
    }

    // Взять направление движения к выбранной точке
    getDirTo(mageXY,xy) {
        const dev = 6;
        let vect = new XY(xy.x - mageXY.x, xy.y - mageXY.y);
        let long = Math.sqrt(Math.pow(vect.x,2) + Math.pow(vect.y,2));
        let sign = new XY(Math.sign(vect.x), Math.sign(vect.y));
        vect.x = Math.abs(vect.x);      vect.y = Math.abs(vect.y); 
        vect.x /= long;                 vect.y /= long;
        vect.x = vect.x*dev;            vect.y = vect.y*dev;
        vect.x = Math.ceil(vect.x);     vect.y = Math.ceil(vect.y);
        if (vect.x == dev && vect.y != dev)
            return new Direction(sign.x,0);
        else if (vect.y == dev && vect.x != dev)
            return new Direction(0,sign.y);
        else
            return new Direction(sign.x,sign.y);
            // Учитывать препятствия впереди (не работает)
            // if (vect.x == dev && vect.y != dev){
            //     let xy1 = mageXY.clone();
            //     let dir1 = new Direction(sign.x,0);
            //     if (this.checkWay(state,xy1.add(dir1)))
            //         return new Direction(sign.x,0);
            // }
                
            // if (vect.y == dev && vect.x != dev) {
            //     let xy1 = mageXY.clone();
            //     let dir1 = new Direction(sign.x,0);
            //     if (this.checkWay(state,xy1.add(dir1)))
            //         return new Direction(0,sign.y);
            // }
            // {
            //     let xy1 = mageXY.clone();
            //     let dir1 = new Direction(sign.x,0);
            //     if (this.checkWay(state,xy1.add(dir1)))
            //         return new Direction(sign.x,sign.y);
            // }
    
            //     return new Direction(-sign.x,0);
    }

    // Подходить к врагу не по прямой линии я по параллельной (не работает)
    // correctSafeWay(state,xy0,dir0) {
    //     for (let x = xy0.x - (MAGE_TICK*2)+1; x <= xy0.x + (MAGE_TICK*2)+1; x++)
    //         for (let y = xy0.y - (MAGE_TICK*2)+1; y <= xy0.y + (MAGE_TICK*2)+1; y++) {

    //             let cell;
    //             if ((dir0.x == 0 && xy0.x == x)
    //              || (dir0.y == 0 && xy0.y == y)
    //              || (dir0.x*dir0.y > 0 && xy0.x+xy0.y == x+y)
    //              || (dir0.x*dir0.y < 0 && xy0.x-xy0.y == x-y)){
    //                 cell = level.getCell(state,new XY(x,y));
    //             }
            
    //             if (cell instanceof Mage) {
    //                 let xy1 = xy0.clone();
    //                 xy1 = xy1.add(dir0);
    //                 for (let x1 = xy1.x-1; x1 <= xy1.x+1; x1++)
    //                     for (let y1 = xy1.y-1; 1 <= xy1.y+1; y1++)
    //                         if (x1 != xy1.x && x1 != xy1.x && Math.sqrt(Math.pow(x1 - xy0.x,2) + Math.pow(y1 - xy0.y,2)) < 1.5 ) {
    //                             let xy2 = new XY(x1,y1);
    //                             if (this.checkDanger(state,xy2) === 0 && this.checkWay(state,xy2))
    //                                 return new Direction(x1-xy0.x,y1-xy0.y); 
    //                         }
    //             }
    //         }
    //     return dir0;
    // }

    // Выбрать место для атаки
    getAttackPlace(xy,xyTar) {
        let xyAttack = new XY(0,0);
        if (Math.abs(xy.x - xyTar.x) > Math.abs(xy.y - xyTar.y)) {
            xyAttack.x = xyTar.x + this.getDirTo(xyTar,xy).x * MAGE_TICK-1;
            xyAttack.y = xyTar.y;
        }
        else {
            xyAttack.x = xyTar.x;
            xyAttack.y = xyTar.y + this.getDirTo(xyTar,xy).y * MAGE_TICK-1;       
        }
        if (xyAttack.x <= 0)
            xyAttack.x = 1;
        if (xyAttack.x >= level.width)
            xyAttack.x = level.width-1;
        if (xyAttack.y <= 0)
            xyAttack.y = 1;
        if (xyAttack.y >= level.height)
            xyAttack.y = level.height-1; 
        return xyAttack;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    // Уворот от Файрболла
    avoidFireball(state,mage) {
        let dirs = [
                new Direction(-1, -1),  new Direction(0, -1),    new Direction(1, -1),
                new Direction(-1, 0),                            new Direction(1, 0),
                new Direction(-1, 1),   new Direction(0, 1),     new Direction(1, 1),
            ];
    shuffle(dirs);
        for (let i = 0; i < 8; i++) {
            let xy1 = mage.xy.clone(); 
            xy1 = xy1.add(dirs[i]);
            if ( this.checkDanger(state,xy1) === 0 && this.checkWay(state,xy1) )
                return dirs[i];
        }
        return 0;
    }

    // Поиск ближайшей скляночки
    findBottle(state,xy,bottletype) {
         let dist = Infinity;
         let memBottle;
         for (let bottle of state.bottles) {
            if (bottle.action = ActionType.IDLE && bottle.type == bottletype) {
                let memDist = Math.sqrt(Math.pow(bottle.xy.x - xy.x,2) + Math.pow(bottle.xy.y - xy.y,2));
                if (memDist < dist) {
                    dist = memDist;
                    memBottle = bottle;    
                }
            }
        }
        if (memBottle instanceof Bottle) 
            return memBottle
        else
            return false;
    }

    // Поиск ближайшего вражеского мага
    findMage(state,myMage) {
        let dist = Infinity;
        let memMage;
        for (let mage of state.mages) {
            if (mage.teamId != myMage.teamId && mage.status != Status.DEAD) {
                let memDist = Math.sqrt(Math.pow(mage.xy.x - myMage.xy.x,2) + Math.pow(mage.xy.y - myMage.xy.y,2));
                if (memDist < dist) {
                    dist = memDist;
                    memMage = mage;    
                }
            }
        }
        return memMage;
    }

    turn(state) {
        let action = { id: this.id };
        let mage = getItemById(state.mages,this.id);
        let dangerInf = this.checkDanger(state,mage.xy);

        if ((dangerInf instanceof FireballSpell) || dangerInf > 1) {
            let dir = this.avoidFireball(state,mage);
            if (dir !== 0){
                action.type = ActionType.MOVE;
                action.dir = dir;
                return action;
            }
        }
        if (dangerInf instanceof Mage) {
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = this.getDirTo(mage.xy,dangerInf.xy);
            return action;  
        }
        if (mage.health < FIREBALL_POWER+1) {
            let bottle = this.findBottle(state,mage.xy,HEALTH);
            if (bottle !== false) {
                action.type = ActionType.MOVE;
                action.dir = this.getDirTo(mage.xy,bottle.xy);
                return action;
            } 
        }
        if (mage.mana < FIREBALL_COST) {
            let bottle = this.findBottle(state,mage.xy,MANA);
            if (bottle !== false) {
                action.type = ActionType.MOVE;
                action.dir = this.getDirTo(mage.xy,bottle.xy);
                return action;
            } 
        }
        if (mage.mana >= FIREBALL_COST) {
            action.type = ActionType.MOVE;
            let tarMage = this.findMage(state,mage);
            action.dir = this.getDirTo(mage.xy,this.getAttackPlace(mage.xy,tarMage.xy));
            // let dist = Math.sqrt(Math.pow(tarMage.xy.x - mage.xy.x,2) + Math.pow(tarMage.xy.y - mage.xy.y,2));
            // if (dist > MAGE_TICK) 
            //   action.dir = this.correctSafeWay(state,mage.xy,action.dir);
            return action;
        }
        {
            let bottle = this.findBottle(state,mage.xy,HEALTH);
            if (bottle !== false) {
                action.type = ActionType.MOVE;
                action.dir = this.getDirTo(mage.xy,bottle.xy);
                return action;
            } 
        }
        {
            let dirs = [
                new Direction(-1, -1),  new Direction(0, -1),    new Direction(1, -1),
                new Direction(-1, 0),                            new Direction(1, 0),
                new Direction(-1, 1),   new Direction(0, 1),     new Direction(1, 1),
            ];
            action.type = ActionType.MOVE;
            action.dir = dirs[this.getRandomInt(0,7)];
            return action;
        }  
        
    }
}

class StrategyOrangeTeam2 extends StrategyOrangeTeam1 {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

}


class StrategyOrangeTeam3 extends StrategyOrangeTeam1 {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

}


class StrategyOrangeTeam4 extends StrategyOrangeTeam1 {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

}