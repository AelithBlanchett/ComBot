import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {FocusDamageOnHit, FocusHealOnHit, ModifierType, StrapToyDiceRollPenalty, StrapToyLPDamagePerTurn} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/BaseConstants";

export class ActionStrapToy extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tiers) {
        super(fight,
            attacker,
            defenders,
            ActionType.StrapToy,
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
            false, //targetMustBeOffRing
            true, //targetMustBeInRange
            false, //targetMustBeOffRange
            false, //requiresBeingInHold,
            false, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            false, //usableOnSelf
            false,  //usableOnAllies
            true, //usableOnEnemies
            Trigger.BonusPickup,
            ActionExplanation[ActionType.StrapToy]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentSensuality / 10);
    }

    onHit(): void {
        this.fpHealToAtk += FocusHealOnHit[Tiers[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tiers[this.tier]];
        let nbOfTurnsWearingToy = this.tier + 1;
        let lpDamage = StrapToyLPDamagePerTurn[Tiers[this.tier]];
        let strapToyModifier = ModifierFactory.getModifier(ModifierType.StrapToy, this.fight, this.defender, null, {focusDamage: this.fpDamageToDef, lustDamage: lpDamage, tier: this.tier, diceRoll: StrapToyDiceRollPenalty[Tiers[this.tier]], uses: nbOfTurnsWearingToy});
        this.appliedModifiers.push(strapToyModifier);
        this.fight.message.addHit("The sextoy started vibrating!");
    }
}