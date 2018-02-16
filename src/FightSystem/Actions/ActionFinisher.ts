import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import Tier = Constants.Tier;
import {FocusDamageOnHit, FocusDamageOnMiss, FocusHealOnHit} from "../RWConstants";
import {Utils} from "../../Common/Utils";

export class ActionFinisher extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Finisher,
            Tier.Heavy,
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
            false, //usableOnSelf
            false,  //usableOnAllies
            true, //usableOnEnemies
            ActionExplanation[ActionType.Finisher]);
    }

    addBonusesToRollFromStats():number{
        return Math.ceil(this.attacker.currentWillpower / 10);
    }

    specificRequiredDiceScore():number{
        return this.addRequiredScoreWithExplanation(6, "FIN");
    }

    checkRequirements():void{
        super.checkRequirements();
        if((this.defender.livesRemaining <= 1 || this.defender.consecutiveTurnsWithoutFocus == Constants.Fight.Action.Globals.maxTurnsWithoutFocus - 2)){
            throw new Error(`You can't finish your opponent right now. They must have only one life left, or it must at least be their ${Constants.Fight.Action.Globals.maxTurnsWithoutFocus - 2}th turn without focus.`)
        }
    }

    make(): void {
        this.defender.triggerPermanentOutsideRing();
        this.fight.message.addHit(Utils.strFormat(Constants.Messages.finishMessage, [this.defender.getStylizedName()]));
    }

    onMiss():void{
        this.fpDamageToAtk += FocusDamageOnMiss[Tier[Tier.Heavy]];
        this.fight.message.addHit(Utils.strFormat(Constants.Messages.finishFailMessage, [this.attacker.getStylizedName()]));
        this.applyDamage();
    }
}