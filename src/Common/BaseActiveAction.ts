import {Tier, TierDifficulty, Trigger, TriggerMoment} from "./Constants";
import {BaseAction} from "./BaseAction";
import {BaseActiveFighter} from "./BaseActiveFighter";
import {BaseFight} from "./BaseFight";
import {Utils} from "./Utils";
import * as Constants from "../Common/Constants";
import {BaseModifier} from "./BaseModifier";


export abstract class BaseActiveAction<Fight extends BaseFight = BaseFight, ActiveFighter extends BaseActiveFighter = BaseActiveFighter> extends BaseAction{

    fight:Fight;
    attacker:ActiveFighter;
    defenders:ActiveFighter[];

    atTurn: number;
    diceScore: number;
    diceRollRawValue:number;
    diceRollBonusFromStat:number;
    diceScoreBaseDamage:number;
    diceScoreStatDifference:number;
    diceScoreBonusPoints:number;
    difficultyExplanation:string;
    diceRequiredRoll:number;
    missed: boolean = false;

    appliedModifiers:BaseModifier[] = [];

    constructor(fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], name:string, tier: Tier, isHold: boolean, requiresRoll:boolean, isTurnSkippingAction:boolean, singleTarget:boolean, requiresBeingAlive:boolean, targetMustBeAlive:boolean, requiresBeingInRing:boolean, targetMustBeInRing:boolean, targetMustBeInRange:boolean, usableOnAllies:boolean, usableOnEnemies:boolean, explanation?:string){
        super(name, tier, isHold, requiresRoll, isTurnSkippingAction, singleTarget, requiresBeingAlive, targetMustBeAlive, requiresBeingInRing, targetMustBeInRing, targetMustBeInRange, usableOnAllies, usableOnEnemies, explanation);
        this.fight = fight;
        this.attacker = attacker;
        this.defenders = defenders;
        this.atTurn = this.fight.currentTurn;
        this.diceRollRawValue = 0;
        this.diceRollBonusFromStat = 0;
        this.diceScoreBaseDamage = 0;
        this.diceScoreStatDifference = 0;
        this.diceScoreBonusPoints = 0;
        this.difficultyExplanation = "";
        this.diceRequiredRoll = 0;
        this.missed = false;
        this.appliedModifiers = [];
    }

    execute():void{
        if(this.checkRequirements()){
            this.triggerBeforeEvent();
            this.announceAction();
            this.diceRequiredRoll = this.requiredDiceScore;
            if(!this.requiresRoll || this.roll() >= this.diceRequiredRoll){
                this.displayHitMessage();
                this.onHit();
                this.releaseHoldsIfNeeded();
                if(!this.isTurnSkippingAction){
                    this.onNonTurnSkippingAction();
                }
            }
            else{
                this.displayMissMessage();
                this.onMiss();
            }
            this.triggerAfterEvent();
        }
    }

    roll():number{
        this.diceRollRawValue = this.attacker.roll(1);
        this.diceRollBonusFromStat = this.addBonusesToRollFromStats();
        this.diceScore = this.diceRollRawValue + this.diceRollBonusFromStat;
        this.generateRollExplanation();
        return this.diceScore;
    }

    addBonusesToRollFromStats():number{
        return 0;
    }

    get requiredDiceScore():number{
        let scoreRequired = 0;
        if(this.tier != -1){
            scoreRequired += this.addRequiredScoreWithExplanation(TierDifficulty[Tier[this.tier]], "TIER");
        }

        scoreRequired += this.specificRequiredDiceScore();

        if(scoreRequired <= Constants.Globals.diceCount){
            scoreRequired = this.addRequiredScoreWithExplanation(Constants.Globals.diceCount, "MIN");
        }

        return scoreRequired;
    }

    abstract specificRequiredDiceScore():number;

    addRequiredScoreWithExplanation(value:number, reason:string):number{
        if(value != 0){
            this.difficultyExplanation = `${this.difficultyExplanation} ${reason}:${Utils.getSignedNumber(value)}`;
        }
        return value;
    }

    generateRollExplanation(){
        this.fight.message.addHint(`Rolled: ${this.diceScore} [sub](RLL: ${this.diceRollRawValue} + STAT:${this.diceRollBonusFromStat})[/sub]`);
        this.fight.message.addHint(`Required roll: ${this.diceRequiredRoll} [sub](${this.difficultyExplanation})[/sub]`);
        this.fight.message.addHint(`Damage calculation detail: [sub](BSE:${this.diceScoreBaseDamage} + STA:${this.diceScoreStatDifference} + OVR:${this.diceScoreBonusPoints})[/sub]`);
    }

    releaseHoldsIfNeeded(){
        for(let defender of this.defenders){
            if(this.tier == Tier.Heavy && this.attacker.isInHoldAppliedBy(defender.name)){
                this.attacker.releaseHoldsAppliedBy(defender.name);
                this.fight.message.addHit(Utils.strFormat(Constants.Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), defender.getStylizedName()]));
            }
            else if(this.tier == Tier.Heavy && defender.isApplyingHold()){
                defender.releaseHoldsApplied();
                this.fight.message.addHit(Utils.strFormat(Constants.Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), defender.getStylizedName()]));
            }
        }
    }

    checkRequirements():boolean{
        if(!this.fight.waitingForAction){
            throw new Error(Constants.Messages.canAttackNotWaitingForAction);
        }
        if(this.requiresBeingAlive && this.attacker.isTechnicallyOut()){
            throw new Error(Constants.Messages.cantAttackPlayerIsOut);
        }
        if(this.requiresBeingInRing && !this.attacker.isInTheRing){
            throw new Error(Constants.Messages.cantAttackPlayerOutOfTheRing);
        }
        if(!this.usableOnAllies && this.defenders.findIndex(x => x.assignedTeam != this.attacker.assignedTeam) != -1){
            throw new Error(Constants.Messages.doActionTargetIsSameTeam);
        }
        if(!this.usableOnEnemies && this.defenders.findIndex(x => x.assignedTeam == this.attacker.assignedTeam) != -1){
            throw new Error(Constants.Messages.doActionTargetIsNotSameTeam);
        }
        if(this.singleTarget && this.defenders.length > 1){
            throw new Error(Constants.Messages.cantAttackTooManyTargets);
        }
        if(this.targetMustBeAlive && this.defenders.findIndex(x => x.isTechnicallyOut() == false) != -1){
            throw new Error(Constants.Messages.cantAttackTargetOutOfFight);
        }
        if(this.targetMustBeInRing && this.defenders.findIndex(x => x.isInTheRing == false) != -1){
            throw new Error(Constants.Messages.cantAttackTargetIsOutOfTheRing);
        }


        return true;
    }

    announceAction():void{
        let strTier = "";
        if(this.tier >= 0){
            strTier = Tier[this.tier];
        }

        if(this.defenders.length){
            this.fight.message.addAction(`${strTier} ${this.name} on ${this.defenders.map(x => x.getStylizedName()).join(",")}`);
        }
        else{
            this.fight.message.addAction(`${strTier} ${this.name}`);
        }
    }
    abstract onHit():void;
    abstract onMiss():void;

    onNonTurnSkippingAction(){
        this.fight.message.addHint(Utils.strFormat(Constants.Messages.stillActorsTurn, [this.attacker.getStylizedName()]));
        this.fight.message.send();
        this.fight.waitingForAction = true;
    }

    displayHitMessage(){
        let message:string = (this.explanation != null ? Utils.strFormat(this.explanation, [this.attacker.getStylizedName()]) : Constants.Messages.HitMessage);
        this.fight.message.addHit(message);
    }

    displayMissMessage(){
        this.fight.message.addHit(Constants.Messages.MissMessage);
    }

    triggerBeforeEvent():void{
        this.attacker.triggerMods(TriggerMoment.Before, this.name);
        //TODO reimplement features here
        // this.attacker.triggerFeatures(TriggerMoment.Before, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.attacker, this.defender, this));
        // if(this.defender){
        //     this.defender.triggerFeatures(TriggerMoment.Before, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.defender, this.attacker, this));
        // }
    }

    triggerAfterEvent():void{
        this.attacker.triggerMods(TriggerMoment.After, this.name);
        //TODO reimplement features here
        // this.attacker.triggerFeatures(TriggerMoment.After, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.attacker, this.defender, this));
        // if(this.defender){
        //     this.defender.triggerFeatures(TriggerMoment.After, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.defender, this.attacker, this));
        // }
    }

    abstract async save():Promise<void>;


    // //TODO move this to tag attack
    // let turnsSinceLastTag = (this.currentPlayer.lastTagTurn - this.currentTurn);
    // let turnsToWait = (Constants.Fight.Action.Globals.turnsToWaitBetweenTwoTags * 2) - turnsSinceLastTag; // *2 because there are two fighters
    // if(turnsToWait > 0){
    //     throw new Error(`[b][color=red]You can't tag yet. Turns left: ${turnsToWait}[/color][/b]`);
    // }
    // if(!this.currentTarget.canMoveFromOrOffRing){
    //     throw new Error(`[b][color=red]You can't tag with this character. They're permanently out.[/color][/b]`);
    // }
    // if(this.currentTarget.assignedTeam != this.currentPlayer.assignedTeam){
    //     throw new Error(`[b][color=red]You can't tag with this character as they are not in your team.[/color][/b]`);
    // }
    //
    //
    // //TODO move this to respective attacks
    // if (this.name == "Submit" && this.fight.currentTurn <= Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber) {
    //     throw new Error(Utils.strFormat(Constants.Messages.tapoutTooEarly, [Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber.toLocaleString()]));
    // }
    //
    // //TODO move this to respective attacks
    // if (this.name == "Stun" && this.defenders.findIndex(x => x.isStunned() == true) != -1) {
    //     throw new Error(Constants.Messages.targetAlreadyStunned);
    // }

}