'use strict';

let plan = `
########################################
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
#                                      #
########################################`;

plan = plan.trim().split('\n');

let planW = plan[0].length;
let planH = plan.length;

let mageX = 3;
let mageY = 2;

function printPlan() {
    let s = '';
    for (let i = 0; i < planH; i++) {
        for (let j = 0; j < planW; j++) {
            if (j == mageX && i == mageY) {
                s += 'M';
            } else {
                s += plan[i][j];
            }
        }
        s += '\n';
    }
    console.log(s);
}

printPlan();

function moveLeft() {
    if (plan[mageY][mageX - 1] == ' ') {
        mageX--;
    }
    printPlan();
}

function moveRight() {
    if (plan[mageY][mageX + 1] == ' ') {
        mageX++;
    }
    printPlan();
}

function move(dir) {
    if (Math.abs(dir.x) <= 1 && Math.abs(dir.y) <= 1) {        
        if (plan[mageY + dir.y][mageX + dir.x] == ' ') {
            mageX += dir.x;
            mageY += dir.y;
        }
    }
    printPlan();    
}