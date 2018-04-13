'use strict';

class Level {
    constructor(plan) {
        this.plan = plan.trim().split('\n');
        this.height = this.plan.length;
        this.width = this.plan[0].length;
    }

    getCell(state, xy) {
        // check static content
        if (this.plan[xy.y][xy.x] != Cell.EMPTY) {
            return this.plan[xy.y][xy.x];
        }

        // check dynamic content    
        // TODO: implement check for a mage

        return Cell.EMPTY;
    }
}

class HtmlLevel extends Level {
    init(initState) {
        let planDiv = document.getElementById('plan');
        planDiv.style.width = this.width * this.gridSize + 'px';
        planDiv.style.height = this.height * this.gridSize + 'px';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.plan[y][x] == '#') {
                    let wall = this.createDiv(new XY(x, y), 'grey');
                    planDiv.appendChild(wall);
                }
            }
        }

        for (let mage of initState.mages) {
            let mageDiv = this.createDiv(mage.xy, mage.color);
            mageDiv.id = 'mage' + mage.id;            
            planDiv.appendChild(mageDiv);
        }
    }

    update(state) {
        let planDiv = document.getElementById('plan');

        for (let mage of state.mages) {
            let mageDiv = document.getElementById('mage' + mage.id);
            mageDiv.style.top = mage.xy.y * GRID_SIZE + 'px';
            mageDiv.style.left = mage.xy.x * GRID_SIZE + 'px';
        }        
    }

    createDiv(xy, color) {
        let div = document.createElement('div');
        div.style.width = GRID_SIZE + 'px';
        div.style.height = GRID_SIZE + 'px';
        div.style.backgroundColor = color;
        div.style.top = xy.y * GRID_SIZE + 'px';
        div.style.left = xy.x * GRID_SIZE + 'px';
        div.style.position = 'absolute';
        return div;
    }
}