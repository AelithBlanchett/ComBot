import {Action, ActionType} from "./Action";
import {IFChatLib} from "../Common/IFChatLib";
import {Utils} from "../Common/Utils";
import {Dictionary} from "../Common/Dictionary";
import * as Constants from "./Constants";
import Team = Constants.Team;
import Tier = Constants.Tier;
import FightTier = Constants.FightTier;
import TokensPerWin = Constants.TokensPerWin;
import Trigger = Constants.Trigger;
import {BondageModifier} from "./Modifiers/CustomModifiers";
import TriggerMoment = Constants.TriggerMoment;
import {Message} from "../Common/Messaging";
import {ActiveFighter} from "./ActiveFighter";
import {ActiveFighterRepository} from "../Repositories/ActiveFighterRepository";
import {FightRepository} from "../Repositories/FightRepository";
import {FighterRepository} from "../Repositories/FighterRepository";
import {FeatureType, FightType} from "./Constants";
import {TransactionType} from "./Constants";
import {FightLength} from "./Constants";
import {Commands} from "../Common/Parser";
let EloRating = require('elo-rating');

export class Fight{

    idFight:string;
    requiredTeams:number;
    hasStarted:boolean = false;
    hasEnded:boolean = false;
    stage:string;
    currentTurn:number;
    fightType:FightType;
    pastActions:Array<Action>;
    winnerTeam:Team;
    season:number;
    waitingForAction:boolean = true;
    fightLength:FightLength = FightLength.Long;

    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    fighters:ActiveFighter[] = [];
    channel:string;
    message:Message;
    fChatLibInstance:IFChatLib;

    debug:boolean = false;
    forcedDiceRoll:number = 0;
    diceLess:boolean = false;

    public constructor() {
        this.idFight = Utils.generateUUID();
        this.stage = this.pickStage();
        this.fightType = FightType.Classic;
        this.pastActions = [];
        this.winnerTeam = Team.Unknown;
        this.currentTurn = 0;
        this.season = Constants.Globals.currentSeason;
        this.requiredTeams = 2;
        this.diceLess = false;
        this.fightLength = FightLength.Long;
    }

    build(fChatLibInstance:IFChatLib, channel:string){
        this.fChatLibInstance = fChatLibInstance;
        this.channel = channel;
        this.message = new Message(fChatLibInstance, channel);
    }

    setTeamsCount(intNewNumberOfTeams:number){
        if(intNewNumberOfTeams >= 2){
            this.requiredTeams = intNewNumberOfTeams;
            this.message.addInfo(Constants.Messages.changeMinTeamsInvolvedInFightOK);
        }
        else{
            this.message.addInfo(Constants.Messages.changeMinTeamsInvolvedInFightFail);
        }
        this.message.send();
    }

    setDiceLess(bln:boolean){
        if(!this.hasStarted && !this.hasEnded){
            this.diceLess = bln;
            this.message.addInfo(Utils.strFormat(Constants.Messages.setDiceLess, [(bln ? "NOT " : "")]));
        }
        else{
            this.message.addInfo(Constants.Messages.setDiceLessFail);
        }
        this.message.send();
    }

    setFightLength(fightDuration:FightLength){
        if(!this.hasStarted && !this.hasEnded){
            this.fightLength = fightDuration;
            this.message.addInfo(Utils.strFormat(Constants.Messages.setFightLength, [FightLength[this.fightLength]]));
        }
        else{
            this.message.addInfo(Constants.Messages.setFightLengthFail);
        }
        this.message.send();
    }

    setFightType(type:string){
        if(!this.hasStarted && !this.hasEnded){
            let fightTypesList = Utils.getEnumList(FightType);
            let foundAskedType = false;
            for(let fightTypeId in fightTypesList){
                if(type.toLowerCase() == FightType[fightTypeId].toLowerCase()){
                    this.fightType = FightType[FightType[fightTypeId]];
                    this.message.addInfo(Constants.Messages["setFightType"+ FightType[fightTypeId]]);
                    foundAskedType = true;
                    break;
                }
            }
            if(!foundAskedType){
                this.fightType = FightType.Classic;
                this.message.addInfo(Constants.Messages.setFightTypeNotFound);
            }
        }
        else{
            this.message.addInfo(Constants.Messages.setFightTypeFail);
        }
        this.message.send();
    }

    //Pre-fight utils

    async leave(fighterName:string) {
        if(!this.hasStarted){
            let index = this.getFighterIndex(fighterName);
            if(index != -1){
                let fighter = this.fighters[index];
                this.fighters.splice(index, 1);

                //delete from DB
                try {
                    if(await ActiveFighterRepository.exists(fighter.name, this.idFight)){
                        await ActiveFighterRepository.delete(fighter.name, this.idFight);
                    }
                }
                catch (ex) {
                    this.message.addError(Utils.strFormat(Constants.Messages.commandError, ex.message));
                    this.message.send();
                }
            }
        }
    }

