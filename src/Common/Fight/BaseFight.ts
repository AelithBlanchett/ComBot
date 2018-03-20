import {Utils} from "../Utils/Utils";
import {Dictionary} from "../Utils/Dictionary";
import * as BaseConstants from "../Constants/BaseConstants";
import {FightMessage} from "./FightMessage";
import {BaseFeatureParameter} from "../Features/BaseFeatureParameter";
import {BaseActiveFighter} from "./BaseActiveFighter";
import {BaseActiveAction} from "../Actions/BaseActiveAction";
import {IActionFactory} from "../Actions/IActionFactory";
import {IFChatLib} from "fchatlib/dist/src/IFChatLib";
import {FightingStages} from "../Constants/FightingStages";
import {FightFinishers} from "../Constants/FightFinishers";
import {Messages} from "../Constants/Messages";
import {Team} from "../Constants/Team";
import {GameSettings} from "../Configuration/GameSettings";
import {FightType} from "../Constants/FightType";
import {FightLength} from "../Constants/FightLength";
import {FightTier} from "../Constants/FightTier";
import {TokensPerWin} from "../Constants/TokensPerWin";
import {TransactionType} from "../Constants/TransactionType";
import {Trigger} from "../Constants/Trigger";
import {TriggerMoment} from "../Constants/TriggerMoment";

let EloRating = require('elo-rating');

export abstract class BaseFight<ActiveFighter extends BaseActiveFighter = BaseActiveFighter>{

    idFight:string;
    requiredTeams:number;
    hasStarted:boolean = false;
    hasEnded:boolean = false;
    stage:string;
    currentTurn:number;
    fightType:FightType;
    pastActions:Array<BaseActiveAction>;
    winnerTeam:Team;
    season:number;
    waitingForAction:boolean = true;
    fightLength:FightLength = FightLength.Long;

    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;

    fighters:ActiveFighter[];
    channel:string;
    message:FightMessage;
    fChatLibInstance:IFChatLib;
    actionFactory:IActionFactory<BaseFight, BaseActiveFighter>;

    debug:boolean = false;
    forcedDiceRoll:number = 0;
    diceLess:boolean = false;

    public constructor(actionFactory:IActionFactory<BaseFight, BaseActiveFighter>) {
        this.idFight = Utils.generateUUID();
        this.fighters = [];
        this.stage = FightingStages.pick();
        this.fightType = FightType.Classic;
        this.pastActions = [];
        this.winnerTeam = Team.Unknown;
        this.currentTurn = 0;
        this.season = GameSettings.currentSeason;
        this.requiredTeams = 2;
        this.diceLess = false;
        this.fightLength = FightLength.Long;
        this.actionFactory = actionFactory;
        this.message = new FightMessage();
    }

    build(fChatLibInstance:IFChatLib, channel:string){
        this.fChatLibInstance = fChatLibInstance;
        this.channel = channel;
    }

    sendFightMessage():void{
        this.fChatLibInstance.sendMessage(this.message.getMessage(), this.channel);
    }

    resendFightMessage():void{
        this.fChatLibInstance.sendMessage(this.message.getLastMessage(), this.channel);
    }

    setTeamsCount(intNewNumberOfTeams:number){
        if(intNewNumberOfTeams >= 2){
            this.requiredTeams = intNewNumberOfTeams;
            this.message.addInfo(Messages.changeMinTeamsInvolvedInFightOK);
        }
        else{
            this.message.addInfo(Messages.changeMinTeamsInvolvedInFightFail);
        }
        this.sendFightMessage();
    }

    setDiceLess(bln:boolean){
        if(!this.hasStarted && !this.hasEnded){
            this.diceLess = bln;
            this.message.addInfo(Utils.strFormat(Messages.setDiceLess, [(bln ? "NOT " : "")]));
        }
        else{
            this.message.addInfo(Messages.setDiceLessFail);
        }
        this.sendFightMessage();
    }

    setFightLength(fightDuration:FightLength){
        if(!this.hasStarted && !this.hasEnded){
            this.fightLength = fightDuration;
            this.message.addInfo(Utils.strFormat(Messages.setFightLength, [FightLength[this.fightLength]]));
        }
        else{
            this.message.addInfo(Messages.setFightLengthFail);
        }
        this.sendFightMessage();
    }

