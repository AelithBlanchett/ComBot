import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit, ModifierType} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";

export class ActionHumHold extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier) {
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
            true, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            false, //usableOnSelf
            false,  //usableOnAllies
            true, //usableOnEnemies
            ActionExplanation[ActionType.HumHold]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    make():void {
        this.missed = false;
        this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
        let focusDamage = Math.floor(FocusDamageOnHit[Tier[this.tier]]);
        let holdModifier = ModifierFactory.getModifier(ModifierType.HumHold, this.fight, this.defender, this.attacker, {tier: this.tier, focusDamage: focusDamage});
        this.appliedModifiers.push(holdModifier);
        let humiliationModifier = ModifierFactory.getModifier(ModifierType.DegradationMalus, this.fight, this.defender, this.attacker, {parentIds: [holdModifier.idModifier]});
        this.appliedModifiers.push(humiliationModifier);
    }
}