    async join(fighterName:string, team:Team):Promise<number> {
        if(!this.hasStarted){
            if (!this.getFighterByName(fighterName)) { //find fighter by its name property instead of comparing objects, which doesn't work.
                let activeFighter:ActiveFighter = await ActiveFighterRepository.initialize(fighterName);
                if(activeFighter == null){
                    throw new Error(Constants.Messages.errorNotRegistered);
                }
                if(activeFighter.tokens < Constants.Fight.Globals.tokensCostToFight){
                    throw new Error(`${Constants.Messages.errorNotEnoughMoney} (It costs ${Constants.Fight.Globals.tokensCostToFight} tokens). Get to work and earn it!`);
                }
                let statsInString = activeFighter.getStatsInString();
                let areStatsValid = Commands.checkIfValidStats(statsInString);
                if(areStatsValid != ""){
                    throw new Error(areStatsValid);
                }
                activeFighter.assignFight(this);
                activeFighter.initialize();
                activeFighter.fightStatus = FightStatus.Joined;
                if(team != Team.Unknown){
                    activeFighter.assignedTeam = team;
                }
                else{
                    team = this.getAvailableTeam();
                    activeFighter.assignedTeam = team;
                }
                this.fighters.push(activeFighter);
                return team;
            }
            else {
                throw new Error("You have already joined the fight.");
            }
        }
        else {
            throw new Error("The fight has already started");
        }
    }

    async setFighterReady(fighterName:string) {
        if(!this.hasStarted){
            if (!this.getFighterByName(fighterName)) {
                await this.join(fighterName, Team.Unknown);
            }
            let fighterInFight:ActiveFighter = this.getFighterByName(fighterName);
            if(fighterInFight && !fighterInFight.isReady){ //find fighter by its name property instead of comparing objects, which doesn't work.
                fighterInFight.isReady = true;
                fighterInFight.fightStatus = FightStatus.Ready;
                let fightTypes = Utils.getEnumList(FightType);
                let listOfFightTypes = fightTypes.join(", ");
                listOfFightTypes = listOfFightTypes.replace(FightType[this.fightType], `[color=green][b]${FightType[this.fightType]}[/b][/color]`);
                let fightDurations = Utils.getEnumList(FightLength);
                let listOfFightDurations = fightDurations.join(", ");
                listOfFightDurations = listOfFightDurations.replace(FightLength[this.fightLength], `[color=green][b]${FightLength[this.fightLength]}[/b][/color]`);
                this.message.addInfo(Utils.strFormat(Constants.Messages.Ready, [fighterInFight.getStylizedName(), listOfFightTypes, this.requiredTeams.toString(), listOfFightDurations]));
                this.message.send();
                if (this.canStart()) {
                    this.start();
                }
                return true;
            }
        }
        return false;
    }

    canStart() {
        return (this.isEveryoneReady() && !this.hasStarted && this.getAllOccupiedTeams().length >= this.requiredTeams); //only start if everyone's ready and if the teams are balanced
    }


    //Fight logic

    async start() {
        this.message.addInfo(Utils.strFormat(Constants.Messages.startMatchAnnounce, [this.idFight]));
        this.currentTurn = 1;
        this.hasStarted = true;
        this.shufflePlayers(); //random order for teams

        this.message.addInfo(Utils.strFormat(Constants.Messages.startMatchStageAnnounce, [this.stage]));

        for (let i = 0; i < this.maxPlayersPerTeam; i++) { //Prints as much names as there are team
            let fullStringVS = "[b]";
            for (let j of this.getTeamsStillInGame()) {
                let theFighter = this.getTeam(j)[i];
                if(theFighter != undefined){
                    fullStringVS = `${fullStringVS} VS ${theFighter.getStylizedName()}`;
                }
            }
            fullStringVS = `${fullStringVS}[/b]`;
            fullStringVS =  fullStringVS.replace(" VS ","");
            this.message.addInfo(fullStringVS);
        }


        this.reorderFightersByInitiative(this.rollAllDice(Trigger.InitiationRoll));
        this.message.addInfo(Utils.strFormat(Constants.Messages.startMatchFirstPlayer, [this.currentPlayer.getStylizedName(), this.currentTeamName.toLowerCase(), this.currentTeamName]));
        for (let i = 1; i < this.fighters.length; i++) {
            this.message.addInfo(Utils.strFormat(Constants.Messages.startMatchFollowedBy, [this.fighters[i].getStylizedName(), Team[this.fighters[i].assignedTeam].toLowerCase(), Team[this.fighters[i].assignedTeam]]));
            if(this.fightType == FightType.Tag) {
                this.fighters[i].isInTheRing = false;
            }
        }
        if(this.fightType == FightType.Tag){ //if it's a tag match, only allow the first player of the next team
            for (let i = 1; i < this.fighters.length; i++) {
                if (this.currentPlayer.assignedTeam != this.fighters[i].assignedTeam) {
                    this.fighters[i].isInTheRing = true;
                    break;
                }
            }
        }

        for (let i = 0; i < this.fighters.length; i++) {
            this.fighters[i].fightStatus = FightStatus.Playing;
            let fightCost:number = Constants.Fight.Globals.tokensCostToFight;
            this.fighters[i].removeTokens(fightCost);
            await FighterRepository.logTransaction(this.fighters[i].name, -fightCost, TransactionType.FightStart);

            for (let feature of this.fighters[i].features) {
                let modToAdd = feature.getModifier(this, this.fighters[i]);
                if (modToAdd) {
                    this.fighters[i].modifiers.push(modToAdd);
                }
                if (feature.isExpired()) {
                    this.fighters[i].removeFeature(feature.type);
                    this.message.addHint("This feature has expired.");
                }
            }
        }



        this.message.send();
        await FightRepository.persist(this);
        this.outputStatus();
    }