    setFightType(type:string){
        if(!this.hasStarted && !this.hasEnded){
            let fightTypesList = Utils.getEnumList(FightType);
            let foundAskedType = false;
            for(let fightTypeId in fightTypesList){
                if(type.toLowerCase() == FightType[fightTypeId].toLowerCase()){
                    this.fightType = FightType[FightType[fightTypeId]];
                    this.message.addInfo(Messages["setFightType"+ FightType[fightTypeId]]);
                    foundAskedType = true;
                    break;
                }
            }
            if(!foundAskedType){
                this.fightType = FightType.Classic;
                this.message.addInfo(Messages.setFightTypeNotFound);
            }
        }
        else{
            this.message.addInfo(Messages.setFightTypeFail);
        }
        this.sendFightMessage();
    }

    //Pre-fight utils

    async leave(fighterName:string) {
        if(!this.hasStarted){
            let index = this.getFighterIndex(fighterName);
            if(index != -1){
                let fighter = this.fighters[index];
                this.fighters.splice(index, 1);
                await this.deleteFighterFromFight(fighter.name, this.idFight);
            }
        }
    }

    async join(fighterName:string, team:Team):Promise<number> {
        if(!this.hasStarted){
            if (!this.getFighterByName(fighterName)) { //find fighter by its name property instead of comparing objects, which doesn't work.
                let activeFighter:ActiveFighter = await this.loadFighter(fighterName);
                if(activeFighter == null){
                    throw new Error(Messages.errorNotRegistered);
                }
                if(!activeFighter.canPayAmount(GameSettings.tokensCostToFight)){
                    throw new Error(Utils.strFormat(Messages.errorNotEnoughMoney, [GameSettings.tokensCostToFight.toString()]));
                }
                let areStatsValid = activeFighter.validateStats();
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
                this.message.addInfo(Utils.strFormat(Messages.Ready, [fighterInFight.getStylizedName(), listOfFightTypes, this.requiredTeams.toString(), listOfFightDurations]));
                this.sendFightMessage();
                if (this.canStart()) {
                    await this.start();
                }
                return true;
            }
        }
        return false;
    }

    canStart() {
        return (this.isEveryoneReady() && !this.hasStarted && this.getAllOccupiedTeams().length >= this.requiredTeams); //only start if everyone's ready and if the teams are balanced
    }


    //RWFight logic

