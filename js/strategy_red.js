'use strict';

 function spellHere(state,xy,dir) { 
   for (let spell of state.spells){
        if(xy.x == spell.xy.x && xy.y == spell.xy.y){
            if (dir.x == spell.dir.x && dir.y == spell.dir.y){
                return true;
            }
        }  
    }
 }

 class StrategyRedTeam1 extends MageStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {}

    turn(state) {
        let i , j;
        let borderX , borderY , borderH ;
        let didDodged, moveDone , danger;
        //          horiz  vertic  main-d r-diag
        let key = ['open', 'open', 'open', 'open'];
        moveDone = false;
                                // Вытаскиваем данные //
            let action = {id: this.id};
            let opponent = new XY();
            let my = new XY();

                for (let mage of state.mages) {
                    if (this.id == mage.id) {
                        my = mage.xy;
                    }
                }
                            // Вытаскиваем данные  //

            for(i = 1 ; i >=-1 ; i-=2) {
                    if (i > 0){
                        borderX = 0;
                        borderY = 0; 
                        borderH = level.width ;
                    }else{ 
                        borderX = level.width * (-1);
                        borderY = level.height * (-1);
                        borderH = 0;    
                    }
                for(j = 1; j<=4; j++) {
                    // x , y  
                    if (i*(my.x - j*i) > borderX && key[0] == 'open') {
                        if (spellHere(state, new XY((my.x - j*i),my.y),new Direction(i,0)) == true) {
                             key[0] = 'close';
                        }  
                    } 
                    if (i*(my.y - j*i) > borderY && key[1] == 'open') {
                   //console.log('y =' + (my.y - j*i));   
                        if (spellHere(state, new XY(my.x,(my.y - j*i)),new Direction(0,i)) == true) {
                             key[1] = 'close';
                        } 
                    }    
                    // main diag
                    if (i*(my.y - j*i) > borderY && i*(my.x - j*i) > borderX && key[2] == 'open') {
                        if (spellHere(state, new XY((my.x - j*i),(my.y - j*i)),new Direction(i,i)) == true) {
                             key[2] = 'close';
                        } 
                    }    
                    //  secondary diag
                    if (i*(my.y - j*i) > borderY && i*(my.x + j*i) < borderH && key[3] == 'open') { 
                        if (spellHere(state, new XY((my.x + j*i),(my.y - j*i)),new Direction(-i,i) ) == true) {
                             key[3] = 'close';
                        }
                    }    
                }
            }  

            console.log(key); 
    // Анализ данных //
    if (key[0] == 'open' && key[1] == 'open' && key[2] == 'open' && key[3] == 'open')
        danger = false;
    else
        danger = true;


    console.log('danger is  ' + danger);

    if (danger == true) {
      if (key[0] == 'close' || key[1] == 'close') {

            if (key[0] == 'open') {

                if (level.plan[my.y][my.x - 1] == Cell.EMPTY ) {
                    my.x -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,0);
                        moveDone = true;
                }else if (level.plan[my.y][my.x + 1] == Cell.EMPTY) {
                    my.x += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,0);
                        moveDone = true;
                }

            }else if (key[1] == 'open'){

                    if (level.plan[my.y - 1][my.x] == Cell.EMPTY ) {
                        my.y -= 1;
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,-1);
                            moveDone = true;
                    }else if (level.plan[my.y + 1][my.x] == Cell.EMPTY) {
                        my.y += 1;
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,1);
                            moveDone = true;
                    }
            }else{
                  
                }
            } 
        }

    if (danger == true) {

        if ((key[0] == 'open' || key[1] == 'open') && (key[2] == 'close' || key[3] == 'close')) {

            if (key[0] == 'open') {
                if (level.plan[my.y][my.x - 1] == Cell.EMPTY ) {
                    my.x -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,0);
                        moveDone = true;
                }else if (level.plan[my.y][my.x + 1] == Cell.EMPTY) {
                    my.x += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,0);
                        moveDone = true;
                }

            }else if(key[1] == 'open'){

                if (level.plan[my.y - 1][my.x] == Cell.EMPTY ) {
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(0,-1);
                        moveDone = true;
                }else if (level.plan[my.y + 1][my.x] == Cell.EMPTY) {
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(0,1);
                        moveDone = true;
                }
            }
        }

        let checkLoop;
        checkLoop = false;

        if ((key[0] == 'close' && key[1] == 'close') && (key[2] == 'close' || key[3] == 'close')) {
        start: while(checkLoop == false){
            if (key[2] == 'close' && key[3] == 'close') {
                moveDone = false ;
                checkLoop = true;
            }else if (key[2] == 'close') {

                if (level.plan[my.y + 1][my.x - 1] == Cell.EMPTY) {
                    my.x -= 1;
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,1);
                        moveDone = true;
                    checkLoop = true;
                }else if(level.plan[my.y - 1][my.x + 1] == Cell.EMPTY){
                    my.x += 1;
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,-1);
                        moveDone = true;
                    checkLoop = true;
                }else{
                    key[3] = 'close';
                    continue start;
                }

            }else{

                if (level.plan[my.y - 1][my.x - 1] == Cell.EMPTY) {
                    my.x -= 1;
                    my.y -= 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(-1,-1);
                        moveDone = true;
                    checkLoop = true;
                }else if(level.plan[my.y + 1][my.x + 1] == Cell.EMPTY){
                    my.x += 1;
                    my.y += 1;
                    action.type = ActionType.MOVE; 
                    action.dir = new Direction(1,1);
                        moveDone = true;
                    checkLoop = true;
                }else{
                    key[2] = 'close';
                    continue start;
                }
               
            }
        }
        }
    }           
