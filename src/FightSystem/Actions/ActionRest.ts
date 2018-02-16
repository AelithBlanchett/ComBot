import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit} from "../RWConstants";

export class ActionRest extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Rest,
            Tier.None,
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
            true, //usableOnSelf
            false,  //usableOnAllies
            false, //usableOnEnemies
            ActionExplanation[ActionType.Rest]);
    }

    get requiredDiceScore():number{
        return Constants.Fight.Action.RequiredScore.Rest;
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentDexterity / 10);
    }

    make(): void {
        this.hpHealToAtk += this.attacker.hpPerHeart() * Constants.Fight.Action.Globals.hpPercentageToHealOnRest;
        this.lpHealToAtk += this.attacker.lustPerOrgasm() * Constants.Fight.Action.Globals.lpPercentageToHealOnRest;
        this.fpHealToAtk += this.attacker.maxFocus() * Constants.Fight.Action.Globals.fpPercentageToHealOnRest;
    }
}