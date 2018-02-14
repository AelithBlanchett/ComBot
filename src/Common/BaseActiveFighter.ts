import {Dice} from "./Dice";
import {BaseFight, FightStatus} from "./BaseFight";
import {FightLength, Team} from "./Constants";
import {Trigger} from "./Constants";
import {TriggerMoment} from "./Constants";
import * as Constants from "./Constants";
import {ModifierType} from "./Constants";
import {Tier} from "./Constants";
import {AchievementManager} from "../Achievements/AchievementManager";
import {BaseFighter} from "./BaseFighter";
import {BaseModifier} from "./BaseModifier";
import {Commands} from "./Parser";
import {BaseActiveAction} from "./BaseActiveAction";

export abstract class BaseActiveFighter<Modifier extends BaseModifier = BaseModifier> extends BaseFighter {

    fight:BaseFight;
    idFight:string;
    season:number = Constants.Globals.currentSeason;
    assignedTeam:Team = Team.Unknown;
    targets:BaseActiveFighter[];
    isReady:boolean = false;
    lastDiceRoll:number;
    isInTheRing:boolean = true;
    canMoveFromOrOffRing:boolean = true;
    lastTagTurn:number = 9999999;
    wantsDraw:boolean = false;
    distanceFromRingCenter:number;
    createdAt:Date;
    updatedAt:Date;
    modifiers:Modifier[];
    fightStatus: FightStatus;
    dice:Dice;

    constructor(){
        super();

        this.assignedTeam = Team.Unknown;
        this.targets = null;
        this.isReady = false;

        this.lastDiceRoll = null;
        this.isInTheRing = true;
        this.canMoveFromOrOffRing = true;
        this.lastTagTurn = 9999999;
        this.distanceFromRingCenter = 0;
        this.wantsDraw = false;
        this.modifiers = [];
        this.fightStatus = null;

        this.dice = new Dice(Constants.Globals.diceSides);
        this.season = Constants.Globals.currentSeason;
        this.fightStatus = FightStatus.Idle;
    }

    assignFight(fight:BaseFight):void{
        this.fight = fight;
        this.idFight = fight.idFight;
    }

    checkAchievements(activeFighter?:BaseActiveFighter, fight?:BaseFight){
        let strBase = `[color=yellow][b]Achievements unlocked for ${this.name}![/b][/color]\n`;
        let added = AchievementManager.checkAll(this, activeFighter, fight);

        if(added.length > 0){
            strBase += added.join("\n");
        }
        else{
            strBase = "";
        }

        return strBase;
    }

    //fight is "mistakenly" set as optional to be compatible with the super.init
    initialize():void {
        this.fightStatus = FightStatus.Initialized;
    }

    abstract validateStats():string;

    get isInDebug():boolean{
        if(this.fight != null){
            return this.fight.debug;
        }
        else{
            return false;
        }
    }

    //returns dice score
    roll(times:number = 1, event:string = Trigger.Roll.toString()):number {
        this.triggerMods(TriggerMoment.Before, event);
        let result = 0;
        if (times == 1) {
            result = this.dice.roll(Constants.Globals.diceCount);
        }
        else {
            result = this.dice.roll(Constants.Globals.diceCount * times);
        }

        if(this.isInDebug && this.fight.forcedDiceRoll > 0){
            result = this.fight.forcedDiceRoll;
        }

        this.triggerMods(TriggerMoment.After, event);
        return result;
    }

    nextRound():void{}

    triggerMods(moment:TriggerMoment, event:string, objFightAction?:any):boolean {
        let atLeastOneModWasActivated:boolean = false;
        for (let mod of this.modifiers) {
            let message = mod.trigger(moment, event, objFightAction);
            if(message.length > 0){
                this.fight.message.addSpecial(message);
                atLeastOneModWasActivated = true;
            }
        }
        return atLeastOneModWasActivated;
    }

    triggerFeatures<OptionalParameterType>(moment: TriggerMoment, event:Trigger, parameters?:OptionalParameterType):boolean{
        let atLeastOneFeatureWasActivated:boolean = false;
        for (let feat of this.features) {
            let message = feat.trigger(moment, event, parameters);
            if(message.length > 0){
                this.fight.message.addSpecial(message);
                atLeastOneFeatureWasActivated = true;
            }
        }
        return atLeastOneFeatureWasActivated;
    }

