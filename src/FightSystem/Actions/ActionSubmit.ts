import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusHealOnHit} from "../RWConstants";
import {Utils} from "../../Common/Utils";

export class ActionSubmit extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Submit,
            Tier.None,
            false, //isHold
            false,  //requiresRoll
            false, //keepActorsTurn
            false,  //singleTarget
            true,  //requiresBeingAlive
            false, //requiresBeingDead
            false,  //requiresBeingInRing
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
            ActionExplanation[ActionType.Submit]);
    }

    checkRequirements():void{
        super.checkRequirements();
        if (this.fight.currentTurn <= Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber) {
            throw new Error(Utils.strFormat(Constants.Messages.tapoutTooEarly, [Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber.toLocaleString()]));
        }
    }

    make(): void {
        this.attacker.triggerPermanentOutsideRing();
        this.fight.message.addHit(Utils.strFormat(Constants.Messages.tapoutMessage, [this.attacker.getStylizedName()]));
    }
}