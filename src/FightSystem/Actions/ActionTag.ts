import {ActionExplanation, ActionType, RWAction} from "./RWAction";
import * as Constants from "../../Common/Constants/BaseConstants";
import {RWFighterState} from "../Fight/RWFighterState";
import {RWFight} from "../Fight/RWFight";
import {Tiers} from "../Constants/Tiers";
import {Trigger} from "../../Common/Constants/Trigger";
import {GameSettings} from "../../Common/Configuration/GameSettings";

export class ActionTag extends RWAction {

    constructor(fight:RWFight, attacker:RWFighterState, defenders:RWFighterState[]) {
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
            Trigger.Tag,
            ActionExplanation[ActionType.Tag]);
    }

    get requiredDiceScore():number{
        return GameSettings.requiredScoreTag;
    }

    onHit(): void {
        this.attacker.lastTagTurn = this.atTurn;
        this.defenders[0].lastTagTurn = this.atTurn;
        this.attacker.isInTheRing = false;
        this.defenders[0].isInTheRing = true;
    }

    checkRequirements():void{
        super.checkRequirements();
        let turnsSinceLastTag = (this.attacker.lastTagTurn - this.fight.currentTurn);
        let turnsToWait = (GameSettings.turnsToWaitBetweenTwoTags * this.fight.getAlivePlayers().filter(x => x.assignedTeam == this.attacker.assignedTeam).length) - turnsSinceLastTag;
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