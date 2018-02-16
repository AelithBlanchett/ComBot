import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit} from "../RWConstants";

export class ActionPass extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Pass,
            Tier.None,
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
            false, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            true, //usableOnSelf
            false,  //usableOnAllies
            false, //usableOnEnemies
            ActionExplanation[ActionType.Pass]);
    }

    make(): void {
        this.fpDamageToAtk = Constants.Fight.Action.Globals.passFpDamage;
    }
}