    requestDraw(fighterName:string) {
        let fighter = this.getFighterByName(fighterName);
        if (fighter) {
            if (!fighter.isRequestingDraw()) {
                fighter.requestDraw();
            }
            else {
                throw new Error("You already have requested a draw.");
            }
        }
        else {
            throw new Error("You aren't in this fight.");
        }
    }

    unrequestDraw(fighterName:string) {
        let fighter = this.getFighterByName(fighterName);
        if (fighter) {
            if (fighter.isRequestingDraw()) {
                fighter.unrequestDraw();
            }
            else {
                throw new Error("You already have requested a draw.");
            }
        }
        else {
            throw new Error("You aren't in this fight.");
        }
    }

    async nextTurn(){
        for (let fighter of this.fighters) {
            fighter.triggerMods(TriggerMoment.Any, Trigger.OnTurnTick);
            if(!fighter.isInHold()){
                fighter.healFP(Constants.Fight.Action.Globals.fpHealOnNextTurn);
            }
            if(fighter.focus <= fighter.minFocus()){
                fighter.consecutiveTurnsWithoutFocus++;
            }
            else{
                fighter.consecutiveTurnsWithoutFocus = 0;
            }
        }
        this.currentTurn++;

        for(let fighter of this.fighters){
            let strAchievements = fighter.checkAchievements(fighter, this);
            if(strAchievements != ""){
                this.message.addSpecial(strAchievements);
            }
            //displays message too if they're out
            if(!fighter.isTechnicallyOut(true)) {
                if (fighter.focus <= fighter.minFocus() && (this.fightType == FightType.Classic || this.fightType == FightType.Tag || this.fightType == FightType.Humiliation)) {
                    this.message.addSpecial(`If ${fighter.getStylizedName()} doesn't focus back on the fight, they'll soon be out of the fight!`);
                }
            }


        }

        if (this.isOver()) { //Check for the ending
            let tokensToGiveToWinners:number = TokensPerWin[FightTier[this.getFightTier(this.winnerTeam)]];
            let tokensToGiveToLosers:number = tokensToGiveToWinners*Constants.Fight.Globals.tokensPerLossMultiplier;
            if(this.isDraw()){
                this.message.addHit(`DOUBLE KO! Everyone is out! It's over!`);
                tokensToGiveToLosers = tokensToGiveToWinners;
            }
            this.outputStatus();
            await this.endFight(tokensToGiveToWinners, tokensToGiveToLosers);
        }
        else{
            FightRepository.persist(this);
            this.waitingForAction = true;
            this.outputStatus();
        }

        for(let fighter of this.fighters){
            fighter.nextRound();
        }
    }

    isOver():boolean {
        return this.getTeamsStillInGame().length <= 1;
    }

    isDraw():boolean{
        return this.getTeamsStillInGame().length == 0;
    }

    async waitUntilWaitingForAction():Promise<void>{
        while((!this.hasStarted || !this.waitingForAction || this.currentTurn <= 0) && !this.hasEnded){
            await new Promise(resolve => setTimeout(resolve, 1))
        }
        return;
    }

    //Fighting info displays

