import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/BaseConstants";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWFight} from "../Fight/RWFight";
import {Tiers} from "../Constants/Tiers";

export class ActionTag extends RWAction {

    constructor(fight:RWFight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Tag,
            Tiers.None,
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
            false, //targetMustBeInRing
            true,  //targetMustBeOffRing
            false, //targetMustBeInRange
            false, //targetMustBeOffRange
            false, //requiresBeingInHold,
            true, //requiresNotBeingInHold,
            false, //targetMustBeInHold,
            false, //targetMustNotBeInHold,
            false, //usableOnSelf
            true,  //usableOnAllies
            false, //usableOnEnemies
            ActionExplanation[ActionType.Tag]);
    }

    get requiredDiceScore():number{
        return Constants.Fight.Action.RequiredScore.Tag;
    }

    make(): void {
        this.attacker.lastTagTurn = this.atTurn;
        this.defenders[0].lastTagTurn = this.atTurn;
        this.attacker.isInTheRing = false;
        this.defenders[0].isInTheRing = true;
    }

    checkRequirements():void{
        super.checkRequirements();
        let turnsSinceLastTag = (this.attacker.lastTagTurn - this.fight.currentTurn);
        let turnsToWait = (Constants.Fight.Action.Globals.turnsToWaitBetweenTwoTags * 2) - turnsSinceLastTag; // *2 because there are two fighters
        if(turnsToWait > 0){
            throw new Error(`[b][color=red]You can't tag yet. Turns left: ${turnsToWait}[/color][/b]`);
        }
        if(!this.defenders[0].canMoveFromOrOffRing){
            throw new Error(`[b][color=red]You can't tag with this character. They're permanently out.[/color][/b]`);
        }
        if(!this.attacker.canMoveFromOrOffRing){
            throw new Error(`[b][color=red]You can't tag with this character. You can't move from or off the ring.[/color][/b]`);
        }
    }
}