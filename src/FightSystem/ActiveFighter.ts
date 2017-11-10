import {Dice} from "../Common/Dice";
import {Fight, FightStatus} from "./Fight";
import {FightLength, Team} from "./Constants";
import {Action} from "./Action";
import {Trigger} from "./Constants";
import {TriggerMoment} from "./Constants";
import {FightType} from "./Constants";
import * as Constants from "./Constants";
import {ModifierType} from "./Constants";
import {Tier} from "./Constants";
import {Utils} from "../Common/Utils";
import {FeatureType} from "./Constants";
import {Modifier} from "./Modifiers/Modifier";
import {NSFWFighter} from "./Fighter";
import {AchievementManager} from "../Achievements/AchievementManager";

export class ActiveFighter extends NSFWFighter {

    fight:Fight;
    idFight:string;
    season:number = Constants.Globals.currentSeason;
    assignedTeam:Team = Team.Unknown;
    target:ActiveFighter;
    isReady:boolean = false;
    hp:number = 0;
    lust:number = 0;
    livesRemaining:number = 0;
    focus:number = 0;
    lastDiceRoll:number;
    isInTheRing:boolean = true;
    canMoveFromOrOffRing:boolean = true;
    lastTagTurn:number = 9999999;
    wantsDraw:boolean = false;
    consecutiveTurnsWithoutFocus:number;
    createdAt:Date;
    updatedAt:Date;
    modifiers:Modifier[];
    actionsDone:Action[];
    actionsInflicted:Action[];
    fightStatus: FightStatus;

    startingPower:number;
    startingSensuality:number;
    startingToughness:number;
    startingEndurance:number;
    startingDexterity:number;
    startingWillpower:number;
    powerDelta:number;
    sensualityDelta:number;
    toughnessDelta:number;
    enduranceDelta:number;
    dexterityDelta:number;
    willpowerDelta:number;

    hpDamageLastRound: number = 0;
    lpDamageLastRound: number = 0;
    fpDamageLastRound: number = 0;
    hpHealLastRound: number = 0;
    lpHealLastRound: number = 0;
    fpHealLastRound: number = 0;
    heartsDamageLastRound: number = 0;
    orgasmsDamageLastRound: number = 0;
    heartsHealLastRound: number = 0;
    orgasmsHealLastRound: number = 0;


    //Objects, do not need to store
    pendingAction:Action = null;
    dice:Dice;

    constructor(){
        super();
        this.toughness = 1;
        this.toughness = 1;
        this.endurance = 1;
        this.willpower = 1;
        this.sensuality = 1;
        this.power = 1;
        this.dexterity = 1;
        this.startingToughness = this.toughness;
        this.startingEndurance = this.endurance;
        this.startingWillpower = this.willpower;
        this.startingSensuality = this.sensuality;
        this.startingPower = this.power;
        this.startingDexterity = this.dexterity;

        this.hp = this.hpPerHeart();
        this.lust = 0;
        this.livesRemaining = this.maxLives();
        this.focus = this.initialFocus();

        this.assignedTeam = Team.Unknown;
        this.target = null;
        this.isReady = false;

        this.lastDiceRoll = null;
        this.isInTheRing = true;
        this.canMoveFromOrOffRing = true;
        this.lastTagTurn = 9999999;
        this.wantsDraw = false;
        this.consecutiveTurnsWithoutFocus = 0;
        this.modifiers = [];
        this.actionsDone = [];
        this.actionsInflicted = [];
        this.fightStatus = null;

        this.powerDelta = 0;
        this.sensualityDelta = 0;
        this.toughnessDelta = 0;
        this.enduranceDelta = 0;
        this.dexterityDelta = 0;
        this.willpowerDelta = 0;

        this.hpDamageLastRound = 0;
        this.lpDamageLastRound = 0;
        this.fpDamageLastRound = 0;
        this.hpHealLastRound = 0;
        this.lpHealLastRound = 0;
        this.fpHealLastRound = 0;
        this.heartsDamageLastRound = 0;
        this.orgasmsDamageLastRound = 0;
        this.heartsHealLastRound = 0;
        this.orgasmsHealLastRound = 0;

        this.dice = new Dice(Constants.Globals.diceSides);
        this.season = Constants.Globals.currentSeason;
        this.fightStatus = FightStatus.Idle;
    }

