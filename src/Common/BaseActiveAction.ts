import {Tier, TierDifficulty, Trigger, TriggerMoment} from "./BaseConstants";
import {BaseAction} from "./BaseAction";
import {BaseActiveFighter} from "./BaseActiveFighter";
import {BaseFight} from "./BaseFight";
import {Utils} from "./Utils";
import * as BaseConstants from "../Common/BaseConstants";
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

    temporaryIdAttacker:string;
    temporaryIdDefenders:string[];
    temporaryIdFight:string;

    constructor(fight:Fight,
                attacker:ActiveFighter,
                defenders:ActiveFighter[],
                name:string,
                tier: Tier,
                isHold: boolean,
                requiresRoll:boolean,
                keepActorsTurn:boolean,
                singleTarget:boolean,
                requiresBeingAlive:boolean,
                requiresBeingDead:boolean,
                requiresBeingInRing:boolean,
                requiresBeingOffRing:boolean,
                targetMustBeAlive:boolean,
                targetMustBeDead:boolean,
                targetMustBeInRing:boolean,
                targetMustBeOffRing:boolean,
                targetMustBeInRange:boolean,
                targetMustBeOffRange:boolean,
                requiresBeingInHold:boolean,
                requiresNotBeingInHold:boolean,
                targetMustBeInHold:boolean,
                targetMustNotBeInHold:boolean,
                usableOnSelf:boolean,
                usableOnAllies:boolean,
                usableOnEnemies:boolean,
                explanation?:string,
                maxTargets?:number){
        super(name,
              tier,
              isHold,
              requiresRoll,
              keepActorsTurn,
              singleTarget,
              requiresBeingAlive,
              requiresBeingDead,
              requiresBeingInRing,
              requiresBeingOffRing,
              targetMustBeAlive,
              targetMustBeDead,
              targetMustBeInRing,
              targetMustBeOffRing,
              targetMustBeInRange,
              targetMustBeOffRange,
              requiresBeingInHold,
              requiresNotBeingInHold,
              targetMustBeInHold,
              targetMustNotBeInHold,
              usableOnSelf,
              usableOnAllies,
              usableOnEnemies,
              explanation,
              maxTargets);
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

    get idAttacker(){
        return (this.attacker != null ? this.attacker.name : this.temporaryIdAttacker);
    }

    set idAttacker(value:string){
        this.temporaryIdAttacker = value;
    }

    get idDefenders():string[]{
        return (this.defenders != null ? this.defenders.map(x => x.name) : this.temporaryIdDefenders);
    }

    set idDefenders(value:string[]){
        this.temporaryIdDefenders = value;
    }

    get idFight(){
        return (this.fight != null ? this.fight.idFight : this.temporaryIdFight);
    }

    set idFight(value:string){
        this.temporaryIdFight = value;
    }

    get defender(){
        if(this.defenders == null){
            return null;
        }
        if(this.defenders.length == 1){
            return this.defenders[0];
        }
        else{
            throw new Error("Wrong function call: there are too many targets, this function can only return one.");
        }
    }

    execute():void{
        this.checkRequirements();
        this.triggerBeforeEvent();
        this.announceAction();
        this.diceRequiredRoll = this.requiredDiceScore;
        if(this.fight.diceLess || !this.requiresRoll || this.roll() >= this.diceRequiredRoll){
            this.missed = false;
            this.displayHitMessage();
            this.onHit();
            this.releaseHoldsIfNeeded();
        }
        else{
            this.missed = true;
            this.displayMissMessage();
            this.onMiss();
        }
        this.triggerAfterEvent();
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

        if(scoreRequired <= BaseConstants.Globals.diceCount){
            scoreRequired = this.addRequiredScoreWithExplanation(BaseConstants.Globals.diceCount, "MIN");
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
                this.fight.message.addHit(Utils.strFormat(BaseConstants.Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), defender.getStylizedName()]));
            }
            else if(this.tier == Tier.Heavy && defender.isApplyingHold()){
                defender.releaseHoldsApplied();
                this.fight.message.addHit(Utils.strFormat(BaseConstants.Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), defender.getStylizedName()]));
            }
        }
    }

    //TODO replace those with constants
    checkRequirements():void{
        if(this.singleTarget && !this.usableOnSelf && this.defenders.length > 1){
            throw new Error(BaseConstants.Messages.cantAttackTooManyTargets);
        }
        if(this.requiresBeingAlive && this.attacker.isTechnicallyOut()){
            throw new Error(BaseConstants.Messages.cantAttackPlayerIsOut);
        }
        if(this.requiresBeingDead && !this.attacker.isTechnicallyOut()){
            throw new Error("Action requires being dead.");
        }
        if(this.requiresBeingInRing && !this.attacker.isInTheRing){
            throw new Error(BaseConstants.Messages.cantAttackPlayerOutOfTheRing);
        }
        if(this.requiresBeingOffRing && this.attacker.isInTheRing){
            throw new Error("Actor must be off ring.");
        }
        if(this.requiresBeingInHold && !this.attacker.isInHold()){
            throw new Error("You must be held in a hold to do that.");
        }
        if(this.requiresNotBeingInHold && this.attacker.isInHold()){
            throw new Error("You must not be held in a hold to do that.");
        }
        if(this.targetMustBeAlive && this.defenders.findIndex(x => x.isTechnicallyOut() == true) != -1){
            throw new Error(BaseConstants.Messages.cantAttackTargetOutOfFight);
        }
        if(this.targetMustBeDead && this.defenders.findIndex(x => x.isTechnicallyOut() == false) != -1){
            throw new Error(BaseConstants.Messages.cantAttackTargetOutOfFight);
        }
        if(this.targetMustBeInRing && this.defenders.findIndex(x => x.isInTheRing == false) != -1){
            throw new Error(BaseConstants.Messages.cantAttackTargetIsOutOfTheRing);
        }
        if(this.targetMustBeOffRing &&  this.defenders.findIndex(x => x.isInTheRing == true) != -1){
            throw new Error("Target(s) must be off ring.");
        }
        if(this.targetMustBeInRange && !this.attacker.isInRange(this.defenders)){
            throw new Error("Target(s) must be in range.");
        }
        if(this.targetMustBeOffRange && this.attacker.isInRange(this.defenders)){
            throw new Error("Target(s) must be off range.");
        }
        if(this.targetMustBeInHold && this.defenders.filter(x => x.isInHold()).length != this.defenders.length){
            throw new Error("Target(s) must be held in a hold to do that.");
        }
        if(this.targetMustNotBeInHold && this.defenders.filter(x => !x.isInHold()).length != this.defenders.length){
            throw new Error("Target(s) must not be held in a hold to do that.");
        }
        if(!this.usableOnSelf && !(this.usableOnAllies && this.usableOnEnemies)){
            if(!this.usableOnAllies && this.defenders.findIndex(x => x.assignedTeam == this.attacker.assignedTeam) != -1){
                throw new Error(BaseConstants.Messages.doActionTargetIsSameTeam);
            }
            if(!this.usableOnEnemies && this.defenders.findIndex(x => x.assignedTeam != this.attacker.assignedTeam) != -1){
                throw new Error(BaseConstants.Messages.doActionTargetIsNotSameTeam);
            }
        }
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

    displayHitMessage(){
        let message:string = (this.explanation != null ? Utils.strFormat(this.explanation, [this.attacker.getStylizedName()]) : BaseConstants.Messages.HitMessage);
        this.fight.message.addHit(message);
    }

    displayMissMessage(){
        this.fight.message.addHit(BaseConstants.Messages.MissMessage);
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

}