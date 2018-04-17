'use strict';

class Level {
    constructor(plan) {
        this.plan = plan.trim().split('\n');
        this.height = this.plan.length;
        this.width = this.plan[0].length;
    }

    /**
     * 
     * @param {*} state 
     * @param {*} xy 
     */
    getCell(state, xy) {
        // check static content
        if (this.plan[xy.y][xy.x] != Cell.EMPTY) {
            return this.plan[xy.y][xy.x];
        }

        // check dynamic content    
        for (let mage of state.mages) {
            if (mage.xy.equals(xy)) {
                return mage;
            }
        }
        for (let spell of state.spells) {
            if (spell.action.type != ActionType.GONE && spell.xy.equals(xy)) {
                return spell;
            }
        }
        for (let bottle of state.bottles) {
            if (bottle.xy.equals(xy)) {
                return bottle;
            }
        }

        return Cell.EMPTY;
    }

    getRandomEmptyCell(state) {
        let xy;
        do {
            xy = new XY(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
        } while (this.getCell(state, xy) != Cell.EMPTY);
        return xy;
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
                    let wall = HtmlLevel.createDiv(new XY(x, y), 'grey');
                    planDiv.appendChild(wall);
                }
            }
        }

        for (let mage of initState.mages) {
            let mageDiv = HtmlLevel.createDiv(mage.xy, mage.color);
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

        // level spells
        for (let spell of state.spells) {
            if (spell.action.type == ActionType.NEW) {
                let spellDiv = HtmlLevel.createDiv(spell.xy, spell.color);
                spellDiv.id = 'spell' + spell.id;
                planDiv.appendChild(spellDiv);
            } else if (spell.action.type == ActionType.MOVE) {
                let spellDiv = document.getElementById('spell' + spell.id);
                spellDiv.style.top = spell.xy.y * GRID_SIZE + 'px';
                spellDiv.style.left = spell.xy.x * GRID_SIZE + 'px';
            } else if (spell.action.type == ActionType.GONE || spell.action.type == ActionType.APPLY) {
                let spellDiv = document.getElementById('spell' + spell.id);
                planDiv.removeChild(spellDiv);
            }
        }

        // bottles
        for (let bottle of state.bottles) {
            if (bottle.action.type == ActionType.NEW) {
                let bottleDiv = HtmlLevel.createDiv(bottle.xy, bottle.type == HEALTH ? 'red' : 'blue');
                bottleDiv.id = 'bottle' + bottle.id;                
                planDiv.appendChild(bottleDiv);
            } else if (bottle.action.type == ActionType.APPLY) {
                let bottleDiv = document.getElementById('bottle' + bottle.id);
                planDiv.removeChild(bottleDiv);
            }
        }
    }

    static createDiv(xy, color) {
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