    removeMod(idMod:string):void { //removes a mod, and also its children. If a children has two parent Ids, then it doesn't remove the mod.
        let index = this.modifiers.findIndex(x => x.idModifier == idMod);
        if (index != -1) {
            this.modifiers[index].remove();
        }
    }

    fightDuration(){
        if(this.fight != null && this.fight.fightLength != null){
            return this.fight.fightLength;
        }
        else{
            return FightLength.Long;
        }
    }

    triggerInsideRing() {
        this.isInTheRing = true;
    }

    triggerOutsideRing() {
        this.isInTheRing = false;
    }

    triggerPermanentInsideRing() {
        this.isInTheRing = false;
        this.canMoveFromOrOffRing = false;
    }

    triggerPermanentOutsideRing() {
        this.triggerOutsideRing();
        this.canMoveFromOrOffRing = false;
    }

    abstract isTechnicallyOut(displayMessage?:boolean):boolean;

    requestDraw() {
        this.wantsDraw = true;
        this.fightStatus = FightStatus.Draw;
    }

    unrequestDraw() {
        this.wantsDraw = false;
        this.fightStatus = FightStatus.Playing;
    }

    isRequestingDraw():boolean {
        return this.wantsDraw;
    }

    getStunnedTier():Tier {
        let stunTier = Tier.None;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.type == ModifierType.Stun) {
                stunTier = mod.tier;
            }
        }
        return stunTier;
    }

    isStunned():boolean {
        return this.getStunnedTier() >= 0;
    }

    isApplyingHold():boolean {
        let isApplyingHold = false;
        for (let mod of this.modifiers) {
            if (mod.idApplier == this.name && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                isApplyingHold = true;
            }
        }
        return isApplyingHold;
    }

    isApplyingHoldOfTier():Tier {
        let tier = Tier.None;
        for (let mod of this.modifiers) {
            if (mod.idApplier == this.name && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                tier = mod.tier;
            }
        }
        return tier;
    }

    isInHold():boolean {
        let isInHold = false;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.isAHold()) {
                isInHold = true;
            }
        }
        return isInHold;
    }

    //May have to move
    isInSpecificHold(holdType:ModifierType):boolean {
        let isInHold = false;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.isAHold() && mod.type == holdType) {
                isInHold = true;
            }
        }
        return isInHold;
    }

    isInHoldAppliedBy(fighterName:string):boolean {
        let isTrue = false;
        for (let mod of this.modifiers) {
            if (mod.idApplier == fighterName && mod.isAHold()) {
                isTrue = true;
            }
        }
        return isTrue;
    }

    isInHoldOfTier():Tier {
        let tier = Tier.None;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.isAHold()) {
                tier = mod.tier;
            }
        }
        return tier;
    }

    releaseHoldsApplied() {
        for (let mod of this.modifiers) {
            if (mod.idApplier == this.name && mod.isAHold()) {
                mod.receiver.releaseHoldsAppliedBy(mod.idApplier);
            }
        }
    }

    releaseHoldsAppliedBy(fighterName:string) {
        for (let mod of this.modifiers) {
            if (mod.idApplier == fighterName && mod.isAHold()) {
                this.removeMod(mod.idModifier);
            }
        }
    }

    escapeHolds() {
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.isAHold()) {
                this.removeMod(mod.idModifier);
            }
        }
    }

    getListOfActiveModifiers():string{
        let strMods = "";
        for(let mod of this.modifiers){
            strMods += mod.type + ", ";
        }
        strMods = strMods.substring(0, strMods.length - 2);
        return strMods;
    }

    getStylizedName():string {
        let modifierBeginning = "";
        let modifierEnding = "";
        if (this.isTechnicallyOut()) {
            modifierBeginning = `[s]`;
            modifierEnding = `[/s]`;
        }
        else if (!this.isInTheRing) {
            modifierBeginning = `[i]`;
            modifierEnding = `[/i]`;
        }
        return `${modifierBeginning}[b][color=${Team[this.assignedTeam].toLowerCase()}]${this.name}[/color][/b]${modifierEnding}`;
    }

    isInRange(targets:BaseActiveFighter[]):boolean{
        let result = true;
        for(let target of targets){
            if((target.distanceFromRingCenter - this.distanceFromRingCenter) > Constants.Fight.Globals.maximumDistanceToBeConsideredInRange){
                result = false;
            }
        }
        return result;
    }

    abstract outputStatus():string;

    abstract penaltyOnAttackMissed(tier:Tier):void;

}