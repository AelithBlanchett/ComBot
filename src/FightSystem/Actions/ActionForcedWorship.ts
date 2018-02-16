import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit} from "../RWConstants";

export class ActionForcedWorship extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier) {
        super(fight,
            attacker,
            defenders,
            ActionType.ForcedWorship,
            tier,
            false, //isHold
            true,  //requiresRoll
            false, //keepActorsTurn
            true,  //singleTarget
            true,  //requiresBeingAlive
            false, //requiresBeingDead
            true,  //requiresBeingInRing
            false, //requiresBeingOffRing
            true,  //targetMustBeAlive
            false, //targetMustBeDead
            true, //targetMustBeInRing
            false,  //targetMustBeOffRing
            true, //targetMustBeInRange
            false, //targetMustBeOffRange
            false, //requiresBeingInHold,
            false, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            false, //usableOnSelf
            false,  //usableOnAllies
            true, //usableOnEnemies
            ActionExplanation[ActionType.ForcedWorship]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    make():void {
        this.lpDamageToAtk += (this.tier+1) * 5;
        this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]] * 2;
        this.lpDamageToDef += 1;
    }

    onMiss():void{
        this.lpDamageToAtk += (this.tier+1) * 5;
        this.applyDamage();
    }
}