    outputStatus(){
        this.message.addInfo(Utils.strFormat(Constants.Messages.outputStatusInfo, [this.currentTurn.toString(), this.currentTeamName.toLowerCase(), this.currentTeamName, this.currentPlayer.getStylizedName()]));

        for (let i = 0; i < this.fighters.length; i++) { //Prints as much names as there are team
            let theFighter = this.fighters[i];
             if(theFighter != undefined){
                 this.message.addStatus(theFighter.outputStatus());
             }
        }

        this.message.send();
    }

    get currentTeam():Team{
        return this.getAlivePlayers()[(this.currentTurn - 1) % this.aliveFighterCount].assignedTeam;
    }

    get nextTeamToPlay():Team{
        return this.getAlivePlayers()[this.currentTurn % this.aliveFighterCount].assignedTeam;
    }

    get currentPlayerIndex():number {
        let curTurn = 1;
        if(this.currentTurn > 0){
            curTurn = this.currentTurn - 1;
        }
        return curTurn % this.aliveFighterCount;
    }

    get currentPlayer():ActiveFighter {
        return this.getAlivePlayers()[this.currentPlayerIndex];
    }

    get nextPlayer():ActiveFighter {
        return this.getAlivePlayers()[this.currentTurn % this.aliveFighterCount];
    }

    setCurrentPlayer(fighterName:string){
        let index = this.fighters.findIndex((x) => x.name == fighterName && !x.isTechnicallyOut());
        if (index != -1 && this.fighters[this.currentPlayerIndex].name != fighterName) { //switch positions
            let temp = this.fighters[this.currentPlayerIndex];
            this.fighters[this.currentPlayerIndex] = this.fighters[index];
            this.fighters[index] = temp;
            this.fighters[this.currentPlayerIndex].isInTheRing = true;
            if (this.fighters[index].assignedTeam == this.fighters[this.currentPlayerIndex].assignedTeam && this.fighters[index].isInTheRing == true && this.fightType == FightType.Tag) {
                this.fighters[index].isInTheRing = false;
            }
            this.message.addInfo(Utils.strFormat(Constants.Messages.setCurrentPlayerOK, [temp.name, this.fighters[this.currentPlayerIndex].name]));
        }
        else{
            this.message.addInfo(Constants.Messages.setCurrentPlayerFail)
        }
    }

    //Fight helpers
    get currentTeamName(){
        return Team[this.currentTeam];
    }

    get currentTarget():ActiveFighter {
        return this.currentPlayer.target;
    }

    assignRandomTargetToAllFighters():void{
        for (let fighter of this.getAlivePlayers()) {
            this.assignRandomTargetToFighter(fighter);
        }
    }

    assignRandomTargetToFighter(fighter:ActiveFighter):void {
        fighter.target = this.getRandomFighterNotInTeam(fighter.assignedTeam);
    }

    //Dice rolling
    rollAllDice(event:Trigger):Array<ActiveFighter> {
        let arrSortedFightersByInitiative = [];
        for (let player of this.getAlivePlayers()) {
            player.lastDiceRoll = player.roll(10, event);
            arrSortedFightersByInitiative.push(player);
            this.message.addHint(Utils.strFormat(Constants.Messages.rollAllDiceEchoRoll, [player.getStylizedName(), player.lastDiceRoll.toString()]));
        }

        arrSortedFightersByInitiative.sort((a,b):number => {
            return b.lastDiceRoll - a.lastDiceRoll;
        });

        return arrSortedFightersByInitiative;
    }

    rollAllGetWinner(event:Trigger):ActiveFighter {
        return this.rollAllDice(event)[0];
    }

    //Attacks
    checkIfCanTag() {
        let turnsSinceLastTag = (this.currentPlayer.lastTagTurn - this.currentTurn);
        let turnsToWait = (Constants.Fight.Action.Globals.turnsToWaitBetweenTwoTags * 2) - turnsSinceLastTag; // *2 because there are two fighters
        if(turnsToWait > 0){
            throw new Error(`[b][color=red]You can't tag yet. Turns left: ${turnsToWait}[/color][/b]`);
        }
        if(!this.currentTarget.canMoveFromOrOffRing){
            throw new Error(`[b][color=red]You can't tag with this character. They're permanently out.[/color][/b]`);
        }
        if(this.currentTarget.assignedTeam != this.currentPlayer.assignedTeam){
            throw new Error(`[b][color=red]You can't tag with this character as they are not in your team.[/color][/b]`);
        }
    }