    initialFocus():number{
        return this.maxFocus();
    }

    maxFocus():number {
        return 30 + this.focusResistance();
    }

    totalHp():number{
        let hp = 130;
        if (this.toughness > 10) {
            hp += (this.toughness - 10);
        }
        switch (this.fightDuration()){
            case FightLength.Epic:
                hp = hp * 1.33;
                break;
            case FightLength.Long:
                hp = hp * 1.00;
                break;
            case FightLength.Medium:
                hp = hp * 0.66;
                break;
            case FightLength.Short:
                hp = hp * 0.33;
                break;
        }
        return hp;
    }

    hpPerHeart():number {
        return Math.ceil(this.totalHp() / this.maxLives());
    }

    totalLust():number{
        let lust = 130;
        if (this.endurance > 10) {
            lust += (this.endurance - 10);
        }
        switch (this.fightDuration()){
            case FightLength.Epic:
                lust = lust * 1.33;
                break;
            case FightLength.Long:
                lust = lust * 1.00;
                break;
            case FightLength.Medium:
                lust = lust * 0.66;
                break;
            case FightLength.Short:
                lust = lust * 0.33;
                break;
        }
        return lust;
    }

    lustPerOrgasm():number {
        return Math.ceil(this.totalLust() / this.maxLives());
    }

    maxLives():number {
        let maxLives = -1;
        switch (this.fightDuration()){
            case FightLength.Epic:
                maxLives = 4;
                break;
            case FightLength.Long:
                maxLives = 3;
                break;
            case FightLength.Medium:
                maxLives = 2;
                break;
            case FightLength.Short:
                maxLives = 1;
                break;
        }
        return maxLives;
    }

    minFocus():number {
        return 0;
    }

    focusResistance():number{
        let resistance = 30;
        if (this.willpower > 10) {
            resistance += (this.willpower - 10);
        }
        return resistance;
    }

    maxBondageItemsOnSelf():number {
        let maxBondageItemsOnSelf = -1;
        switch (this.fightDuration()){
            case FightLength.Epic:
                maxBondageItemsOnSelf = 5;
                break;
            case FightLength.Long:
                maxBondageItemsOnSelf = 4;
                break;
            case FightLength.Medium:
                maxBondageItemsOnSelf = 3;
                break;
            case FightLength.Short:
                maxBondageItemsOnSelf = 2;
                break;
        }
        return maxBondageItemsOnSelf;
    }

    assignFight(fight:Fight):void{
        this.fight = fight;
        this.idFight = fight.idFight;
    }

    getStatsInString():string{
        return `${this.power},${this.sensuality},${this.toughness},${this.endurance},${this.dexterity},${this.willpower}`;
    }

    checkAchievements(activeFighter?:ActiveFighter, fight?:Fight){
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
        this.startingToughness = this.toughness;
        this.startingEndurance = this.endurance;
        this.startingWillpower = this.willpower;
        this.startingSensuality = this.sensuality;
        this.startingPower = this.power;
        this.startingDexterity = this.dexterity;

        this.hp = this.hpPerHeart();
        this.lust = 0;
        this.livesRemaining = this.maxLives();
        this.focus = this.initialFocus();

        this.powerDelta = 0;
        this.sensualityDelta = 0;
        this.toughnessDelta = 0;
        this.enduranceDelta = 0;
        this.dexterityDelta = 0;
        this.willpowerDelta = 0;

        this.fightStatus = FightStatus.Initialized;
    }

    get isInDebug():boolean{
        if(this.fight != null){
            return this.fight.debug;
        }
        else{
            return false;
        }
    }

    get currentPower():number{
        return this.startingPower + this.powerDelta;
    }

    set currentPower(delta:number){
        this.powerDelta += delta;
    }

    get currentSensuality():number{
        return this.startingSensuality + this.sensualityDelta;
    }

    set currentSensuality(delta:number){
        this.sensualityDelta += delta;
    }

    get currentToughness():number{
        return this.startingToughness + this.toughnessDelta;
    }

    set currentToughness(delta:number){
        this.toughnessDelta += delta;
    }

