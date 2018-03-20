import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit} from "../RWConstants";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";

export class ActionForcedWorship extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tiers) {
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
            Trigger.MagicalAttack,
            ActionExplanation[ActionType.ForcedWorship]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    onHit(): void {
        this.lpDamageToAtk += (this.tier+1) * 5;
        this.fpHealToAtk += FocusHealOnHit[Tiers[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[this.tier]] * 2;
        this.lpDamageToDef += 1;
    }

    onMiss():void{
        this.lpDamageToAtk += (this.tier+1) * 5;
        this.applyDamage();
    }
}