    async start() {
        this.message.addInfo(Utils.strFormat(Messages.startMatchAnnounce, [this.idFight]));
        this.currentTurn = 1;
        this.hasStarted = true;
        this.shufflePlayers(); //random order for teams

        this.message.addInfo(Utils.strFormat(Messages.startMatchStageAnnounce, [this.stage]));

        for (let i = 0; i < this.maxPlayersPerTeam; i++) { //Prints as much names as there are Team
            let fullStringVS = "[b]";
            for (let j of this.getTeamsStillInGame()) {
                let theFighter = this.getTeam(j)[i];
                if(theFighter != null){
                    fullStringVS = `${fullStringVS} VS ${theFighter.getStylizedName()}`;
                }
            }
            fullStringVS = `${fullStringVS}[/b]`;
            fullStringVS =  fullStringVS.replace(" VS ","");
            this.message.addInfo(fullStringVS);
        }


        this.reorderFightersByInitiative(this.rollAllDice(Trigger.InitiationRoll));
        this.message.addInfo(Utils.strFormat(Messages.startMatchFirstPlayer, [this.currentPlayer.getStylizedName(), this.currentTeamName.toLowerCase(), this.currentTeamName]));
        for (let i = 1; i < this.fighters.length; i++) {
            this.message.addInfo(Utils.strFormat(Messages.startMatchFollowedBy, [this.fighters[i].getStylizedName(), Team[this.fighters[i].assignedTeam].toLowerCase(), Team[this.fighters[i].assignedTeam]]));
            if(this.fightType == FightType.Tag) {
                this.fighters[i].isInTheRing = false;
            }
        }
        if(this.fightType == FightType.Tag){ //if it's a tag match, only allow the first player of the next Team
            for (let i = 1; i < this.fighters.length; i++) {
                if (this.currentPlayer.assignedTeam != this.fighters[i].assignedTeam) {
                    this.fighters[i].isInTheRing = true;
                    break;
                }
            }
        }

        for (let i = 0; i < this.fighters.length; i++) {
            this.fighters[i].fightStatus = FightStatus.Playing;
            let fightCost:number = GameSettings.tokensCostToFight;
            await this.fighters[i].removeTokens(fightCost, TransactionType.FightStart);
            this.fighters[i].triggerFeatures(TriggerMoment.After, Trigger.InitiationRoll, new BaseFeatureParameter(this, this.fighters[i]));
        }



        this.sendFightMessage();
        await this.save();
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
        this.currentTurn++;

        for(let fighter of this.fighters){
            let strAchievements = await fighter.checkAchievements(fighter, this);
            if(strAchievements != ""){
                this.message.addSpecial(strAchievements);
            }
        }

        if (this.isOver()) { //Check for the ending
            let tokensToGiveToWinners:number = TokensPerWin[FightTier[this.getFightTier(this.winnerTeam)]];
            let tokensToGiveToLosers:number = tokensToGiveToWinners * GameSettings.tokensPerLossMultiplier;
            if(this.isDraw()){
                this.message.addHit(`DOUBLE KO! Everyone is out! It's over!`);
                tokensToGiveToLosers = tokensToGiveToWinners;
            }
            this.outputStatus();
            await this.endFight(tokensToGiveToWinners, tokensToGiveToLosers);
        }
        else{
            await this.save();
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
        this.message.addInfo(Utils.strFormat(Messages.outputStatusInfo, [this.currentTurn.toString(), this.currentTeamName.toLowerCase(), this.currentTeamName, this.currentPlayer.getStylizedName()]));

        for (let i = 0; i < this.fighters.length; i++) { //Prints as much names as there are Team
            let theFighter = this.fighters[i];
            if(theFighter != null){
                this.message.addStatus(theFighter.outputStatus());
            }
        }

        this.sendFightMessage();
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
            if (this.fighters[index].assignedTeam != this.fighters[this.currentPlayerIndex].assignedTeam && this.fighters[this.currentPlayerIndex].isInTheRing == true && this.fightType == FightType.Tag) {
                this.fighters.filter(x => x.isInTheRing && x.assignedTeam == this.fighters[this.currentPlayerIndex].assignedTeam && x.name != fighterName).forEach(x => x.isInTheRing = false);
            }
            this.message.addInfo(Utils.strFormat(Messages.setCurrentPlayerOK, [temp.name, this.fighters[this.currentPlayerIndex].name]));
        }
        else{
            this.message.addInfo(Messages.setCurrentPlayerFail)
        }
    }

    //RWFight helpers
    get currentTeamName():string{
        return Team[this.currentTeam];
    }

    get currentTarget():BaseActiveFighter[] {
        return this.currentPlayer.targets;
    }

    assignRandomTargetToAllFighters():void{
        for (let fighter of this.getAlivePlayers()) {
            this.assignRandomTargetToFighter(fighter);
        }
    }

    assignRandomTargetToFighter(fighter:ActiveFighter):void {
        fighter.targets = [this.getRandomFighterNotInTeam(fighter.assignedTeam)];
    }

