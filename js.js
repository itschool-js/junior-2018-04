/*function RandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


var x = RandInt(1, 80);
var y = RandInt(1, 40);

window.alert(x+' '+y);  */

var plan = `
######################
#                    #
#                    #
#                    #
#    #               #
#                    #
#        #           #
#                    #
##                   #
#                    #
#                    #
######################`
;

plan = plan.trim().split('\n');

let planW = plan[0].length;
let planH = plan.length;

plan[2][3] = 'M';

var mageX = 1;
var mageY = 1;

function printPlan(){
let s = '';
for (var i=0; i < planH ; i++) {
    for (var j =0; j < planW ; j++){
        if (j == mageX && i == mageY){
            s+= 'M';
        }else{
            s+= plan[i][j];
        }
    }  
    s+='\n';
}
    console.log(s);
}

var realX = 3;
var realY = 3;


function moveL(){
   if (plan[mageY][mageX-1]==' '){
       mageX--;
       realX-=48;
   }
    document.getElementById('magew').style.left = realX+'px';
    printPlan();
}


function moveR(){
   if (plan[mageY][mageX+1]==' '){
       mageX++;
       realX+=48;
   }
    document.getElementById('magew').style.left = realX+'px';
    printPlan();
}

function moveT(){
   if (plan[mageY-1][mageX]==' '){
       mageY--;
       realY-=48;
   }
    document.getElementById('magew').style.top = realY+'px';
    printPlan();
}

function moveB(){
   if (plan[mageY+1][mageX]==' '){
       mageY++;
       realY+=48;
   }
    document.getElementById('magew').style.top = realY+'px';
    printPlan();
}

/////////////////////////////////////////////////////////////////

function moveLT(){
   if (plan[mageY][mageX-1]==' ' && plan[mageY-1][mageX]==' '){
       mageX--;
       mageY--;
       realY-=48;
       realX-=48;
   }
    document.getElementById('magew').style.left = realX+'px';
    document.getElementById('magew').style.top = realY+'px';
    printPlan();
}

function moveRT(){
   if (plan[mageY][mageX+1]==' ' && plan[mageY-1][mageX]==' '){
       mageX++;
       mageY--;
       realY-=48;
       realX+=48;
   }
    document.getElementById('magew').style.left = realX+'px';
    document.getElementById('magew').style.top = realY+'px';
    printPlan();
}

function moveLB(){
   if (plan[mageY][mageX-1]==' ' && plan[mageY+1][mageX]==' '){
       mageX--;
       mageY++;
       realY+=48;
       realX-=48;
   }
    document.getElementById('magew').style.left = realX+'px';
    document.getElementById('magew').style.top = realY+'px';
    printPlan();
}

function moveRB(){
   if (plan[mageY][mageX+1]==' ' && plan[mageY+1][mageX]==' '){
       mageX++;
       mageY++;
       realY+=48;
       realX+=48;
   }
    document.getElementById('magew').style.left = realX+'px';
    document.getElementById('magew').style.top = realY+'px';
    printPlan();
}


var dir = {};

dir.x = 3;
dir.y = 5;

/*

function direct(dir) {
    //Перемещение вверх вправо
    if (dir.y<0 && dir.x>0){
            if (Math.abs(dir.y) <= Math.abs(dir.x)){
                var a = Math.abs(dir.y)
                var b = Math.abs(dir.x) }else{
                var a = Math.abs(dir.x)
                var b = Math.abs(dir.y)
                }
            var c = 0;
            while (c < a) {
                moveRT();
                c++;
            }
            c = 0;
            while (c < Math.abs(a-b)) {
            if (Math.abs(dir.y) <= Math.abs(dir.x)){
                moveR();
            }else{
                moveT();
            }  
            c++;
        }
    }
    //Перемещение вверх влево
}

*/

//Функция для 1-го задания

function direct(dir) {
    //Перемещение вверх вправо
    var napr = 0;
    if (Math.abs(dir.y) <= Math.abs(dir.x)){
        var a = Math.abs(dir.y)
        var b = Math.abs(dir.x) }else{
        var a = Math.abs(dir.x)
        var b = Math.abs(dir.y)
        }
        var c = 0;
        while (c < a) {
                 if (dir.y<0 && dir.x>0){
                     moveRT();
                     napr = 1;
                 }else  if (dir.y<0 && dir.x<0){
                     moveLT();
                     napr = 2;
                 }
                 else  if (dir.y>0 && dir.x<0){
                     moveLB();
                     napr = 3;
                 }
                 else  if (dir.y>0 && dir.x>0){
                     moveRB();
                     napr = 4;
                 }
            c++;
        }
        c = 0;
        switch (napr) {
        case 1:
        while (c < Math.abs(a-b)) {
        if (Math.abs(dir.y) <= Math.abs(dir.x)){
            moveR();
        }else{
            moveT();
        }  
        c++;
        }    
        break;
        
        case 2:
        while (c < Math.abs(a-b)) {
        if (Math.abs(dir.y) <= Math.abs(dir.x)){
            moveL();
        }else{
            moveT();
        }  
        c++;
        }    
        break;
                
        case 3:
        while (c < Math.abs(a-b)) {
        if (Math.abs(dir.y) <= Math.abs(dir.x)){
            moveL();
        }else{
            moveB();
        }  
        c++;
        }    
        break;
                
        case 4:
        while (c < Math.abs(a-b)) {
        if (Math.abs(dir.y) <= Math.abs(dir.x)){
            moveR();
        }else{
            moveB();
        }  
        c++;
        }    
        break;
        }
    }
    //Перемещение вверх влево

//Функция для 2-го задания

function probeg(){
  while (mageX < (planW - 2)){
        while (mageY < (planH - 2)){
      if (plan[mageY+1][mageX] == ' '){
            moveB();
        }else
        {  
        break;
        }
      }
      if (plan[mageY][mageX+1] == ' '){
            moveR();       
      }
    while(mageY > 1){
        if (plan[mageY-1][mageX] == ' '){
            moveT();
         } else 
         {
        moveR();
        }
        }
      }
}


let var1 = 3;
let var2 = 2

var2 = [var1, var1 = var2][0]

//alert(a+ ','+b);




























