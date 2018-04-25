'use strict';

class TeamStrategy extends MageStrategy {

    constructor(myTeam, myId) {
        super(myTeam, myId);
    }

    init(level, state) {

    }

    returnDir(myId, state) {

        let tmpId;
        let iAm;

        let mage1friend = getItemById(state.mages, 'yellow1');
        let mage2friend = getItemById(state.mages, 'yellow2');
        let mage3friend = getItemById(state.mages, 'yellow3');
        let mage4friend = getItemById(state.mages, 'yellow4');

        let myTeamFriends = [];

        myTeamFriends.push(mage1friend);
        myTeamFriends.push(mage2friend);
        myTeamFriends.push(mage3friend);
        myTeamFriends.push(mage4friend);

        for (let i = 0; i < myTeamFriends.length; i++) {

            if (myTeamFriends[i].id == myId) {
                iAm = myTeamFriends[i];
            }

        }

        let xPlus = Math.floor((mage1friend.xy.x + mage2friend.xy.x + mage3friend.xy.x + mage4friend.xy.x) / 4);
        let yPlus = Math.floor((mage1friend.xy.y + mage2friend.xy.y + mage3friend.xy.y + mage4friend.xy.y) / 4);

        let m1 = new XY(xPlus - 1, yPlus);
        let m2 = new XY(xPlus, yPlus - 1);
        let m3 = new XY(xPlus + 1, yPlus);
        let m4 = new XY(xPlus, yPlus + 1);

        let mList = [];

        mList.push(m1);
        mList.push(m2);
        mList.push(m3);
        mList.push(m4);

        let mageIdPosition = [];

        let tankPosition = 0;

        for (let i = 0; i < mList.length; i++) {
            let tmpMageId = this.nearMage(mList[i], myTeamFriends);
            for (let i = 0; i < myTeamFriends.length; i++) {
                if (myTeamFriends[i].id == tmpMageId) {
                    myTeamFriends.splice(i, 1);
                    break;
                }
            }
            mageIdPosition[i] = tmpMageId;
            if (tmpMageId == myId) {
                tankPosition = mList[i];
                tmpId = i;
            }
        }



        let action = this.calcDirection(iAm.xy, tankPosition, tmpId);
        action.id = myId;
        return action;
    }

    calcDirection(magePos, inTankPos, tmpId) {

        let action = { type: ActionType.MOVE };



        if (magePos.x != inTankPos.x) {
            if (magePos.x > inTankPos.x) {
                action.dir = new Direction(-1, 0);
            } else {
                action.dir = new Direction(1, 0);
            }
        } else if (magePos.y != inTankPos.y) {
            if (magePos.y > inTankPos.y) {
                action.dir = new Direction(0, -1);
            } else {
                action.dir = new Direction(0, 1);
            }
        } else {
            action.type = ActionType.CAST;
            action.spell = new FireballSpell();
            if (tmpId == 0)
                action.spell.dir = new Direction(-1, 0);
            if (tmpId == 1)
                action.spell.dir = new Direction(0, -1);
            if (tmpId == 2)
                action.spell.dir = new Direction(1, 0);
            if (tmpId == 3)
                action.spell.dir = new Direction(0, 1);

            
        }

        return action;

    }

    calcDistance(point1, point2) {

        return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)

    }

    nearMage(m, myTeamFriends) {
        let minDist = this.calcDistance(m, myTeamFriends[0].xy);
        let minMageId = myTeamFriends[0].id;
        for (let i = 1; i < myTeamFriends.length; i++) {
            let tmpDist = this.calcDistance(m, myTeamFriends[i].xy);
            if (tmpDist < minDist) {
                minDist = tmpDist;
                minMageId = myTeamFriends[i].id;
            }
        }

        return minMageId;

    }


}

class StrategyYellowTeam1 extends TeamStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }
    init(level, state) {
    }

    turn(state) {
        // TODO: implement throwing a Fireball spell from time to time

        /// Стратегия (М* это положение *-ого мага, + это направление стрельбы)
        ///      +
        ///      M2
        ///  + M1  M3 +
        ///      M4
        ///       +

        let action = this.returnDir(this.id, state);

        console.log('dfdsfdsfdsfds',action);

        return action;
    }
}


class StrategyYellowTeam2 extends TeamStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }
    init(level, state) { }

    turn(state) {
        // TODO: implement throwing a Fireball spell from time to time

        /// Стратегия (М* это положение *-ого мага, + это направление стрельбы)
        ///      +
        ///      M2
        ///  + M1  M3 +
        ///      M4
        ///       +


        // let action = { id: this.id };
        // action.type = ActionType.MOVE;
        // action.dir = this.returnDir(this.id, state);
        let action = this.returnDir(this.id, state);

        console.log('Action direction');
        console.log(action.dir);


        return action;
    }
}

class StrategyYellowTeam3 extends TeamStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }
    init(level, state) { }

    turn(state) {
        // TODO: implement throwing a Fireball spell from time to time

        /// Стратегия (М* это положение *-ого мага, + это направление стрельбы)
        ///      +
        ///      M2
        ///  + M1  M3 +
        ///      M4
        ///       +
        let action = this.returnDir(this.id, state);


        return action;
    }
}


class StrategyYellowTeam4 extends TeamStrategy {
    constructor(myTeam, myId) {
        super(myTeam, myId);
    }
    init(level, state) { }

    turn(state) {
        // TODO: implement throwing a Fireball spell from time to time

        //mage1,mage2,mage3,mage4 - маги желтой команды

        /// Стратегия (М* это положение *-ого мага, + это направление стрельбы)
        ///      +
        ///      M2
        ///  + M1  M3 +
        ///      M4
        ///       +


        let action = this.returnDir(this.id, state);


        return action;
    }
}