    //Dice rolling
    rollAllDice(event:Trigger):Array<ActiveFighter> {
        let arrSortedFightersByInitiative = [];
        for (let player of this.getAlivePlayers()) {
            player.lastDiceRoll = player.roll(10, event);
            arrSortedFightersByInitiative.push(player);
            this.message.addHint(Utils.strFormat(Messages.rollAllDiceEchoRoll, [player.getStylizedName(), player.lastDiceRoll.toString()]));
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

    assignTarget(fighterName:string, name:string) {
        let theTarget = this.getFighterByName(name);
        if(theTarget != null){
            this.getFighterByName(fighterName).targets = [theTarget];
            this.message.addInfo("Target set to "+ theTarget.getStylizedName());
            this.sendFightMessage();
        }
        else{
            this.message.addError("Target not found.");
            this.sendFightMessage();
        }
    }

    async prepareAction(attacker:string, actionType:string, tierRequired:boolean, isCustomTargetInsteadOfTier:boolean, args:string) {
        let tier = -1;
        if (!this.isMatchInProgress()) {
            throw new Error("There isn't any fight going on.");
        }

        if(!this.waitingForAction){
            throw new Error(Messages.lastActionStillProcessing);
        }

        if (this.currentPlayer == null || attacker != this.currentPlayer.name) {
            throw new Error(Messages.doActionNotActorsTurn);
        }

        if(!isNaN(Number(args))){
            tier = parseInt(args);
        }

        if (tierRequired && tier == -1) {
            throw new Error(`The tier is required, and neither Light, Medium or Heavy was specified. Example: !action Medium`);
        }
        if (isCustomTargetInsteadOfTier) {
            let customTarget:BaseActiveFighter = this.getFighterByName(args);
            if (customTarget == null) {
                throw new Error("The character to tag with is required and wasn't found.");
            }
            else{
                this.currentPlayer.targets = [customTarget];
            }
        }

        if (!this.getFighterByName(attacker)) {
            throw new Error("You aren't participating in this fight.");
        }

        //Might need to disable this for self-targetted actions?
        if(this.currentTarget == null || this.currentTarget.length == 0){
            if(this.fighters.filter(x => x.assignedTeam != this.currentPlayer.assignedTeam && x.isInTheRing && !x.isTechnicallyOut()).length == 1){
                this.assignRandomTargetToFighter(this.currentPlayer);
            }
            else{
                throw new Error("There are too many possible targets. Please choose one with the '!target characternamehere' command.");
            }
        }

        this.waitingForAction = false;
        let action = await this.doAction(actionType, this.currentPlayer, this.currentTarget, tier);
        this.displayDeathMessagesIfNeedBe([action.attacker, ...action.defenders]);
        if (action.keepActorsTurn && action.missed == false) {
            this.message.addHint(`[b]This is still your turn ${action.attacker.getStylizedName()}![/b]`);
            this.sendFightMessage();
            this.waitingForAction = true;
        }
        else if (!this.isOver()) {
            await this.nextTurn();
        }
        else {
            await this.onMatchEnding();
        }
    }

    async doAction(actionName:string, attacker:BaseActiveFighter, defenders:BaseActiveFighter[], tier:number):Promise<BaseActiveAction> {
        let action:BaseActiveAction = this.actionFactory.getAction(actionName, this, attacker, defenders, tier);
        action.execute();
        await action.save();
        this.pastActions.push(action);
        return action;
    }

    displayDeathMessagesIfNeedBe(involvedActors:BaseActiveFighter[]){
        for(let actor of involvedActors){
            actor.isTechnicallyOut(true);
        }
    }

    async onMatchEnding(){
        let tokensToGiveToWinners:number = TokensPerWin[FightTier[this.getFightTier(this.winnerTeam)]];
        let tokensToGiveToLosers:number = tokensToGiveToWinners * GameSettings.tokensPerLossMultiplier;
        if(this.isDraw()){
            this.message.addHit(`DOUBLE KO! Everyone is out! It's over!`);
            tokensToGiveToLosers = tokensToGiveToWinners;
        }
        this.outputStatus();

        await this.endFight(tokensToGiveToWinners, tokensToGiveToLosers);
    }



    isMatchInProgress():boolean{
        return (this.hasStarted && !this.hasEnded);
    }

    getFightTier(winnerTeam){
        let highestWinnerTier = FightTier.Bronze;
        for (let fighter of this.getTeam(winnerTeam)) {
            if(fighter.fightTier() > highestWinnerTier){
                highestWinnerTier = fighter.fightTier();
            }
        }

        let lowestLoserTier = -99;
        for (let fighter of this.fighters) {
            if(fighter.assignedTeam != winnerTeam){
                if(lowestLoserTier == -99){
                    lowestLoserTier = fighter.fightTier();
                }
                else if(lowestLoserTier > fighter.fightTier()){
                    lowestLoserTier = fighter.fightTier();
                }
            }
        }

        //If the loser was weaker, the fight fightTier matches the winner's fightTier
        //if the weakest wrestler was equal or more powerful, the fight fightTier matches the loser's fightTier
        let fightTier = highestWinnerTier;
        if(lowestLoserTier >= highestWinnerTier){
            fightTier = lowestLoserTier;
        }

        return fightTier;
    }

    async forfeit(fighterName:string) {
        let fighter = this.getFighterByName(fighterName);
        if(fighter != null){
            if(!fighter.isTechnicallyOut()){
                fighter.fightStatus = FightStatus.Forfeited;
                this.punishPlayerOnForfeit(fighter);
            }
            else{
                this.message.addError(Messages.forfeitAlreadyOut);
                this.sendFightMessage();
                return;
            }
        }
        else{
            this.message.addInfo(`You are not participating in the match. OH, and that message should NEVER happen.`);
            this.sendFightMessage();
            return;
        }
        this.sendFightMessage();
        if (this.isOver()) {
            let tokensToGiveToWinners:number = TokensPerWin[FightTier[this.getFightTier(this.winnerTeam)]] * GameSettings.tokensForWinnerByForfeitMultiplier;
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
            this.message.addInfo(Messages.checkForDrawOK);
            this.sendFightMessage();
            let tokensToGive:number = this.currentTurn;
            if(tokensToGive > parseInt(TokensPerWin[FightTier.Bronze])){
                tokensToGive = parseInt(TokensPerWin[FightTier.Bronze]);
            }
            await this.endFight(0,tokensToGive, Team.Unknown); //0 because there isn't a winning Team
        }
        else{
            this.message.addInfo(Messages.checkForDrawWaiting);
            this.sendFightMessage();
        }
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
            this.message.addInfo(Utils.strFormat(Messages.endFightAnnounce, [Team[this.winnerTeam]]));
            this.message.addHit("Finisher suggestion: " + FightFinishers.pick());
            this.sendFightMessage();
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
                this.message.addInfo(`Awarded ${tokensToGiveToWinners} ${GameSettings.currencyName} to ${fighter.getStylizedName()}`);
                await fighter.giveTokens(tokensToGiveToWinners, TransactionType.FightReward, GameSettings.botName);
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
                this.message.addInfo(`Awarded ${tokensToGiveToLosers} ${GameSettings.currencyName} to ${fighter.getStylizedName()}`);
                await fighter.giveTokens(tokensToGiveToLosers, TransactionType.FightReward, GameSettings.botName);
            }
            this.message.addInfo(await fighter.checkAchievements(fighter, this));
            await fighter.save();
        }

        this.sendFightMessage();

        await this.save();
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
        return fighter;
    }

