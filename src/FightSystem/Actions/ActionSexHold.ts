import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";

export class ActionSexHold extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier) {
        super(fight,
            attacker,
            defenders,
            ActionType.SexHold,
            tier,
            true, //isHold
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
            true, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            false, //usableOnSelf
            false,  //usableOnAllies
            true, //usableOnEnemies
            ActionExplanation[ActionType.SexHold]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    make():void {
        this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]];
        let lustDamage = Math.floor(this.attackFormula(this.tier, this.attacker.currentSensuality, this.defender.currentEndurance, this.diceScore) * Constants.Fight.Action.Globals.holdDamageMultiplier);
        let holdModifier = ModifierFactory.getModifier(ModifierType.SexHold, this.fight, this.defender, this.attacker, {tier: this.tier, lustDamage: lustDamage});
        let lustBonusAttacker = ModifierFactory.getModifier(ModifierType.SexHoldLustBonus, this.fight, this.attacker, null, {parentIds: [holdModifier.idModifier]});
        let lustBonusDefender = ModifierFactory.getModifier(ModifierType.SexHoldLustBonus, this.fight, this.defender, null, {parentIds: [holdModifier.idModifier]});
        this.appliedModifiers.push(holdModifier);
        this.appliedModifiers.push(lustBonusAttacker);
        this.appliedModifiers.push(lustBonusDefender);
    }
}