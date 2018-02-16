import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FailedHighRiskMultipliers, FocusDamageOnHit, FocusHealOnHit, HighRiskMultipliers} from "../RWConstants";

export class ActionHighRisk extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier) {
        super(fight,
            attacker,
            defenders,
            ActionType.HighRisk,
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
            ActionExplanation[ActionType.HighRisk]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    make():void {
        this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]];
        this.hpDamageToDef += Math.floor(this.attackFormula(this.tier, this.attacker.currentPower, this.defender.currentToughness, this.diceScore) * (HighRiskMultipliers[Tier[this.tier]]));
    }

    onMiss():void{
        this.fpDamageToAtk += FocusDamageOnHit[Tier[this.tier]];
        this.fpHealToDef += FocusHealOnHit[Tier[this.tier]];
        this.hpDamageToAtk += Math.floor(this.attackFormula(this.tier, this.attacker.currentPower, this.attacker.currentToughness, 0) * HighRiskMultipliers[Tier[this.tier]] * FailedHighRiskMultipliers[Tier[this.tier]]);
        this.applyDamage();
    }
}