    canAttack(action:ActionType) {
        if(action == undefined){
            throw new Error(Constants.Messages.canAttackNoAction);
        }
        if(!this.waitingForAction){
            throw new Error(Constants.Messages.canAttackNotWaitingForAction);
        }
        if(this.currentPlayer.isTechnicallyOut()){
            throw new Error(Constants.Messages.canAttackIsOut);
        }
        if(!this.currentPlayer.isInTheRing){
            throw new Error(Constants.Messages.canAttackIsOutOfTheRing);
        }
        //if(!this.currentTarget.isInTheRing){
        //    throw new Error(Constants.Messages.canAttackTargetIsOutOfTheRing);
        //}
        //if(this.currentTarget.isTechnicallyOut()){
        //    throw new Error(Constants.Messages.canAttackTargetOutOfFight);
        //}
        if (action == ActionType.SubHold || action == ActionType.SexHold || action == ActionType.HumHold || action == ActionType.Bondage) {
            if(this.currentPlayer.isInHold()){
                throw new Error(Constants.Messages.canAttackIsInHold);
            }
        }
        return true;
    }

    isTargetValid() {
        if (!this.currentTarget.isInTheRing) {
            throw new Error(Constants.Messages.canAttackTargetIsOutOfTheRing);
        }
        if (this.currentTarget.isTechnicallyOut()) {
            throw new Error(Constants.Messages.canAttackTargetOutOfFight);
        }
        return true;
    }

    checkAttackRequirements(action:ActionType) {
        if (action == ActionType.Bondage) {
            if(!this.currentTarget.isInHold() && !this.currentTarget.hasFeature(FeatureType.BondageBunny)){
                throw new Error(Constants.Messages.checkAttackRequirementsNotInSexualHold);
            }
        }
        if (action == ActionType.Submit && this.fightType == FightType.LastManStanding) {
            throw new Error(Utils.strFormat(Constants.Messages.wrongMatchTypeForAction, ["submit", "Last Man Standing"]));
        }
        if (action == ActionType.Submit && this.currentTurn <= Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber) {
            throw new Error(Utils.strFormat(Constants.Messages.tapoutTooEarly, [Constants.Fight.Action.Globals.tapoutOnlyAfterTurnNumber.toLocaleString()]));
        }
        if (action == ActionType.Stun && this.currentTarget != null && this.currentTarget.isStunned()) {
            throw new Error(Constants.Messages.targetAlreadyStunned);
        }
    }

    assignValidTargetIfWrong() {
        if(this.currentTarget == undefined || this.currentTarget.isTechnicallyOut() || !this.currentTarget.isInTheRing || this.currentTarget == this.currentPlayer){
            this.currentPlayer.target = this.getRandomFighterNotInTeam(this.currentPlayer.assignedTeam);
        }
    }

    assignTarget(fighterName:string, name:string) {
        let theTarget = this.getFighterByName(name);
        if(theTarget != undefined){
            this.getFighterByName(fighterName).target = theTarget;
            this.message.addInfo("Successfully set the target to "+name);
            this.message.send();
        }
        else{
            this.message.addError("Target not found.");
            this.message.send();
        }
    }

    prepareAction(fighterName:string, actionType:ActionType, tierRequired:boolean, isCustomTargetInsteadOfTier:boolean, args:string) {
        let tier = Tier.None;
        let customTarget:string = null;
        if (!this.hasStarted) {
            throw new Error("There isn't any fight going on.");
        }

        if (this.currentPlayer == undefined || fighterName != this.currentPlayer.name) {
            throw new Error(Constants.Messages.doActionNotActorsTurn);
        }

        if (tierRequired) {
            tier = Utils.stringToEnum(Tier, args);
            if (tier == -1) {
                throw new Error(`The tier is required, and neither Light, Medium or Heavy was specified. Example: !${ActionType[actionType]} Medium`);
            }
        }
        if (isCustomTargetInsteadOfTier) {
            customTarget = args;
            if (this.getFighterByName(args) == null) {
                throw new Error("The character to tag with is required and wasn't found.");
            }
        }

        if (this.getFighterByName(fighterName)) {
            this.doAction(actionType, tier, customTarget);
        }
        else {
            throw new Error("You aren't participating in this fight.");
        }
    }

    doAction(action:ActionType, tier:Tier, customTarget:string) {
        if(this.hasStarted && !this.hasEnded){
            this.assignValidTargetIfWrong();
            if (!this.canAttack(action)) {
                return;
            }

            if (action == ActionType.Tag) { //put in the condition any attacks that could focus allies

                if (customTarget != null) {
                    let target = this.getFighterByName(customTarget);
                    if (target.assignedTeam == this.currentPlayer.assignedTeam) {
                        this.currentPlayer.target = target;
                    }
                }
                this.checkIfCanTag();
            }
            else {
                if (customTarget != null) {
                    let target = this.getFighterByName(customTarget);
                    if (target.assignedTeam != this.currentPlayer.assignedTeam) {
                        this.currentPlayer.target = target;
                    }
                    else {
                        throw new Error(Constants.Messages.doActionTargetIsSameTeam);
                    }
                }
                this.isTargetValid();
            }

            this.checkAttackRequirements(action);

            this.waitingForAction = false;
            let attacker = this.currentPlayer; // need to store them in case of turn-changing logic
            let defender = this.currentTarget;

            attacker.pendingAction = new Action(this.idFight, this.currentTurn, action, tier, attacker.name, (defender != null ? defender.name : null));
            attacker.pendingAction.buildAction(this, attacker, defender);
            let eventToTriggerAfter = attacker.pendingAction.triggerAction(); //The specific trigger BEFORE is executed inside the attacks, see Action.ts
            attacker.triggerMods(TriggerMoment.After, eventToTriggerAfter, attacker.pendingAction);
            attacker.pendingAction.commit(this);
        }
    }

