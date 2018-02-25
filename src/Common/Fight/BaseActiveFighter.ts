import {Dice} from "../Utils/Dice";
import {BaseFight, FightStatus} from "./BaseFight";
import {FightLength} from "../BaseConstants";
import {Trigger} from "../BaseConstants";
import {TriggerMoment} from "../BaseConstants";
import * as BaseConstants from "../BaseConstants";
import {AchievementManager} from "../../Achievements/AchievementManager";
import {BaseFighter} from "./BaseFighter";
import {BaseModifier} from "../Modifiers/BaseModifier";
import {Teams} from "../Constants/Teams";
import {GameSettings} from "../Configuration/GameSettings";
import {IFeatureFactory} from "../Features/IFeatureFactory";

export abstract class BaseActiveFighter<Modifier extends BaseModifier = BaseModifier> extends BaseFighter {

    fight:BaseFight;
    idFight:string;
    season:number = GameSettings.currentSeason;
    assignedTeam:Teams = Teams.Unknown;
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

    constructor(featureFactory:IFeatureFactory<BaseFight, BaseFighter>){
        super(featureFactory);

        this.assignedTeam = Teams.Unknown;
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

        this.dice = new Dice(GameSettings.diceSides);
        this.season = GameSettings.currentSeason;
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
            result = this.dice.roll(GameSettings.diceCount);
        }
        else {
            result = this.dice.roll(GameSettings.diceCount * times);
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

    getStunnedTier():number {
        let stunTier = -1;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.type == "Stun") {
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
            if (mod.idApplier == this.name && mod.isAHold()) {
                isApplyingHold = true;
            }
        }
        return isApplyingHold;
    }

    isApplyingHoldOfTier():number {
        let tier = -1;
        for (let mod of this.modifiers) {
            if (mod.idApplier == this.name && mod.isAHold()) {
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
    isInSpecificHold(holdType:string):boolean {
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

    isInHoldOfTier():number {
        let tier = -1;
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
        return `${modifierBeginning}[b][color=${Teams[this.assignedTeam].toLowerCase()}]${this.name}[/color][/b]${modifierEnding}`;
    }

    isInRange(targets:BaseActiveFighter[]):boolean{
        let result = true;
        for(let target of targets){
            if((target.distanceFromRingCenter - this.distanceFromRingCenter) > BaseConstants.Fight.Globals.maximumDistanceToBeConsideredInRange){
                result = false;
            }
        }
        return result;
    }

    abstract outputStatus():string;

}