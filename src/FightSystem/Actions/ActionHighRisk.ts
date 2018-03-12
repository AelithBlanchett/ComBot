import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {FailedHighRiskMultipliers, FocusDamageOnHit, FocusHealOnHit, HighRiskMultipliers} from "../RWConstants";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/BaseConstants";

export class ActionHighRisk extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tiers) {
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
            Trigger.PhysicalAttack,
            ActionExplanation[ActionType.HighRisk]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    onHit(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[this.tier]];
        this.hpDamageToDef += Math.floor(this.attackFormula(this.tier, this.attacker.currentPower, this.defender.currentToughness, this.diceScore) * (HighRiskMultipliers[Tiers[this.tier]]));
    }

    onMiss():void{
        this.fpDamageToAtk += FocusDamageOnHit[Tiers[this.tier]];
        this.fpHealToDef += FocusHealOnHit[Tiers[this.tier]];
        this.hpDamageToAtk += Math.floor(this.attackFormula(this.tier, this.attacker.currentPower, this.attacker.currentToughness, 0) * HighRiskMultipliers[Tiers[this.tier]] * FailedHighRiskMultipliers[Tiers[this.tier]]);
        this.applyDamage();
    }
}