//////////////////////////////////////// УКЛОНЕНИЕ  //////////////////////////////////////////////////////////////////////
    let deltaX;
    let deltaY;
        let vectorX ;
        let vectorY ;      
    let New_distance;
    let targetBottle = new XY();
//////////////////////////////////////    Helth   /////////////////////////////////////////////////////////////////////////

    if ( moveDone == false ) {

    let HealBottleDistance = 100;
      let myHealth; 


                for (let mage of state.mages){
                     if (mage.id == this.id){
                         myHealth = mage.health;
                     }
                }
 
                 if ( myHealth < 40 ){
                    for (let bottle of state.bottles){
                        deltaX = Math.abs(bottle.xy.x - my.x);                
                        deltaY = Math.abs(bottle.xy.y - my.y);
                        New_distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
                            if (New_distance < HealBottleDistance && bottle.type == 'health'){
                                HealBottleDistance = New_distance;
                                 targetBottle = bottle.xy; 
                            }     
                    }
 
                        if (Math.abs(targetBottle.x - my.x) !== 0) 
                            vectorX = ( targetBottle.x - my.x ) / Math.abs(targetBottle.x - my.x); 
                        else 
                            vectorX = 0;
 
                        if (Math.abs(targetBottle.y - my.y) !== 0)
                            vectorY = ( targetBottle.y - my.y ) / Math.abs(targetBottle.y - my.y);
                        else {
                            vectorY = 0;
                        }
                            action.type = ActionType.MOVE;
                            action.dir = new Direction(vectorX,vectorY);
                            console.log ('DeltaX = ', vectorX, ' so deltaY =', vectorY);
                            moveDone = true;
                }
}
//////////////////////////////////////    Mana     ///////////////////////////////////////////////////////////////////////

    if ( moveDone == false ) {
    	    let Bottle_distance = 100; 
                let myMana; 

                for (let mage of state.mages){
                    if (mage.id == this.id){
                        myMana = mage.mana;
                    }
                }

                if ( myMana < 10 ){
                    for (let bottle of state.bottles){
                        deltaX = Math.abs(bottle.xy.x - my.x);                
                        deltaY = Math.abs(bottle.xy.y - my.y);
                        New_distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
                            if (New_distance < Bottle_distance && bottle.type == 'mana'){
                                Bottle_distance = New_distance;
                                targetBottle = bottle.xy; 
                            }     
                    }

                        if (Math.abs(targetBottle.x - my.x) !== 0) 
                            vectorX = ( targetBottle.x - my.x ) / Math.abs(targetBottle.x - my.x); 
                        else 
                            vectorX = 0;

                        if (Math.abs(targetBottle.y - my.y) !== 0)
                            vectorY = ( targetBottle.y - my.y ) / Math.abs(targetBottle.y - my.y);
                        else {
                            vectorY = 0;
                        }
                            action.type = ActionType.MOVE;
                            action.dir = new Direction(vectorX,vectorY);
                            console.log ('DeltaX = ', vectorX, ' so deltaY =', vectorY);
                            moveDone = true;
                }
        }

///////////////////////////////////////////   Атака    //////////////////////////////////////////////////////////////

    let readyToFire = false;

