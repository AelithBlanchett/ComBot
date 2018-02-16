import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit} from "../RWConstants";

export class ActionReleaseHold extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.ReleaseHold,
            Tier.None,
            false, //isHold
            false,  //requiresRoll
            true, //keepActorsTurn
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
            ActionExplanation[ActionType.ReleaseHold]);
    }

    make(): void {
        if(this.attacker.isApplyingHold()){
            this.attacker.releaseHoldsApplied();
        }
    }
}