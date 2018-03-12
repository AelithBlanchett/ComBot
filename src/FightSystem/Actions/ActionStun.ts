import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Messages} from "../../Common/Constants/Messages";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/BaseConstants";

export class ActionStun extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tiers) {
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
            Trigger.Stun,
            ActionExplanation[ActionType.Stun]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    checkRequirements():void{
        super.checkRequirements();
        if (this.defenders.findIndex(x => x.isStunned() == true) != -1) {
            throw new Error(Messages.targetAlreadyStunned);
        }
    }

    onHit(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[this.tier]];
        this.hpDamageToDef = Math.floor(this.attackFormula(this.tier, Math.floor(this.attacker.currentPower), this.defender.currentToughness, this.diceScore) * Constants.Fight.Action.Globals.stunHPDamageMultiplier);
        let stunModifier = ModifierFactory.getModifier(ModifierType.Stun, this.fight, this.defender, this.attacker, {tier: this.tier, diceRoll: -((this.tier + 1) * Constants.Fight.Action.Globals.dicePenaltyMultiplierWhileStunned)});
        this.appliedModifiers.push(stunModifier);
        this.fight.message.addHit("STUNNED!");
    }
}