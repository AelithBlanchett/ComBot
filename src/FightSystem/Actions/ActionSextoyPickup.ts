import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Tiers} from "../Constants/Tiers";

export class ActionSextoyPickup extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.SextoyPickup,
            Tiers.None,
            false, //isHold
            false,  //requiresRoll
            false, //keepActorsTurn
            false,  //singleTarget
            true,  //requiresBeingAlive
            false, //requiresBeingDead
            true,  //requiresBeingInRing
            false, //requiresBeingOffRing
            false,  //targetMustBeAlive
            false, //targetMustBeDead
            false, //targetMustBeInRing
            false,  //targetMustBeOffRing
            false, //targetMustBeInRange
            false, //targetMustBeOffRange
            false, //requiresBeingInHold,
            true, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            true, //usableOnSelf
            false,  //usableOnAllies
            false, //usableOnEnemies
            ActionExplanation[ActionType.SextoyPickup]);
    }

    make(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[Tiers.Light]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[Tiers.Light]];
        let itemPickupModifier = ModifierFactory.getModifier(ModifierType.SextoyPickupBonus, this.fight, this.attacker, null);
        this.appliedModifiers.push(itemPickupModifier);
    }
}