import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {Utils} from "../../Common/Utils/Utils";
import {FightType} from "../../Common/BaseConstants";
import {Messages} from "../../Common/Constants/Messages";
import {Tiers} from "../Constants/Tiers";

export class ActionSubmit extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Submit,
            Tiers.None,
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
            throw new Error(Utils.strFormat(Messages.tapoutTooEarly, [Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber.toLocaleString()]));
        }
        if (this.fight.fightType == FightType.LastManStanding) {
            throw new Error(Utils.strFormat(Messages.wrongMatchTypeForAction, ["submit", "Last Man Standing"]));
        }
    }

    make(): void {
        this.attacker.triggerPermanentOutsideRing();
        this.fight.message.addHit(Utils.strFormat(Messages.tapoutMessage, [this.attacker.getStylizedName()]));
    }
}