if ( moveDone == false ){
    let Old_distance = 100;
    
        for (let mage of state.mages){
                deltaX = Math.abs(mage.xy.x - my.x);                
                deltaY = Math.abs(mage.xy.y - my.y);
                New_distance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
                    if (this.id != mage.id && mage.teamId != this.team.id && mage.status != Status.DEAD && New_distance < Old_distance){
                        Old_distance = New_distance;
                        opponent = mage.xy; 
                }     
        }
         
        deltaX = Math.abs(opponent.x - my.x);                // надо вытащить данные и записать их в координаты 
        deltaY = Math.abs(opponent.y - my.y);

                    if (deltaX != 0) 
                        vectorX = ( opponent.x - my.x ) / Math.abs(opponent.x - my.x); 
                    else 
                        vectorX = 0;

                    if (deltaY != 0)
                        vectorY = ( opponent.y - my.y ) / Math.abs(opponent.y - my.y);
                    else
                        vectorY = 0;


if ( ((Math.abs(deltaX - deltaY) <= deltaX ) || (Math.abs(deltaX - deltaY) <= deltaY ) ) && deltaX > 1 && deltaY >1) {
    
    if (((deltaX - deltaY) == 0) && (deltaX > 3)){
        readyToFire = true ;
    }else if (deltaX < deltaY) {
        action.type = ActionType.MOVE; 
        if (deltaX < 5){ 
            action.dir = new Direction(0,vectorY); 
             readyToFire = false;
        }
        else{
            action.dir = new Direction(vectorX,vectorY); 
            readyToFire = false;
        }
        
    }else if (deltaX > deltaY) {
        action.type = ActionType.MOVE;
        if (deltaY < 5){
            action.dir = new Direction(vectorX,0);
            readyToFire = false;
        }
        else{
            action.dir = new Direction(vectorX,vectorY);
            readyToFire = false; 
        }
    }

} else if( (deltaX == 0 && deltaY > 1 ) || (deltaY == 0 && deltaX > 1 ) ) 
    {    
        action.type = ActionType.CAST;
        action.spell = new FireballSpell();            
        action.spell.dir = new Direction(vectorX,vectorY); // вектор атаки
            readyToFire = false;
    }
    else
    {
                if (deltaX > 1 && deltaY > 1) { //main if
                    if (deltaX < deltaY){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(vectorX,0); 
                           readyToFire = false;
                    }else if(deltaX > deltaY){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(0,vectorY);
                           readyToFire = false; 
                    } else {
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(vectorX,0); 
                           readyToFire = false;
                    }
                }else if(deltaX == 1 && deltaY == 1){
                        action.type = ActionType.MOVE; 
                        action.dir = new Direction(-vectorX,-vectorY);
                        readyToFire = false; 
                }else if (deltaX == 1 || deltaY == 1) {
                    if (deltaX == 1){  
                        if (deltaY > 3){                         // or 3 - better
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,vectorY); 
                               readyToFire = false;
                        }else if(deltaY == 0){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(-vectorX,0); 
                               readyToFire = false;                            
                        }else{
                            readyToFire = true;
                        }

                    }else if (deltaY == 1) {
                        if (deltaX > 3) {
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(vectorX,0); 
                               readyToFire = false;
                        }else if(deltaX == 0){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,-vectorY); 
                               readyToFire = false;  
                        }else{
                            readyToFire = true;
                        }
                    } 
                }   
            } 
///// ready to fire
                if (readyToFire == true) {              
                    if ((deltaX - deltaY == 0)) 
                    {
                        action.type = ActionType.CAST;
                        action.spell = new FireballSpell();            
                        action.spell.dir = new Direction(vectorX,vectorY);        
                    }
                    else if (deltaX + deltaY < 2) {
                        if ( level.plan[my.y][my.x - vectorX] == Cell.EMPTY){ 
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction((-1)*vectorX,0); 
                        }else if( level.plan[my.y - vectorY][my.x] == Cell.EMPTY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,(-1)*vectorY); 
                        }   
                        else {                          // êàæåòñÿ òóò íàäî äîïèëèòü
                            // fireball - attack 
                        }
                    }else{
                        if (deltaX < deltaY){
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(vectorX,0); 
                        }else{
                            action.type = ActionType.MOVE; 
                            action.dir = new Direction(0,vectorY); 
                        }
                    }  
                }                                         // end if
           
        }   
////////////////////////////////////////////////////////////////////////////////////////////////////////        
        return action;
    }
}  

class StrategyRedTeam2 extends StrategyRedTeam1 {

}
class StrategyRedTeam3 extends StrategyRedTeam1 {
    
}
class StrategyRedTeam4 extends StrategyRedTeam1 {
    
}