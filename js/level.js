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
        planDiv.style.width = this.width * GRID_SIZE + 'px';
        planDiv.style.height = this.height * GRID_SIZE + 'px';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.plan[y][x] == '#') {
                    let wall = HtmlLevel.createDiv(new XY(x, y), 'wall');
                    wall.style.backgroundSize = 'auto';
                    planDiv.appendChild(wall);
                }
            }
        }

        for (let mage of initState.mages) {
            let mageDiv = HtmlLevel.createDiv(mage.xy, 'mage_' + mage.color);
            mageDiv.id = 'mage' + mage.id;
            mageDiv.style.zIndex = 1;
            planDiv.appendChild(mageDiv);
        }

        let table = document.getElementById('teams').getElementsByTagName('tbody')[0];
        for (let team of initState.teams) {
            let tdName = document.createElement('td');
            tdName.innerHTML = team.id;
            let tdScore = document.createElement('td');
            tdScore.id = 'td' + team.id;
            tdScore.innerHTML = team.score;
            let tr = document.createElement('tr');
            let color = team.color;
            if (color == 'blue') { color = 'dodgerblue'; }
            if (color == 'purple') { color = 'mediumpurple'; }
            tr.style.color = color;
            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            table.appendChild(tr);
        }
    }

    update(state) {
        let planDiv = document.getElementById('plan');

        for (let mage of state.mages) {
            if (!mage.action) {
                continue;
            }

            let mageDiv = document.getElementById('mage' + mage.id);

            if (mage.action.type == ActionType.KILLED) {
                mageDiv.style.opacity = 0;
                continue;
            }

            if (mage.action.type == ActionType.NEW) {
                mageDiv.style.opacity = 1;
            }

            if (mage.status == Status.LIVE && state.tick % MAGE_TICK == 0) {
                let top = mage.xy.y * GRID_SIZE + 'px';
                let left = mage.xy.x * GRID_SIZE + 'px';
                mageDiv.animate({ top: [mageDiv.style.top, top], left: [mageDiv.style.left, left] }, TICK_DURATION * MAGE_TICK);
                mageDiv.style.top = top;
                mageDiv.style.left = left;
            }
        }

        // level spells
        for (let spell of state.spells) {
            if (spell.action.type == ActionType.NEW) {
                let spellDiv = HtmlLevel.createDiv(spell.xy, 'fireball');
                spellDiv.id = 'spell' + spell.id;
                spellDiv.style.zIndex = 2;
                spellDiv.animate({ transform: ['rotate(0)', 'rotate(360deg)'] }, { duration: TICK_DURATION * 20, iterations: Infinity });
                planDiv.appendChild(spellDiv);
            } else if (spell.action.type == ActionType.MOVE) {
                let spellDiv = document.getElementById('spell' + spell.id);
                let top = spell.xy.y * GRID_SIZE + 'px';
                let left = spell.xy.x * GRID_SIZE + 'px';
                spellDiv.animate({ top: [spellDiv.style.top, top], left: [spellDiv.style.left, left] }, TICK_DURATION * SPELL_TICK);
                spellDiv.style.top = top;
                spellDiv.style.left = left;
            } else if (spell.action.type == ActionType.GONE || spell.action.type == ActionType.APPLY) {
                let spellDiv = document.getElementById('spell' + spell.id);
                planDiv.removeChild(spellDiv);
            }
        }

        // bottles
        for (let bottle of state.bottles) {
            if (bottle.action.type == ActionType.NEW) {
                let bottleDiv = HtmlLevel.createDiv(bottle.xy, 'bottle_' + bottle.type);
                bottleDiv.id = 'bottle' + bottle.id;
                bottleDiv.style.zIndex = 0;
                planDiv.appendChild(bottleDiv);
            } else if (bottle.action.type == ActionType.APPLY) {
                let bottleDiv = document.getElementById('bottle' + bottle.id);
                planDiv.removeChild(bottleDiv);
            }
        }

        // table
        for (let team of state.teams) {
            let tdScore = document.getElementById('td' + team.id);
            tdScore.innerHTML = team.score;
        }

    }

    static createDiv(xy, icon) {
        let div = document.createElement('div');
        div.style.width = GRID_SIZE + 'px';
        div.style.height = GRID_SIZE + 'px';
        div.style.backgroundImage = `url(img/${icon}.png)`;
        div.style.backgroundSize = 'cover';
        div.style.top = xy.y * GRID_SIZE + 'px';
        div.style.left = xy.x * GRID_SIZE + 'px';
        div.style.position = 'absolute';
        return div;
    }
}