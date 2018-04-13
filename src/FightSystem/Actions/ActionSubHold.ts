import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/Constants/BaseConstants";
import {RWFighterState} from "../Fight/RWFighterState";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";
import {RWGameSettings} from "../Configuration/RWGameSettings";

export class ActionSubHold extends RWAction {

    constructor(fight:RWFight, attacker:RWFighterState, defenders:RWFighterState[], tier:Tiers) {
        super(fight,
            attacker,
            defenders,
            ActionType.SubHold,
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
            Trigger.PhysicalAttack,
            ActionExplanation[ActionType.SubHold]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    onHit(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[this.tier]];
        let hpDamage = Math.floor(this.attackFormula(this.tier, this.attacker.currentPower, this.defender.currentToughness, this.diceScore) * RWGameSettings.holdDamageMultiplier);
        let holdModifier = ModifierFactory.getModifier(ModifierType.SubHold, this.fight, this.defender, this.attacker, {tier: this.tier, hpDamage: hpDamage});
        let brawlBonusAttacker = ModifierFactory.getModifier(ModifierType.SubHoldBrawlBonus, this.fight, this.attacker, null, {parentIds: [holdModifier.idModifier]});
        let brawlBonusDefender = ModifierFactory.getModifier(ModifierType.SubHoldBrawlBonus, this.fight, this.defender, null, {parentIds: [holdModifier.idModifier]});
        this.appliedModifiers.push(holdModifier);
        this.appliedModifiers.push(brawlBonusAttacker);
        this.appliedModifiers.push(brawlBonusDefender);
    }
}