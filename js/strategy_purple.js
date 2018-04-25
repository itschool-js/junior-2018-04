'use strict';

class StrategyPurpleTeam1 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let action = { id: this.id };
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1), new Direction(1, 1), new Direction(1, -1), new Direction(-1, 1), new Direction(1, -1)];        let mage;

        for (let x of state.mages) {
            if ( x.id == this.id ) {
                mage=x;
                break;
            }
        }

        let coor = mage.xy;

        let target_mage;
        let step=0;
        let steps_to_mage;
        let steps_to_spell;
        let target_spell;
        let target_bottle;
        let steps_to_bottle;

        for (let d of dir) {
            step=0;
            let new_coor = coor;
            
            top:
            while ( true ) {
                step++;
                new_coor = new_coor.add(d);
                if ( level.getCell(state, new_coor) != Cell.EMPTY ) {
                   
                    if ( (level.getCell(state, new_coor) instanceof Mage)  && (level.getCell(state, new_coor).teamId!="Purple team")&&(mage.mana>=10)&&(level.getCell(state, new_coor).status!=Status.DEAD)) {
                        target_mage = d;
                        steps_to_mage=step;
                    } else if ( level.getCell(state, new_coor) instanceof FireballSpell ) {
                        target_spell = d;
                        steps_to_spell=step;
                    }
                    else if (level.getCell(state, new_coor) instanceof Bottle)
                    {
                        target_bottle=d;
                        steps_to_bottle=step;

                    }
                    break top;
                }
            }
        }
        console.log(step);
        if (target_mage && steps_to_mage<=12) {
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = target_mage;
            
        } else if (target_bottle&&(steps_to_bottle==1))
        {
            action.type = ActionType.MOVE;
            action.dir = target_bottle;
        }
        
        
        
        else if (target_spell && steps_to_spell<=12) {
            if ( target_spell == dir[0] || target_spell == dir[1] ) {
                if ( level.getCell(state,coor.add(dir[2])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[2];
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[3];
                }
            } else if ( target_spell == dir[2] || target_spell == dir[3] ) {
                if ( level.getCell(state,coor.add(dir[0])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[0];                
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[1];
                }
            } 
        } else {  
            let n = Math.floor(Math.random() * dir.length);
            action.type = ActionType.MOVE;
            action.dir = dir[n]; 
        }     
        return action;  
    }

}


class StrategyPurpleTeam2 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let action = { id: this.id };
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1), new Direction(1, 1), new Direction(1, -1), new Direction(-1, 1), new Direction(1, -1)];        let mage;

        for (let x of state.mages) {
            if ( x.id == this.id ) {
                mage=x;
                break;
            }
        }

        let coor = mage.xy;

        let target_mage;
        let step=0;
        let steps_to_mage;
        let steps_to_spell;
        let target_spell;
        let target_bottle;
        let steps_to_bottle;

        for (let d of dir) {
            step=0;
            let new_coor = coor;
            
            top:
            while ( true ) {
                step++;
                new_coor = new_coor.add(d);
                if ( level.getCell(state, new_coor) != Cell.EMPTY ) {
                   
                    if ( (level.getCell(state, new_coor) instanceof Mage)  && (level.getCell(state, new_coor).teamId!="Purple team")&&(mage.mana>=10)&&(level.getCell(state, new_coor).status!=Status.DEAD)) {
                        target_mage = d;
                        steps_to_mage=step;
                    } else if ( level.getCell(state, new_coor) instanceof FireballSpell ) {
                        target_spell = d;
                        steps_to_spell=step;
                    }
                    else if (level.getCell(state, new_coor) instanceof Bottle)
                    {
                        target_bottle=d;
                        steps_to_bottle=step;

                    }
                    break top;
                }
            }
        }
        console.log(step);
        if (target_mage && steps_to_mage<=12) {
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = target_mage;
            
        } else if (target_bottle&&(steps_to_bottle==1))
        {
            action.type = ActionType.MOVE;
            action.dir = target_bottle;
        }
        
        
        
        else if (target_spell && steps_to_spell<=12) {
            if ( target_spell == dir[0] || target_spell == dir[1] ) {
                if ( level.getCell(state,coor.add(dir[2])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[2];
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[3];
                }
            } else if ( target_spell == dir[2] || target_spell == dir[3] ) {
                if ( level.getCell(state,coor.add(dir[0])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[0];                
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[1];
                }
            } 
        } else {  
            let n = Math.floor(Math.random() * dir.length);
            action.type = ActionType.MOVE;
            action.dir = dir[n]; 
        }     
        return action;  
    }
}