    get currentEndurance():number{
        return this.startingEndurance + this.enduranceDelta;
    }

    set currentEndurance(delta:number){
        this.enduranceDelta += delta;
    }

    get currentDexterity():number{
        return this.startingDexterity + this.dexterityDelta;
    }

    set currentDexterity(delta:number){
        this.dexterityDelta += delta;
    }

    get currentWillpower():number{
        return this.startingWillpower + this.willpowerDelta;
    }

    set currentWillpower(delta:number){
        this.willpowerDelta += delta;
    }

    get livesDamageLastRound():number{
        return this.heartsDamageLastRound + this.orgasmsDamageLastRound;
    }

    get livesHealLastRound():number{
        return this.heartsHealLastRound + this.orgasmsHealLastRound;
    }

    get displayRemainingLives():string{
        let str = "";
        for(let i = 1; i <= this.maxLives(); i++){
            if(i < this.livesRemaining){
                str += "❤️";
            }
            else if(i == this.livesRemaining){
                str += "💓";
            }
            else{
                str += "🖤";
            }
        }
        return str;
    }

    //returns dice score
    roll(times:number = 1, event:Trigger = Trigger.Roll):number {
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

    nextRound(){
        this.hpDamageLastRound = 0;
        this.lpDamageLastRound = 0;
        this.fpDamageLastRound = 0;
        this.hpHealLastRound = 0;
        this.lpHealLastRound = 0;
        this.fpHealLastRound = 0;

        this.heartsDamageLastRound = 0;
        this.orgasmsDamageLastRound = 0;
        this.heartsHealLastRound = 0;
        this.orgasmsHealLastRound = 0;
    }

    triggerMods(moment:TriggerMoment, event:Trigger, objFightAction?:any) {
        for (let mod of this.modifiers) {
            mod.trigger(moment, event, objFightAction);
        }
    }

    removeMod(idMod:string) { //removes a mod, and also its children. If a children has two parent Ids, then it doesn't remove the mod.
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

    healHP(hp:number, triggerMods:boolean = true) {
        hp = Math.floor(hp);
        if (hp < 1) {
            hp = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.HPHealing);
        }
        if (this.hp + hp > this.hpPerHeart()) {
            hp = this.hpPerHeart() - this.hp; //reduce the number if it overflows the bar
        }
        this.hp += hp;
        this.hpHealLastRound += hp;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.HPHealing);
        }
    }

    healLP(lust:number, triggerMods:boolean = true) {
        lust = Math.floor(lust);
        if (lust < 1) {
            lust = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.LustHealing);
        }
        if (this.lust - lust < 0) {
            lust = this.lust; //reduce the number if it overflows the bar
        }
        this.lust -= lust;
        this.lpHealLastRound += lust;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.LustHealing);
        }
    }

    healFP(focus:number, triggerMods:boolean = true) {
        focus = Math.floor(focus);
        if (focus < 1) {
            focus = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.FocusHealing);
        }
        if (this.focus + focus > this.maxFocus()) {
            focus = this.maxFocus() - this.focus; //reduce the number if it overflows the bar
        }
        this.focus += focus;
        this.fpHealLastRound += focus;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.FocusHealing);
        }
    }

    hitHP(hp:number, triggerMods:boolean = true) {
        hp = Math.floor(hp);
        if (hp < 1) {
            hp = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.HPDamage);
        }
        this.hp -= hp;
        this.hpDamageLastRound += hp;
        if (this.hp <= 0) {
            this.triggerMods(TriggerMoment.Before, Trigger.HeartLoss);
            this.hp = 0;
            //this.heartsRemaining--;
            this.livesRemaining--;
            this.heartsDamageLastRound += 1;
            this.fight.message.addHit(`[b][color=red]Heart broken![/color][/b] ${this.name} has ${this.livesRemaining} lives left.`);
            if (this.livesRemaining > 0) {
                this.hp = this.hpPerHeart();
            }
            else if (this.livesRemaining == 1) {
                this.fight.message.addHit(`[b][color=red]Last life[/color][/b] for ${this.name}!`);
            }
            this.triggerMods(TriggerMoment.After, Trigger.HeartLoss);
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.HPDamage);
        }
    }

    hitLP(lust:number, triggerMods:boolean = true) {
        lust = Math.floor(lust);
        if (lust < 1) {
            lust = 1;
        }
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.LustDamage);
        }
        this.lust += lust;
        this.lpDamageLastRound += lust;
        if (this.lust >= this.lustPerOrgasm()) {
            this.triggerMods(TriggerMoment.Before, Trigger.Orgasm);
            this.lust = 0;
            //this.orgasmsRemaining--;
            this.livesRemaining--;
            this.orgasmsDamageLastRound += 1;
            this.fight.message.addHit(`[b][color=pink]Orgasm on the mat![/color][/b] ${this.name} has ${this.livesRemaining} lives left.`);
            this.lust = 0;
            if (triggerMods) {
                this.triggerMods(TriggerMoment.After, Trigger.Orgasm);
            }
            if (this.livesRemaining == 1) {
                this.fight.message.addHit(`[b][color=red]Last life[/color][/b] for ${this.name}!`);
            }
        }
        this.triggerMods(TriggerMoment.After, Trigger.LustDamage);
    }

    hitFP(focusDamage:number, triggerMods:boolean = true) { //focusDamage CAN BE NEGATIVE to gain it
        if (focusDamage <= 0) {
            return;
        }
        focusDamage = Math.floor(focusDamage);
        if (triggerMods) {
            this.triggerMods(TriggerMoment.Before, Trigger.FocusDamage);
        }
        this.focus -= focusDamage;
        this.fpDamageLastRound += focusDamage;
        if (triggerMods) {
            this.triggerMods(TriggerMoment.After, Trigger.FocusDamage);
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

    isDead(displayMessage:boolean = false):boolean {
        let condition = (this.livesRemaining == 0);
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} couldn't take it anymore! They're out!`);
        }
        return condition;
    }

    isSexuallyExhausted(displayMessage:boolean = false):boolean {
        let condition = (this.livesRemaining == 0);
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} got wrecked sexually! They're out!`);
        }
        return condition;
    }

    isBroken(displayMessage:boolean = false):boolean {
        let condition = (this.consecutiveTurnsWithoutFocus >= Constants.Fight.Action.Globals.maxTurnsWithoutFocus);
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} completely lost their focus! They're out!`);
        }
        return condition;
    }

    isCompletelyBound(displayMessage:boolean = false):boolean {
        let condition = (this.bondageItemsOnSelf() >= this.maxBondageItemsOnSelf());
        if(condition && displayMessage){
            this.fight.message.addHit(`${this.getStylizedName()} is completely bound! They're out!`);
        }
        return condition;
    }

    isTechnicallyOut(displayMessage = false):boolean {
        switch (this.fight.fightType) {
            case FightType.Classic:
            case FightType.Tag:
                return (
                this.isSexuallyExhausted(displayMessage)
                || this.isDead(displayMessage)
                || this.isBroken(displayMessage)
                || this.isCompletelyBound(displayMessage));
            case FightType.LastManStanding:
                return this.isDead(displayMessage);
            case FightType.SexFight:
                return this.isSexuallyExhausted(displayMessage);
            case FightType.Humiliation:
                return this.isBroken(displayMessage) || this.isCompletelyBound(displayMessage);
            case FightType.Bondage:
                return this.isCompletelyBound(displayMessage);
            default:
                return false;
        }

    }

    bondageItemsOnSelf():number {
        let bondageModCount = 0;
        for (let mod of this.modifiers) {
            if (mod.type == Constants.ModifierType.Bondage) {
                bondageModCount++;
            }
        }
        return bondageModCount;
    }

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
            if (mod.idReceiver == this.name && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                isInHold = true;
            }
        }
        return isInHold;
    }

    isInSpecificHold(holdType:ModifierType):boolean {
        let isInHold = false;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && mod.type == holdType) {
                isInHold = true;
            }
        }
        return isInHold;
    }

    isInHoldAppliedBy(fighterName:string):boolean {
        let isTrue = false;
        for (let mod of this.modifiers) {
            if (mod.idApplier == fighterName && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                isTrue = true;
            }
        }
        return isTrue;
    }

    isInHoldOfTier():Tier {
        let tier = Tier.None;
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                tier = mod.tier;
            }
        }
        return tier;
    }

    releaseHoldsApplied() {
        for (let mod of this.modifiers) {
            if (mod.idApplier == this.name && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                mod.receiver.releaseHoldsAppliedBy(mod.idApplier);
            }
        }
    }

    releaseHoldsAppliedBy(fighterName:string) {
        for (let mod of this.modifiers) {
            if (mod.idApplier == fighterName && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
                this.removeMod(mod.idModifier);
            }
        }
    }

    escapeHolds() {
        for (let mod of this.modifiers) {
            if (mod.idReceiver == this.name && (mod.type == Constants.ModifierType.SubHold || mod.type == Constants.ModifierType.SexHold || mod.type == Constants.ModifierType.HumHold)) {
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

    outputStatus() {
        let nameLine = `${this.getStylizedName()}:`;
        let hpLine = `  [color=yellow]hit points: ${this.hp}${((this.hpDamageLastRound > 0 || this.hpHealLastRound > 0) ? `${(((-this.hpDamageLastRound + this.hpHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(-this.hpDamageLastRound + this.hpHealLastRound)})[/color]` : "")}|${this.hpPerHeart()}[/color] `;
        let lpLine = `  [color=pink]lust points: ${this.lust}${((this.lpDamageLastRound > 0 || this.lpHealLastRound > 0) ? `${(((-this.lpDamageLastRound + this.lpHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(this.lpDamageLastRound - this.lpHealLastRound)})[/color]` : "")}|${this.lustPerOrgasm()}[/color] `;
        let livesLine = `  [color=red]lives: ${this.displayRemainingLives}${((this.orgasmsDamageLastRound > 0 || this.orgasmsHealLastRound > 0) ? `${(((-this.orgasmsDamageLastRound + this.orgasmsHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(-this.orgasmsDamageLastRound + this.orgasmsHealLastRound)} orgasm(s))[/color]` : "")}${((this.heartsDamageLastRound > 0 || this.heartsHealLastRound > 0) ? `${(((-this.heartsDamageLastRound + this.heartsHealLastRound) < 0) ? "[color=red]" : "[color=green]")}  (${Utils.getSignedNumber(-this.heartsDamageLastRound + this.heartsHealLastRound)} heart(s))[/color]` : "")}(${this.livesRemaining}|${this.maxLives()})[/color] `;
        let focusLine = `  [color=orange]${this.hasFeature(FeatureType.DomSubLover) ? "submissiveness" : "focus"}:[/color] [b][color=${(this.focus <= 0 ? "red" : "orange")}]${this.focus}[/color][/b]${(((this.fpDamageLastRound > 0 || this.fpHealLastRound > 0) && (this.fpDamageLastRound - this.fpHealLastRound != 0)) ? `${(((-this.fpDamageLastRound + this.fpHealLastRound) < 0) ? "[color=red]" : "[color=green]")} (${Utils.getSignedNumber(-this.fpDamageLastRound + this.fpHealLastRound)})[/color]` : "")}|[color=green]${this.maxFocus()}[/color] `;
        let turnsFocusLine = `  [color=orange]turns ${this.hasFeature(FeatureType.DomSubLover) ? "being too submissive" : "without focus"}: ${this.consecutiveTurnsWithoutFocus}|${Constants.Fight.Action.Globals.maxTurnsWithoutFocus}[/color] `;
        let bondageLine = `  [color=purple]bondage items ${this.bondageItemsOnSelf()}|${Constants.Fight.Action.Globals.maxBondageItemsOnSelf}[/color] `;
        let modifiersLine = `  [color=cyan]affected by: ${this.getListOfActiveModifiers()}[/color] `;
        let targetLine = `  [color=red]target: ` + (this.target != undefined ? `${this.target.getStylizedName()}` : "None set yet! (!target charactername)") + `[/color]`;

        return `${Utils.pad(50, nameLine, "-")} ${hpLine} ${lpLine} ${livesLine} ${focusLine} ${turnsFocusLine} ${bondageLine} ${(this.getListOfActiveModifiers().length > 0 ? modifiersLine : "")} ${targetLine}`;
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

}