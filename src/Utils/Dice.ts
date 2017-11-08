export class Dice {
    sides:number;
    mods:Array<any>;
    tmpMods:Array<any>;
    lastRolls:Array<number>;

    constructor(sides) {
        this.sides = sides;
        this.mods = [];
        this.tmpMods = [];
        this.lastRolls = [];
    }

    // Private
    // ========================================================================
    private random() {
        return (Math.random() * this.sides) + 1;
    }

    private refreshTmpMods() {
        let tmpMods = this.tmpMods;

        tmpMods.forEach(function refresh(mod, i) {
            if (--mod.times === 0) { // eslint-disable-line no-param-reassign
                delete tmpMods[i];
            }
        });
    }

    // Public
    // ========================================================================
    roll(times) {
        let result: number;
        result = this.getResult(times);
        while(this.lastRolls.indexOf(result) != -1){
            result = this.getResult(times);
        }
        this.lastRolls.push(result);
        if(this.lastRolls.length > 3){
            this.lastRolls.shift();
        }
        return result;
    }

    getResult(times) {
        let t = times || 1;
        let res = [];
        let i;

        for (i = 0; i < t; i++) {
            res.push(Math.floor(
                this.random() +
                this.getModsSum() +
                this.getTmpModsSum()
            ));

            this.refreshTmpMods();
        }

        return res.length === 1 ? res[0] : res.reduce(function(a, b){return a+b;});
    }

    // Mods
    // ------------------------------------------------------------------------
    addMod(mod) {
        if (isNaN(mod)) {
            throw new Error('Invalid mod type.');
        }

        this.mods.push(mod);
        return this;
    }

    removeMod(mod) {
        if (isNaN(mod)) {
            throw new Error('Invalid mod type.');
        }

        this.mods.splice(this.mods.indexOf(mod), 1);
        return this;
    }

    resetMods() {
        this.mods = [];
        return this;
    }

    getModsSum() {
        let total = 0;
        this.mods.forEach(function sum(mod) {
            total += mod;
        });

        return total;
    }

    // Tmp Mods
    // ------------------------------------------------------------------------
    addTmpMod(val, t) {
        let times = t || 1;
        let mod = {val: val, times: times};

        if (isNaN(mod.val) || isNaN(mod.times)) {
            throw new Error('Invalid mod.');
        }

        this.tmpMods.push(mod);
        return this;
    }

    resetTmpMods() {
        this.tmpMods = [];
        return this;
    }

    getTmpModsSum() {
        let total = 0;
        this.tmpMods.forEach(function sum(mod) {
            total += mod.val;
        });

        return total;
    }

}