class StrategyPurpleTeam3 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let action = { id: this.id };
        let dir = [new Direction(-1, 0), new Direction(1, 0), new Direction(0, -1), new Direction(0, 1), new Direction(1, 1), new Direction(1, -1), new Direction(-1, 1), new Direction(1, -1)];        let mage;

        for (let x of state.mages) {
            if ( x.id == this.id ) {
                mage=x;
                break;
            }
        }

        let coor = mage.xy;

        let target_mage;
        let step=0;
        let steps_to_mage;
        let steps_to_spell;
        let target_spell;
        let target_bottle;
        let steps_to_bottle;

        for (let d of dir) {
            step=0;
            let new_coor = coor;
            
            top:
            while ( true ) {
                step++;
                new_coor = new_coor.add(d);
                if ( level.getCell(state, new_coor) != Cell.EMPTY ) {
                   
                    if ( (level.getCell(state, new_coor) instanceof Mage)  && (level.getCell(state, new_coor).teamId!="Purple team")&&(mage.mana>=10)&&(level.getCell(state, new_coor).status!=Status.DEAD)) {
                        target_mage = d;
                        steps_to_mage=step;
                    } else if ( level.getCell(state, new_coor) instanceof FireballSpell ) {
                        target_spell = d;
                        steps_to_spell=step;
                    }
                    else if (level.getCell(state, new_coor) instanceof Bottle)
                    {
                        target_bottle=d;
                        steps_to_bottle=step;

                    }
                    break top;
                }
            }
        }
        console.log(step);
        if (target_mage && steps_to_mage<=12) {
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();            
            action.spell.dir = target_mage;
            
        } else if (target_bottle&&(steps_to_bottle==1))
        {
            action.type = ActionType.MOVE;
            action.dir = target_bottle;
        }
        
        
        
        else if (target_spell && steps_to_spell<=12) {
            if ( target_spell == dir[0] || target_spell == dir[1] ) {
                if ( level.getCell(state,coor.add(dir[2])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[2];
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[3];
                }
            } else if ( target_spell == dir[2] || target_spell == dir[3] ) {
                if ( level.getCell(state,coor.add(dir[0])) == Cell.EMPTY ) {
                    action.type = ActionType.MOVE;
                    action.dir = dir[0];                
                } else {
                    action.type = ActionType.MOVE;
                    action.dir = dir[1];
                }
            } 
        } else {  
            let n = Math.floor(Math.random() * dir.length);
            action.type = ActionType.MOVE;
            action.dir = dir[n]; 
        }     
        return action;  
    }
}


5
function toOne(num) {
    if(num>1) num=1;
    else if(num<-1) num=-1;
    return num
}
 
function checkCell(state,xy,id) {
    let result = false;
    const myMage = getMageById(state,id);
    for(var i = 0;i<state.spells.length;i++) {
        const spell = state.spells[i];
        for(var j = 0;j<=MAGE_TICK+1;j++) {
            if(spell.xy.add({x: spell.dir.x*j,y: spell.dir.y*j}).equals(xy)) result=true;
        }
    }
    for(var i = 0;i<state.mages.length;i++) {
        const mage = state.mages[i];
        if(mage.id!==id&&mage.teamId!=myMage.teamId&&((mage.xy.x===xy.x&&Math.abs(mage.xy.y-xy.y)<=MAGE_TICK)||(mage.xy.y===xy.y&&Math.abs(mage.xy.x-xy.x)<=MAGE_TICK)||((mage.xy.x-xy.x===mage.xy.y-xy.y)&&(mage.xy.y-xy.y<=MAGE_TICK))||((mage.xy.x-xy.x===-(mage.xy.y-xy.y))&&(mage.xy.y-xy.y<=MAGE_TICK||mage.xy.x-xy.x<=MAGE_TICK)))) {
            result=true;
        }
    }
    return result;
}
 
function getMageById(state,id) {
    for(var mage of state.mages) {
        if(mage.id===id) return mage;
    }
    return false;
}
 
function nearestMage(state,id) {
    const myMage = getMageById(state,id);
    const xy=myMage.xy;
    var nearestMage;
    for(var i = 0;i<state.mages.length;i++) {
        const mage = state.mages[i];
        if(mage.id!=id&&mage.teamId!=myMage.teamId&&nearestMage===undefined) nearestMage=mage;
        if(mage.id!=id&&mage.teamId!=myMage.teamId&&rast(state,xy,mage.xy).num<rast(state,xy,nearestMage.xy).num) nearestMage=mage;
    }
    const res = rast(state,xy,nearestMage.xy);
    return {mage: nearestMage,dir: res.dir, num: res.num};
}
 
function rast(state,xy,exy) {
    var num;
    if(exy.x-xy.x<exy.y-xy.y) {
        num = exy.y-xy.y;
    } else {
        num = exy.x-xy.x;
    }
    return {dir: new Direction(toOne(exy.x-xy.x),toOne(exy.y-xy.y)), num: num};
}
 
function nearestBottle(state,need,xy) {
    var nearest;
    for(var i = 0;i<state.bottles.length;i++) {
        const bottle = state.bottles[i];
        if(nearest===undefined&&bottle.type===need) nearest=bottle;
        if(bottle.type===need&&rast(state,xy,bottle.xy).num<rast(state,xy,nearest.xy).num) nearest=bottle;
    }
    if(nearest===undefined) return false;
    const res = rast(state,xy,nearest.xy);
    return res;
}
 
