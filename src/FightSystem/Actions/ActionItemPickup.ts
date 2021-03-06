import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import {RWFighterState} from "../Fight/RWFighterState";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";

export class ActionItemPickup extends RWAction {

    constructor(fight:RWFight, attacker:RWFighterState, defenders:RWFighterState[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.ItemPickup,
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
            Trigger.BonusPickup,
            ActionExplanation[ActionType.ItemPickup]);
    }

    onHit(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[Tiers.Light]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[Tiers.Light]];
        let itemPickupModifier = ModifierFactory.getModifier(ModifierType.ItemPickupBonus, this.fight, this.attacker, null);
        this.appliedModifiers.push(itemPickupModifier);
    }
}