    getFightTier(winnerTeam){
        let highestWinnerTier = FightTier.Bronze;
        for (let fighter of this.getTeam(winnerTeam)) {
            if(fighter.tier() > highestWinnerTier){
                highestWinnerTier = fighter.tier();
            }
        }

        let lowestLoserTier = -99;
        for (let fighter of this.fighters) {
            if(fighter.assignedTeam != winnerTeam){
                if(lowestLoserTier == -99){
                    lowestLoserTier = fighter.tier();
                }
                else if(lowestLoserTier > fighter.tier()){
                    lowestLoserTier = fighter.tier();
                }
            }
        }



        //If the loser was weaker, the fight tier matches the winner's tier
        //if the weakest wrestler was equal or more powerful, the fight tier matches the loser's tier
        let fightTier = highestWinnerTier;
        if(lowestLoserTier >= highestWinnerTier){
            fightTier = lowestLoserTier;
        }

        return fightTier;
    }

    pickStage(){
        return Constants.Arenas[Math.floor(Math.random() * Constants.Arenas.length)];
    }

    async forfeit(fighterName:string) {
        let fighter = this.getFighterByName(fighterName);
        if(fighter != null){
            if(!fighter.isTechnicallyOut()){
                this.message.addHit(Utils.strFormat(Constants.Messages.forfeitItemApply, [fighter.getStylizedName(), fighter.maxBondageItemsOnSelf().toString()]));
                for(let i = 0; i < fighter.maxBondageItemsOnSelf(); i++){
                    fighter.modifiers.push(new BondageModifier(fighter));
                }
                fighter.fightStatus = FightStatus.Forfeited;
                this.message.addHit(Utils.strFormat(Constants.Messages.forfeitTooManyItems, [fighter.getStylizedName()]));
                fighter.triggerPermanentOutsideRing();
            }
            else{
                this.message.addError(Constants.Messages.forfeitAlreadyOut);
                this.message.send();
                return;
            }
        }
        else{
            this.message.addInfo(`You are not participating in the match. OH, and that message should NEVER happen.`);
            this.message.send();
            return;
        }
        this.message.send();
        if (this.isOver()) {
            let tokensToGiveToWinners:number = TokensPerWin[FightTier[this.getFightTier(this.winnerTeam)]] * Constants.Fight.Globals.tokensForWinnerByForfeitMultiplier;
            await this.endFight(tokensToGiveToWinners, 0);
        }
        else{
            this.outputStatus();
        }
    }

    async checkForDraw(){
        let neededDrawFlags = this.getAlivePlayers().length;
        let drawFlags = 0;
        for (let fighter of this.getAlivePlayers()) {
            if(fighter.wantsDraw){
                drawFlags++;
            }
        }
        if(neededDrawFlags == drawFlags){
            this.message.addInfo(Constants.Messages.checkForDrawOK);
            this.message.send();
            let tokensToGive:number = this.currentTurn;
            if(tokensToGive > parseInt(TokensPerWin[FightTier.Bronze])){
                tokensToGive = parseInt(TokensPerWin[FightTier.Bronze]);
            }
            await this.endFight(0,tokensToGive, Team.Unknown); //0 because there isn't a winning team
        }
        else{
            this.message.addInfo(Constants.Messages.checkForDrawWaiting);
            this.message.send();
        }
    }

    static pickFinisher(){
        return Constants.finishers[Math.floor(Math.random() * Constants.finishers.length)];
    }

