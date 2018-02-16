import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {
    FocusDamageOnHit, FocusHealOnHit, ModifierType, StrapToyDiceRollPenalty,
    StrapToyLPDamagePerTurn
} from "../RWConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";

export class ActionStrapToy extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier) {
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
            ActionExplanation[ActionType.StrapToy]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentSensuality / 10);
    }

    make():void {
        this.fpHealToAtk += FocusHealOnHit[Tier[this.tier]];
        this.fpDamageToDef += FocusDamageOnHit[Tier[this.tier]];
        let nbOfTurnsWearingToy = this.tier + 1;
        let lpDamage = StrapToyLPDamagePerTurn[Tier[this.tier]];
        let strapToyModifier = ModifierFactory.getModifier(ModifierType.StrapToy, this.fight, this.defender, null, {focusDamage: this.fpDamageToDef, lustDamage: lpDamage, tier: this.tier, diceRoll: StrapToyDiceRollPenalty[Tier[this.tier]], uses: nbOfTurnsWearingToy});
        this.appliedModifiers.push(strapToyModifier);
        this.fight.message.addHit("The sextoy started vibrating!");
    }
}