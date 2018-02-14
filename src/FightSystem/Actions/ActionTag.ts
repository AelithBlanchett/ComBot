import {ActionExplanation, ActionType, RWAction} from "../RWAction";
import * as Constants from "../../Common/Constants";
import {ActiveFighter} from "../ActiveFighter";
import {Fight} from "../Fight";
import {Tier} from "../../Common/Constants";

export class ActionTag extends RWAction {

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[]) {
        super(fight,
            attacker,
            defenders,
            ActionType.Tag,
            Tier.None,
            false, //isHold
            true,  //requiresRoll
            false, //isTurnSkippingAction
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
            true,  //usableOnAllies
            false, //usableOnEnemies
            ActionExplanation[ActionType.Tag]);
    }

    prepare(): void {
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