    getFighterIndex(fighterName:string) {
        let index = -1;
        for (let i = 0; i < this.fighters.length; i++) {
            if (this.fighters[i].name == fighterName) {
                index = i;
            }
        }
        return index;
    }

    getFirstPlayerIDAliveInTeam(Teams:Team, afterIndex:number = 0):number {
        let fullTeam = this.getTeam(Teams);
        let index = -1;
        for (let i = afterIndex; i < fullTeam.length; i++) {
            if (fullTeam[i] != null && !fullTeam[i].isTechnicallyOut() && fullTeam[i].isInTheRing) {
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

    getTeam(Teams:Team):Array<ActiveFighter> {
        let teamList = [];
        for (let player of this.fighters) {
            if (player.assignedTeam == Teams) {
                teamList.push(player);
            }
        }
        return teamList;
    }

    getNumberOfPlayersInTeam(Teams:Team):number {
        let fullTeamCount = this.getTeam(Teams);
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
            if (count[player.assignedTeam] == null) {
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

    getRandomFighterNotInTeam(Teams:Team):ActiveFighter {
        let tries = 0;
        let fighter:ActiveFighter;
        while (tries < 99 && (fighter == null || fighter.assignedTeam == null || fighter.assignedTeam == Teams)) {
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

    abstract async save():Promise<void>;

    abstract async load(fightId:string):Promise<void>;

    abstract async delete():Promise<void>;

    abstract deleteFighterFromFight(idFighter:string, idFight:string);

    abstract punishPlayerOnForfeit(fighter:ActiveFighter);

    abstract loadFighter(idFighter:string):Promise<ActiveFighter>;

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