    async endFight(tokensToGiveToWinners:number, tokensToGiveToLosers:number, forceWinner?:Team){
        this.hasEnded = true;
        this.hasStarted = false;
        
        if(!forceWinner){
            this.winnerTeam = this.getTeamsStillInGame()[0];
        }
        else{
            this.winnerTeam = forceWinner;
        }
        if(this.winnerTeam != Team.Unknown){
            this.message.addInfo(Utils.strFormat(Constants.Messages.endFightAnnounce, [Team[this.winnerTeam]]));
            this.message.addHit("Finisher suggestion: " + Fight.pickFinisher());
            this.message.send();
        }

        let eloAverageOfWinners = 0;
        let numberOfWinners = 0;
        let numberOfLosers = 0;
        let eloAverageOfLosers = 0;
        let eloPointsChangeToWinners: number;
        let eloPointsChangeToLosers: number;
        for (let fighter of this.fighters) {
            if (fighter.assignedTeam == this.winnerTeam) {
                numberOfWinners++;
                eloAverageOfWinners += fighter.eloRating;
            }
            else{
                numberOfLosers++;
                eloAverageOfLosers += fighter.eloRating;
            }
        }

        eloAverageOfWinners = Math.floor(eloAverageOfWinners / numberOfWinners);
        eloAverageOfLosers = Math.floor(eloAverageOfLosers / numberOfLosers);

        let eloResults = EloRating.calculate(eloAverageOfWinners, eloAverageOfLosers);
        eloPointsChangeToWinners = eloResults.playerRating - eloAverageOfWinners;
        eloPointsChangeToLosers = eloResults.opponentRating - eloAverageOfLosers;

        for (let fighter of this.fighters) {
            if (fighter.assignedTeam == this.winnerTeam) {
                fighter.fightStatus = FightStatus.Won;
                this.message.addInfo(`Awarded ${tokensToGiveToWinners} ${Constants.Globals.currencyName} to ${fighter.getStylizedName()}`);
                fighter.giveTokens(tokensToGiveToWinners);
                await FighterRepository.logTransaction(fighter.name, tokensToGiveToWinners, TransactionType.FightReward, Constants.Globals.botName);
                fighter.wins++;
                fighter.winsSeason++;
                fighter.eloRating += eloPointsChangeToWinners;
            }
            else {
                if (this.winnerTeam != Team.Unknown) {
                    fighter.fightStatus = FightStatus.Lost;
                    fighter.losses++;
                    fighter.lossesSeason++;
                    fighter.eloRating += eloPointsChangeToLosers;
                }
                this.message.addInfo(`Awarded ${tokensToGiveToLosers} ${Constants.Globals.currencyName} to ${fighter.getStylizedName()}`);
                fighter.giveTokens(tokensToGiveToLosers);
                await FighterRepository.logTransaction(fighter.name, tokensToGiveToLosers, TransactionType.FightReward, Constants.Globals.botName);
            }
            this.message.addInfo(fighter.checkAchievements(fighter, this));
            await FighterRepository.persist(fighter);
        }

        this.message.send();

        await FightRepository.persist(this);
    }

    reorderFightersByInitiative(arrFightersSortedByInitiative:Array<ActiveFighter>) {
        let index = 0;
        for (let fighter of arrFightersSortedByInitiative) {
            let indexToMoveInFront = this.getFighterIndex(fighter.name);
            let temp = this.fighters[index];
            this.fighters[index] = this.fighters[indexToMoveInFront];
            this.fighters[indexToMoveInFront] = temp;
            index++;
        }
    }

    getAlivePlayers():Array<ActiveFighter> {
        let arrPlayers = [];
        for (let player of this.fighters) {
            if (!player.isTechnicallyOut() && player.isInTheRing) {
                arrPlayers.push(player);
            }
        }
        return arrPlayers;
    }

    getFighterByName(name:string):ActiveFighter {
        let fighter:ActiveFighter = null;
        for (let player of this.fighters) {
            if (player.name == name) {
                fighter = player;
            }
        }
        if (fighter == null) {
            //throw new Error("This fighter isn't participating in the fight.");
        }
        return fighter;
    }

    getFighterIndex(fighterName:string) {
        let index = -1;
        for (let i = 0; i < this.fighters.length; i++) {
            if (this.fighters[i].name == fighterName) {
                index = i;
            }
        }
        if (index == -1) {
            //throw new Error("This fighter isn't participating in the fight.");
        }
        return index;
    }

    getFirstPlayerIDAliveInTeam(team:Team, afterIndex:number = 0):number {
        let fullTeam = this.getTeam(team);
        let index = -1;
        for (let i = afterIndex; i < fullTeam.length; i++) {
            if (fullTeam[i] != undefined && !fullTeam[i].isTechnicallyOut() && fullTeam[i].isInTheRing) {
                index = i;
            }
        }
        return index;
    }

    shufflePlayers():void {
        for (let i = 0; i < this.fighters.length - 1; i++) {
            let j = i + Math.floor(Math.random() * (this.fighters.length - i));
            let temp = this.fighters[j];
            this.fighters[j] = this.fighters[i];
            this.fighters[i] = temp;
        }
    }

