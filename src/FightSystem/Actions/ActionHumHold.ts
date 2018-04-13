import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import {RWFighterState} from "../Fight/RWFighterState";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";

export class ActionHumHold extends RWAction {

    constructor(fight:RWFight, attacker:RWFighterState, defenders:RWFighterState[], tier:Tiers) {
        super(fight,
            attacker,
            defenders,
            ActionType.HumHold,
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
            Trigger.SpecialAttack,
            ActionExplanation[ActionType.HumHold]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    onHit(): void {
        this.missed = false;
        this.fpHealToAtk += FocusHealOnHit[Tiers[this.tier]];
        let focusDamage = Math.floor(FocusDamageOnHit[Tiers[this.tier]]);
        let holdModifier = ModifierFactory.getModifier(ModifierType.HumHold, this.fight, this.defender, this.attacker, {tier: this.tier, focusDamage: focusDamage});
        this.appliedModifiers.push(holdModifier);
        let humiliationModifier = ModifierFactory.getModifier(ModifierType.DegradationMalus, this.fight, this.defender, this.attacker, {parentIds: [holdModifier.idModifier]});
        this.appliedModifiers.push(humiliationModifier);
    }
}