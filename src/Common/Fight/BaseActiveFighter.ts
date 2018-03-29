import {Dice} from "../Utils/Dice";
import {BaseFight, FightStatus} from "./BaseFight";
import {Trigger} from "../Constants/Trigger";
import {TriggerMoment} from "../Constants/TriggerMoment";
import {AchievementManager} from "../Achievements/AchievementManager";
import {BaseFighter} from "./BaseFighter";
import {BaseModifier} from "../Modifiers/BaseModifier";
import {Team} from "../Constants/Team";
import {GameSettings} from "../Configuration/GameSettings";
import {IFeatureFactory} from "../Features/IFeatureFactory";
import {FightLength} from "../Constants/FightLength";
import {Column, CreateDateColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";

export abstract class BaseActiveFighter<Modifier extends BaseModifier = BaseModifier> extends BaseFighter {

    //@ManyToOne(type => BaseFight, fight => fight.fighters)
    fight:BaseFight;
    @PrimaryColumn()
    idFight:string;
    @Column()
    assignedTeam:Team = Team.Unknown;
    @Column("simple-array")
    targets:string[];
    @Column()
    isReady:boolean = false;
    @Column()
    lastDiceRoll:number;
    @Column()
    isInTheRing:boolean = true;
    @Column()
    canMoveFromOrOffRing:boolean = true;
    @Column()
    lastTagTurn:number = 9999999;
    @Column()
    wantsDraw:boolean = false;
    @Column()
    distanceFromRingCenter:number;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
    //@Column()
    modifiers:Modifier[];
    @Column()
    fightStatus: FightStatus;
    dice:Dice;

    constructor(featureFactory:IFeatureFactory<BaseFight, BaseFighter>){
        super(featureFactory);

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

        this.dice = new Dice(GameSettings.diceSides);
        this.fightStatus = FightStatus.Idle;
    }

    assignFight(fight:BaseFight):void{
        this.fight = fight;
        this.idFight = fight.idFight;
    }

    getTargets():BaseActiveFighter[]{
        let fighters:BaseActiveFighter[] = [];
        for(let name of this.targets){
            let fighter = this.fight.getFighterByName(name);
            if(fighter != null){
                fighters.push(fighter);
            }
        }
        return fighters;
    }

    async checkAchievements(activeFighter?:BaseActiveFighter, fight?:BaseFight){
        let strBase = `[color=yellow][b]Achievements unlocked for ${this.name}![/b][/color]\n`;
        let added = await AchievementManager.checkAll(this, activeFighter, fight);

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
    roll(times:number = 1, event:Trigger = Trigger.Roll):number {
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

    triggerMods(moment:TriggerMoment, event:Trigger, objFightAction?:any):boolean {
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
            if (mod.receiver.name == this.name && mod.name == "Stun") {
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
            if (mod.receiver.name == this.name && mod.isAHold()) {
                isApplyingHold = true;
            }
        }
        return isApplyingHold;
    }

    isApplyingHoldOfTier():number {
        let tier = -1;
        for (let mod of this.modifiers) {
            if (mod.receiver.name == this.name && mod.isAHold()) {
                tier = mod.tier;
            }
        }
        return tier;
    }

    isInHold():boolean {
        let isInHold = false;
        for (let mod of this.modifiers) {
            if (mod.receiver.name == this.name && mod.isAHold()) {
                isInHold = true;
            }
        }
        return isInHold;
    }

    //May have to move
    isInSpecificHold(holdType:string):boolean {
        let isInHold = false;
        for (let mod of this.modifiers) {
            if (mod.receiver.name == this.name && mod.isAHold() && mod.name == holdType) {
                isInHold = true;
            }
        }
        return isInHold;
    }

    isInHoldAppliedBy(fighterName:string):boolean {
        let isTrue = false;
        for (let mod of this.modifiers) {
            if (mod.receiver.name == fighterName && mod.isAHold()) {
                isTrue = true;
            }
        }
        return isTrue;
    }

    isInHoldOfTier():number {
        let tier = -1;
        for (let mod of this.modifiers) {
            if (mod.receiver.name == this.name && mod.isAHold()) {
                tier = mod.tier;
            }
        }
        return tier;
    }

    releaseHoldsApplied() {
        for (let mod of this.modifiers) {
            if (mod.applier != null && mod.applier.name == this.name && mod.isAHold()) {
                mod.receiver.releaseHoldsAppliedBy(mod.applier.name);
            }
        }
    }

    releaseHoldsAppliedBy(fighterName:string) {
        for (let mod of this.modifiers) {
            if (mod.applier != null && mod.applier.name == fighterName && mod.isAHold()) {
                this.removeMod(mod.idModifier);
            }
        }
    }

    escapeHolds() {
        for (let mod of this.modifiers) {
            if (mod.receiver.name == this.name && mod.isAHold()) {
                this.removeMod(mod.idModifier);
            }
        }
    }

    getListOfActiveModifiers():string{
        let strMods = "";
        for(let mod of this.modifiers){
            strMods += mod.name + ", ";
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
            if((target.distanceFromRingCenter - this.distanceFromRingCenter) > GameSettings.maximumDistanceToBeConsideredInRange){
                result = false;
            }
        }
        return result;
    }

    abstract outputStatus():string;

}