    getTeam(team:Team):Array<ActiveFighter> {
        let teamList = [];
        for (let player of this.fighters) {
            if (player.assignedTeam == team) {
                teamList.push(player);
            }
        }
        return teamList;
    }

    getNumberOfPlayersInTeam(team:Team):number {
        let fullTeamCount = this.getTeam(team);
        return fullTeamCount.length;
    }

    getAllOccupiedTeams():Array<Team> {
        let usedTeams:Array<Team> = [];
        for (let player of this.fighters) {
            if (usedTeams.indexOf(player.assignedTeam) == -1) {
                usedTeams.push(player.assignedTeam);
            }
        }
        return usedTeams;
    }
    
    getAllUsedTeams():Array<Team> {
        let usedTeams:Array<Team> = this.getAllOccupiedTeams();

        let teamIndex = 0;
        while (usedTeams.length < this.requiredTeams) {
            let teamToAdd = Team[Team[teamIndex]];
            if (usedTeams.indexOf(teamToAdd) == -1) {
                usedTeams.push(teamToAdd);
            }
            teamIndex++;
        }
        return usedTeams;
    }

    getTeamsStillInGame():Array<Team> {
        let usedTeams:Array<Team> = [];
        for (let player of this.getAlivePlayers()) {
            if (usedTeams.indexOf(player.assignedTeam) == -1) {
                usedTeams.push(player.assignedTeam);
            }
        }
        return usedTeams;
    }

    getTeamsIdList():Array<number> {
        let arrResult = [];
        for (let enumMember in Team) {
            let isValueProperty = parseInt(enumMember, 10) >= 0;
            if (isValueProperty) {
                arrResult.push(enumMember);
            }
        }
        return arrResult;
    }

    getRandomTeam():Team {
        return this.getTeamsStillInGame()[Utils.getRandomInt(0, this.numberOfTeamsInvolved)];
    }

    get numberOfTeamsInvolved():number {
        return this.getTeamsStillInGame().length;
    }

    get numberOfPlayersPerTeam():Array<number> {
        let count = Array<number>();
        for (let player of this.fighters) {
            if (count[player.assignedTeam] == undefined) {
                count[player.assignedTeam] = 1;
            }
            else {
                count[player.assignedTeam] = count[player.assignedTeam] + 1;
            }
        }
        return count;
    }

    get maxPlayersPerTeam():number { //returns 0 if there aren't any teams
        let maxCount = 0;
        for (let nb of this.numberOfPlayersPerTeam) {
            if (nb > maxCount) {
                maxCount = nb;
            }
        }
        return maxCount;
    }

    isEveryoneReady():boolean {
        let isEveryoneReady = true;
        for (let fighter of this.fighters) {
            if (!fighter.isReady) {
                isEveryoneReady = false;
            }
        }
        return isEveryoneReady;
    }

    getAvailableTeam():Team {
        let teamToUse:Team = Team.Blue;
        let arrPlayersCount = new Dictionary<Team, number>();
        let usedTeams = this.getAllUsedTeams();
        for (let teamId of usedTeams) {
            arrPlayersCount.add(teamId as Team, this.getNumberOfPlayersInTeam(Team[Team[teamId]]));
        }

        let mostPlayersInTeam = Math.max(...arrPlayersCount.values());
        let leastPlayersInTeam = Math.min(...arrPlayersCount.values());
        let indexOfFirstEmptiestTeam = arrPlayersCount.values().indexOf(leastPlayersInTeam);

        if (mostPlayersInTeam == leastPlayersInTeam || mostPlayersInTeam == -Infinity || leastPlayersInTeam == Infinity) {
            teamToUse = Team.Blue;
        }
        else {
            teamToUse = Team[Team[indexOfFirstEmptiestTeam]];
        }

        return teamToUse;
    }

    getRandomFighter():ActiveFighter {
        return this.getAlivePlayers()[Utils.getRandomInt(0, this.getAlivePlayers().length)];
    }

    getRandomFighterNotInTeam(team:Team):ActiveFighter {
        let tries = 0;
        let fighter:ActiveFighter;
        while (tries < 99 && (fighter == undefined || fighter.assignedTeam == undefined || fighter.assignedTeam == team)) {
            fighter = this.getRandomFighter();
            tries++;
        }
        return fighter;
    }

    //Misc. shortcuts
    get fighterCount():number {
        return this.fighters.length;
    }

    get aliveFighterCount():number {
        return this.getAlivePlayers().length;
    }

}

export enum FightStatus {
    Idle = -2,
    Initialized = -1,
    Lost = 0,
    Won = 1,
    Playing = 2,
    Forfeited = 3,
    Joined = 4,
    Ready = 5,
    Draw = 6
}