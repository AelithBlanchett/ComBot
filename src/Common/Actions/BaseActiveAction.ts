import {Trigger, TriggerMoment} from "../BaseConstants";
import {BaseAction} from "./BaseAction";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";
import {BaseFight} from "../Fight/BaseFight";
import {Utils} from "../Utils/Utils";
import * as BaseConstants from "../BaseConstants";
import {BaseModifier} from "../Modifiers/BaseModifier";
import {Messages} from "../Constants/Messages";
import {GameSettings} from "../Configuration/GameSettings";
import {BaseFeatureParameter} from "../Features/BaseFeatureParameter";


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
                tier: number,
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

    get defender(){
        if(this.defenders == null){
            return null;
        }
        if(this.defenders.length == 1){
            return this.defenders[0];
        }
        else{
            throw new Error(Messages.errorTooManyDefendersForThisCall);
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

        scoreRequired += this.specificRequiredDiceScore();

        if(scoreRequired <= GameSettings.diceCount){
            scoreRequired = this.addRequiredScoreWithExplanation(GameSettings.diceCount, "MIN");
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
            if(this.tier == GameSettings.tierRequiredToBreakHold && this.attacker.isInHoldAppliedBy(defender.name)){
                this.attacker.releaseHoldsAppliedBy(defender.name);
                this.fight.message.addHit(Utils.strFormat(Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), defender.getStylizedName()]));
            }
            else if(this.tier == GameSettings.tierRequiredToBreakHold && defender.isApplyingHold()){
                defender.releaseHoldsApplied();
                this.fight.message.addHit(Utils.strFormat(Messages.ForcedHoldRelease, [this.attacker.getStylizedName(), defender.getStylizedName()]));
            }
        }
    }

    checkRequirements():void{
        if(this.singleTarget && !this.usableOnSelf && this.defenders.length > 1){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.tooManyTargets]));
        }
        if(this.requiresBeingAlive && this.attacker.isTechnicallyOut()){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.playerOutOfFight]));
        }
        if(this.requiresBeingDead && !this.attacker.isTechnicallyOut()){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.playerStillInFight]));
        }
        if(this.requiresBeingInRing && !this.attacker.isInTheRing){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.playerOutOfRing]));
        }
        if(this.requiresBeingOffRing && this.attacker.isInTheRing){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.playerOnTheRing]));
        }
        if(this.requiresBeingInHold && !this.attacker.isInHold()){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.mustBeStuckInHold]));
        }
        if(this.requiresNotBeingInHold && this.attacker.isInHold()){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.mustNotBeStuckInHold]));
        }
        if(this.targetMustBeAlive && this.defenders.findIndex(x => x.isTechnicallyOut() == true) != -1){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetOutOfFight]));
        }
        if(this.targetMustBeDead && this.defenders.findIndex(x => x.isTechnicallyOut() == false) != -1){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetNotOutOfFight]));
        }
        if(this.targetMustBeInRing && this.defenders.findIndex(x => x.isInTheRing == false) != -1){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetOutOfRing]));
        }
        if(this.targetMustBeOffRing &&  this.defenders.findIndex(x => x.isInTheRing == true) != -1){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetStillInRing]));
        }
        if(this.targetMustBeInRange && !this.attacker.isInRange(this.defenders)){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetMustBeInRange]));
        }
        if(this.targetMustBeOffRange && this.attacker.isInRange(this.defenders)){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetMustBeOffRange]));
        }
        if(this.targetMustBeInHold && this.defenders.filter(x => x.isInHold()).length != this.defenders.length){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetMustBeInHold]));
        }
        if(this.targetMustNotBeInHold && this.defenders.filter(x => !x.isInHold()).length != this.defenders.length){
            throw new Error(Utils.strFormat(Messages.cantAttackExplanation, [Messages.targetMustNotBeInHold]));
        }
        if(!this.usableOnSelf && !(this.usableOnAllies && this.usableOnEnemies)){
            if(!this.usableOnAllies && this.defenders.findIndex(x => x.assignedTeam == this.attacker.assignedTeam) != -1){
                throw new Error(Messages.doActionTargetIsSameTeam);
            }
            if(!this.usableOnEnemies && this.defenders.findIndex(x => x.assignedTeam != this.attacker.assignedTeam) != -1){
                throw new Error(Messages.doActionTargetIsNotSameTeam);
            }
        }
    }

    announceAction():void{
        if(this.defenders.length){
            this.fight.message.addAction(`${this.name} on ${this.defenders.map(x => x.getStylizedName()).join(",")}`);
        }
        else{
            this.fight.message.addAction(`${this.name}`);
        }
    }
    abstract onHit():void;

    abstract onMiss():void;

    displayHitMessage(){
        let message:string = (this.explanation != null ? Utils.strFormat(this.explanation, [this.attacker.getStylizedName()]) : Messages.HitMessage);
        this.fight.message.addHit(message);
    }

    displayMissMessage(){
        this.fight.message.addHit(Messages.MissMessage);
    }

    triggerBeforeEvent():void{
        this.attacker.triggerMods(TriggerMoment.Before, Trigger.AnyAction);
        this.attacker.triggerFeatures(TriggerMoment.Before, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.attacker, this.defender, this));
        if(this.defender){
            this.defender.triggerFeatures(TriggerMoment.Before, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.defender, this.attacker, this));
        }
    }

    triggerAfterEvent():void{
        this.attacker.triggerMods(TriggerMoment.After, Trigger.AnyAction);
        this.attacker.triggerFeatures(TriggerMoment.After, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.attacker, this.defender, this));
        if(this.defender){
            this.defender.triggerFeatures(TriggerMoment.After, Trigger.AnyAction, new BaseFeatureParameter(this.fight, this.defender, this.attacker, this));
        }
    }

    abstract async save():Promise<void>;

}