class StrategyPurpleTeam4 extends MageStrategy {
    turn(state) {
        const MINHPTOHEAL = 50;
        const MINMPTOHEAL = 30;
        const myMage = getMageById(state,this.id);
        const dirs = [new Direction(-1,1),new Direction(0,1),new Direction(1,1),new Direction(1,0),new Direction(1,-1),new Direction(0,-1),new Direction(-1,-1),new Direction(-1,0)];
        const maxX = game.level.width;
        const maxY = game.level.height;
        let minMyTeamHp = {hp: 120,mage: null};
        let numOfHealBottle = 0;
        let numOfManaBottle = 0;
        for(var mage of state.mages) {
            if(mage.teamId==myMage.teamId&&mage.id!=this.id&&mage.health<minMyTeamHp.hp) {
                minMyTeamHp.hp = mage.health;
                minMyTeamHp.mage = mage;
            }
        }
        for(var bottle of state.bottles) {
            if(bottle.type==='health') numOfHealBottle++;
            else numOfManaBottle++;
        }
        for(var i = dirs.length-1;i>0;i--) {
            if((dirs[i].x+myMage.xy.x>=maxX-1)||(dirs[i].x+myMage.xy.x===0)||(dirs[i].y+myMage.xy.y>=maxY-1)||(dirs[i].y+myMage.xy.y===0)) dirs.splice(i,1);
        }
        const goodDirs = [];
        let action = {id: this.id};
        let needMove = checkCell(state,myMage.xy,this.id);
        if(minMyTeamHp<=20&&myMage.mana>=HEAL_COST&&myMage.health>=50) {
            action.type=ActionType.CAST;
            action.spell = new HealSpell();
            action.spell.targetId=minMyTeamHp.mage.id;
        } else if(needMove) {
            for(var i = dirs.length-1;i > 0;i--) {
                if(!checkCell(state,myMage.xy.add(dirs[i]),this.id)) {
                    goodDirs.push(dirs[i]);
                }
            }
            if(goodDirs.length!==0) {
                action.type=ActionType.MOVE;
                action.dir=goodDirs[Math.floor(Math.random() * goodDirs.length)];
            } else {
                action.type=ActionType.MOVE;
                action.dir=dirs[Math.floor(Math.random() * dirs.length)];
            }
        } else {
            if(myMage.health<=MINMPTOHEAL) {
                const nearBottle = nearestBottle(state,'health',myMage.xy);
                if(numOfHealBottle!=0&&nearBottle.num<=8) {
                    action.type=ActionType.MOVE;
                    action.dir=nearBottle.dir;
                } else if(numOfHealBottle!=0&&nearBottle.num>8&&myMage.mana>=HEAL_COST) {
                    action.type=ActionType.CAST;
                    action.spell = new HealSpell();
                    action.spell.targetId=this.id;
                } else if(myMage.health<=20&&myMage.mana>=HEAL_COST) {
                    action.type=ActionType.CAST;
                    action.spell = new HealSpell();
                    action.spell.targetId=this.id;
                } else {
                    const enemy = nearestMage(state,this.id);
                    if(enemy.num<8) {
                        action.type = ActionType.CAST;
                        action.spell = new FireballSpell();
                        action.spell.dir = enemy.dir;
                    } else {
                        action.type = ActionType.MOVE;
                        action.dir = enemy.dir;
                    }
                }
            } else if(minMyTeamHp.hp<=50&&myMage.mana>=HEAL_COST) {
                action.type=ActionType.CAST;
                action.spell = new HealSpell();
                action.spell.targetId=minMyTeamHp.mage.id;
            } else if(myMage.mana<=MINMPTOHEAL&&numOfManaBottle!=0) {
                const nearBottle = nearestBottle(state,'mana',myMage.xy);
                action.type=ActionType.MOVE;
                action.dir = nearBottle.dir;
            } else {
                let chance = Math.floor(Math.random() * 100);
                if(chance<30) {
                    action.type = ActionType.CAST;
                    action.spell = new FireballSpell();            
                    action.spell.dir=nearestMage(state,this.id).dir;
                } else if(chance>=90){
                    action.type=ActionType.MOVE;
                    action.dir=dirs[Math.floor(Math.random() * dirs.length)];
                } else if(chance>=30&&chance<90) {
                    const enemy = nearestMage(state,this.id);
                    if(enemy.num<=MAGE_TICK&&Math.floor(Math.random() * 100)<30) {
                        action.type = ActionType.CAST;
                        action.spell = new FireballSpell(); 
                        action.spell.dir = enemy.dir;
                    } else {
                        action.type=ActionType.MOVE;
                        action.dir=enemy.dir;
                    }
                } else {
                    action.type=ActionType.MOVE;
                    action.dir=dirs[Math.floor(Math.random() * dirs.length)];
                }
            }
        }
        return action;
    }
}