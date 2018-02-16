import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";

export class ActionStun extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier) {
        super(fight,
            attacker,
            defenders,
            ActionType.Stun,
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
            ActionExplanation[ActionType.Stun]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    make(): void {
        this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]];
        this.hpDamageToDef = Math.floor(this.attackFormula(this.tier, Math.floor(this.attacker.currentPower), this.defender.currentToughness, this.diceScore) * Constants.Fight.Action.Globals.stunHPDamageMultiplier);
        let stunModifier = ModifierFactory.getModifier(ModifierType.Stun, this.fight, this.defender, this.attacker, {tier: this.tier, diceRoll: -((this.tier + 1) * Constants.Fight.Action.Globals.dicePenaltyMultiplierWhileStunned)});
        this.appliedModifiers.push(stunModifier);
        this.fight.message.addHit("STUNNED!");
    }
}