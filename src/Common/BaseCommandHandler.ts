import "reflect-metadata";
import {Utils} from "./Utils/Utils";
import {BaseFighter} from "./Fight/BaseFighter";
import {IFChatLib} from "fchatlib/dist/src/Interfaces/IFChatLib";
import {IMsgEvent} from "fchatlib/dist/src/Interfaces/IMsgEvent";
import {Messages} from "./Constants/Messages";
import {Team} from "./Constants/Team";
import {GameSettings} from "./Configuration/GameSettings";
import {Parser} from "./Utils/Parser";
import {BaseFight} from "./Fight/BaseFight";
import {FightLength} from "./Constants/FightLength";
import {FightType} from "./Constants/FightType";
import {TransactionType} from "./Constants/TransactionType";

export class BaseCommandHandler<TFight extends BaseFight, TFighter extends BaseFighter> {
    Fight:new () => TFight;
    Fighter:new () => TFighter;

    fChatLibInstance:IFChatLib;
    channel:string;
    fight:TFight;


    blnAutofight:boolean = false;
    debugImpersonatedCharacter:string = "Tina Armstrong";

    constructor(fight: { new (...args: any[]): TFight }, fighter: { new (...args: any[]): TFighter }, fChatLib:IFChatLib, chan:string) {
        this.Fight = fight;
        this.Fighter = fighter;
        this.fChatLibInstance = fChatLib;
        this.channel = chan;
        this.fight = new this.Fight();
        this.fight.build(fChatLib, chan);
        //this.fChatLibInstance.addPrivateMessageListener(privMsgEventHandler);
    }

    async impersonate(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character)) {
            this.debugImpersonatedCharacter = args;
        }
    }

    async runas(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character)) {
            let splits = args.split(" ");
            let command = splits[0];
            splits.shift();
            let commandArgs = splits.join(" ");
            let impersonatedData = data;
            impersonatedData.character = this.debugImpersonatedCharacter;
            this[command].apply(this, [commandArgs, impersonatedData]);
        }
    }

    async addfeature(args:string, data:IMsgEvent) {
        let parsedFeatureArgs = Parser.parseArgs(2, [typeof("").toString(), typeof(1).toString()], args);

        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != undefined) {
            try {
                let cost = fighter.addFeature(parsedFeatureArgs[0], parsedFeatureArgs[1]);
                await fighter.removeTokens(cost, TransactionType.Feature);
                await fighter.save();
                this.fChatLibInstance.sendPrivMessage(`[color=green]Success! Feature added.[/color]`, fighter.name);
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), fighter.name);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async getfeatureslist(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != undefined) {
            try {
                this.fChatLibInstance.sendPrivMessage("Usage: !addFeature myFeature OR !addFeature myFeature 2 (with 2 being the number of fights you want)." +
                    "\n[/color]Available features: " + fighter.featureFactory.getExistingFeatures().join(", "), data.character);
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), fighter.name);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }

    };

    async restat(args:string, data:IMsgEvent) {
        let parserPassed = Parser.checkIfValidStats(args, GameSettings.numberOfRequiredStatPoints, GameSettings.numberOfDifferentStats, GameSettings.minStatLimit, GameSettings.maxStatLimit);
        if(parserPassed != ""){
            this.fChatLibInstance.sendPrivMessage(`[color=red]${parserPassed}[/color]`, data.character);
            return;
        }
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != undefined) {
            if(fighter.canPayAmount(GameSettings.restatCostInTokens)) {
                try {
                    let arrParam:Array<number> = [];

                    for(let nbr of args.split(",")){
                        arrParam.push(parseInt(nbr));
                    }

                    let cost = GameSettings.restatCostInTokens;
                    await fighter.removeTokens(cost, TransactionType.Restat);
                    fighter.restat(arrParam);
                    await fighter.save();
                    this.fChatLibInstance.sendPrivMessage(Messages.statChangeSuccessful, fighter.name);
                }
                catch (ex) {
                    this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), fighter.name);
                }

            }
            else{
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.errorNotEnoughMoney, [GameSettings.restatCostInTokens.toString()]), data.character);
            }



        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async clearfeatures(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);

        if (fighter != undefined) {
            fighter.areStatsPrivate = false;
            try {
                fighter.clearFeatures();
                await fighter.save();
                this.fChatLibInstance.sendPrivMessage(`[color=green]You successfully removed all your features.[/color]`, fighter.name);
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    //admin commands

    debugmode(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character) && this.fight.hasStarted) {
            this.fight.debug = !this.fight.debug;
            this.fChatLibInstance.sendPrivMessage(`Debug mode is now set to ${this.fight.debug}`, data.character);
        }
    }

    setdicescore(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character) && this.fight.hasStarted) {
            this.fight.forcedDiceRoll = parseInt(args);
            this.fChatLibInstance.sendPrivMessage(`Dice score is now automatically set to ${this.fight.debug}`, data.character);
        }
    }

    exec(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character)) {
            try{
                eval(args);
            }
            catch(ex){
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
            }
        }
    }

    pause(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character)) {
            if (this.fight != undefined && !this.fight.hasEnded && this.fight.hasStarted) {
                this.fight = new this.Fight();
                this.fight.build(this.fChatLibInstance, this.channel);
                this.fChatLibInstance.sendMessage(`Successfully saved and stored the match for later. The ring is available now!`, this.channel);
            }
            else{
                this.fChatLibInstance.sendPrivMessage(`Something went wrong: either the fight wasn't started or it's already finished!`, data.character);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(`[color=red]You're not ${this.fChatLibInstance.config.master}![/color]`, data.character);
        }
    }

    status(args:string, data:IMsgEvent) {
        if (this.fight == undefined || this.fight.hasEnded || !this.fight.hasStarted) {
            this.fChatLibInstance.sendPrivMessage("There is no match going on right now.", data.character);
        }
        else {
            this.fight.resendFightMessage();
        }
    };

    async getstats(args:string, data:IMsgEvent) {
        if (args == "") {
            args = data.character;
        }

        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);

        if (fighter != undefined && (fighter.name == data.character || (fighter.name == data.character && !fighter.areStatsPrivate) || this.fChatLibInstance.isUserChatOP(data.character, data.channel))) {
            this.fChatLibInstance.sendPrivMessage(fighter.outputStats(), data.character);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorStatsPrivate, data.character);
        }
    };

    async hidemystats(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != undefined) {
            fighter.areStatsPrivate = false;
            try {
                await fighter.save();
                this.fChatLibInstance.sendPrivMessage("[color=green]You stats are now private.[/color]", data.character);
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    howtostart(args:string, data:IMsgEvent) {
        this.fChatLibInstance.sendPrivMessage(Messages.startupGuide, data.character);
    }

    async join(args:string, data:IMsgEvent) {
        if (this.fight == undefined || this.fight.hasEnded) {
            this.fight = new this.Fight();
            this.fight.build(this.fChatLibInstance, this.channel);
        }
        let chosenTeam = Parser.join(args);
        try {
            let assignedTeam:number = await this.fight.join(data.character, chosenTeam);
            this.fChatLibInstance.sendMessage(`[color=green]${data.character} stepped into the ring for the [color=${Team[assignedTeam]}]${Team[assignedTeam]}[/color] team! Waiting for everyone to be !ready.[/color]`, this.channel);
        }
        catch (err) {
            this.fChatLibInstance.sendMessage("[color=red]" + err.message + "[/color]", this.channel);
        }
    };

    async leave(args:string, data:IMsgEvent) {
        if (this.fight == undefined || this.fight.hasEnded) {
            this.fChatLibInstance.sendMessage("[color=red]There is no fight in progress. You must either do !forfeit or !draw to leave the fight.[/color]", this.channel);
            return false;
        }
        if (this.fight.hasStarted) {
            this.fChatLibInstance.sendMessage("[color=red]There is already a fight in progress. You must either do !forfeit or !draw to leave the fight.[/color]", this.channel);
            return false;
        }
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != undefined) {
            if (this.fight.leave(data.character)) { //else, the match starts!
                this.fChatLibInstance.sendMessage("[color=green]You are now out of the fight.[/color]", this.channel);
            }
            else {
                this.fChatLibInstance.sendMessage("[color=red]You have already left the fight.[/color]", this.channel);
            }
        }
        else {
            this.fChatLibInstance.sendMessage(Messages.errorNotRegistered, this.channel);
        }
    };

    async loadmylastfight(args:string, data:IMsgEvent) {
        if (this.fight == undefined || this.fight.hasEnded || !this.fight.hasStarted) {
            try {
                if (args) {
                    let theFight = new this.Fight();
                    await theFight.load(data.character);
                    if(theFight != null){
                        this.fight = theFight;
                        this.fight.build(this.fChatLibInstance, this.channel);
                        this.fight.outputStatus();
                    }
                    else{
                        this.fChatLibInstance.sendMessage("[color=red]Your latest fight doesn't exist or is already finished.[/color]", this.channel);
                    }
                }
                else {
                    this.fChatLibInstance.sendMessage("[color=red]Wrong idFight. It must be specified.[/color]", this.channel);
                }
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.stack), data.character);
            }
        }
        else {
            this.fChatLibInstance.sendMessage(Messages.errorFightAlreadyInProgress, this.channel);
        }
    };

    async loadfight(args:string, data:IMsgEvent) {
        if (this.fight == undefined || this.fight.hasEnded || !this.fight.hasStarted) {
            try {
                if (args) {
                    let theFight = new this.Fight();
                    await theFight.load(args);
                    if(theFight != null && (this.fChatLibInstance.isUserChatOP(data.character, data.channel) || theFight.fighters.findIndex(x => x.name == data.character) != -1)){
                        this.fight = theFight;
                        this.fight.build(this.fChatLibInstance, this.channel);
                        this.fight.outputStatus();
                    }
                    else{
                        this.fChatLibInstance.sendMessage("[color=red]No fight is associated with this idAction/fighter, or you don't have the rights to access it.[/color]", this.channel);
                    }
                }
                else {
                    this.fChatLibInstance.sendMessage("[color=red]Wrong idFight. It must be specified.[/color]", this.channel);
                }
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.stack), data.character);
            }
        }
        else {
            this.fChatLibInstance.sendMessage(Messages.errorFightAlreadyInProgress, this.channel);
        }
    };

    async ready(args:string, data:IMsgEvent) {
        if (this.fight.hasStarted) {
            this.fChatLibInstance.sendMessage(Messages.errorFightAlreadyInProgress, this.channel);
            return false;
        }
        if (this.fight == undefined || this.fight.hasEnded) {
            this.fight = new this.Fight();
            this.fight.build(this.fChatLibInstance, this.channel);
        }

        try{
            let result:boolean = await this.fight.setFighterReady(data.character);
            if (!result) { //else, the match starts!
                this.fChatLibInstance.sendMessage(Messages.errorAlreadyReady, this.channel);
            }
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };

    async register(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        let doesFighterExist = await fighter.exists(data.character);

        if (!doesFighterExist) {
            let parserPassed = Parser.checkIfValidStats(args, GameSettings.numberOfRequiredStatPoints, GameSettings.numberOfDifferentStats, GameSettings.minStatLimit, GameSettings.maxStatLimit);
            if(parserPassed != ""){
                this.fChatLibInstance.sendPrivMessage(`[color=red]${parserPassed}[/color]`, data.character);
                return;
            }
            let arrParam:Array<number> = [];

            for(let nbr of args.split(",")){
                arrParam.push(parseInt(nbr));
            }

            try {
                let newFighter = new this.Fighter();
                newFighter.name = data.character;
                newFighter.restat(arrParam);
                await newFighter.save();
                this.fChatLibInstance.sendPrivMessage(Messages.registerWelcomeMessage, data.character);
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorAlreadyRegistered, data.character);
        }
    };

    async givetokens(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character)) {
            let parsedArgs = Parser.tipPlayer(args);
            if (parsedArgs.message != null) {
                this.fChatLibInstance.sendPrivMessage("[color=red]The parameters for this command are wrong. " + parsedArgs.message + "\nExample: !tip character 10[/color]", data.character);
                return;
            }
            let fighterReceiving:BaseFighter = new this.Fighter();
            await fighterReceiving.load(parsedArgs.player);
            try {
                if (fighterReceiving != null) {
                    let amount:number = parsedArgs.amount;
                    await fighterReceiving.giveTokens(amount, TransactionType.DonationFromAdmin, data.character);
                    await fighterReceiving.save();
                    this.fChatLibInstance.sendPrivMessage(`[color=green]You have successfully given ${fighterReceiving.name} ${amount} tokens.[/color]`, data.character);
                    this.fChatLibInstance.sendPrivMessage(`[color=green]You've just received ${amount} tokens from ${data.character} ![/color]`, fighterReceiving.name);
                }
                else{
                    this.fChatLibInstance.sendPrivMessage(Messages.errorRecipientOrSenderNotFound, data.character);
                }
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
            }
        }

    };

    async tip(args:string, data:IMsgEvent) {
        let parsedArgs = Parser.tipPlayer(args);
        if (parsedArgs.message != null) {
            this.fChatLibInstance.sendPrivMessage("[color=red]The parameters for this command are wrong. " + parsedArgs.message + "\nExample: !tip character 10[/color]", data.character);
            return;
        }
        let fighterGiving:BaseFighter = new this.Fighter();
        await fighterGiving.load(data.character);
        let fighterReceiving:BaseFighter = new this.Fighter();
        await fighterReceiving.load(parsedArgs.player);
        try {
            if (fighterGiving != null && fighterReceiving != null) {
                let amount:number = parsedArgs.amount;
                if(fighterGiving.canPayAmount(amount)){
                    await fighterGiving.removeTokens(amount, TransactionType.Tip);
                    await fighterReceiving.giveTokens(amount, TransactionType.Tip, fighterGiving.name);
                    await fighterGiving.save();
                    await fighterReceiving.save();
                    this.fChatLibInstance.sendPrivMessage(`[color=green]You have successfully given ${fighterReceiving.name} ${amount} tokens.[/color]`, data.character);
                    this.fChatLibInstance.sendPrivMessage(`[color=green]You've just received ${amount} tokens from ${fighterGiving.name} for your... services.[/color]`, fighterReceiving.name);
                    if(fighterReceiving.name == "Miss_Spencer"){
                        if(amount <= 5){
                            this.fChatLibInstance.sendPrivMessage(`[url=http://i.imgur.com/3b7r7qk.jpg]Thanks for the tip♥[/url]`, data.character);
                        }
                        else {
                            this.fChatLibInstance.sendPrivMessage(`[url=http://i.imgur.com/fLpZ1IN.png]All those coins? For me?~[/url]`, data.character);
                        }
                    }
                }
                else{
                    this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.errorNotEnoughMoney, [amount.toString()]), data.character);
                }
            }
            else{
                this.fChatLibInstance.sendPrivMessage(Messages.errorRecipientOrSenderNotFound, data.character);
            }
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };

    async removefeature(args:string, data:IMsgEvent) {
        let parsedFeatureArgs = Parser.parseArgs(1, [typeof("").toString()], args);

        try {
            let fighter:BaseFighter = new this.Fighter();
            await fighter.load(data.character);
            if (fighter != null) {
                fighter.removeFeature(parsedFeatureArgs[0]);
                await fighter.save();
                this.fChatLibInstance.sendPrivMessage(`[color=green]You successfully removed that feature.[/color]`, fighter.name);
            }
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };

    async stats(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            this.fChatLibInstance.sendPrivMessage(fighter.outputStats(), fighter.name);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async statsforprofile(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            this.fChatLibInstance.sendPrivMessage(`[noparse]${fighter.outputStats()}[/noparse]`, fighter.name);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async fighttype(args:string, data:IMsgEvent) {
        let parsedFT:FightType = Parser.setFightType(args);
        if (parsedFT == -1) {
            let fightTypes = Utils.getEnumList(FightType);
            this.fChatLibInstance.sendMessage(`[color=red]Fight Type not found. Types: ${fightTypes.join(", ")}. Example: !fighttype classic[/color]`, this.channel);
            return;
        }
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            this.fight.setFightType(args);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async fightlength(args:string, data:IMsgEvent) {
        let parsedFD:FightLength = Parser.setFightLength(args);
        if (parsedFD == -1) {
            let fightDurations = Utils.getEnumList(FightLength);
            this.fChatLibInstance.sendMessage(`[color=red]Fight Length not found. Types: ${fightDurations.join(", ")}. Example: !fightlength Long[/color]`, this.channel);
            return;
        }
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            this.fight.setFightLength(parsedFD);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async usedice(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserChatOP(data.character, data.channel)) {
            let flag = (args.toLowerCase().indexOf("no") != -1);
            this.fight.setDiceLess(flag);
            return;
        }
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            let flag = (args.toLowerCase().indexOf("no") != -1);
            this.fight.setDiceLess(flag);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async teamscount(args:string, data:IMsgEvent) {
        let parsedTeams:number = Parser.setTeamsCount(args);
        if (parsedTeams <= 1) {
            this.fChatLibInstance.sendMessage("[color=red]The number of teams involved must be a numeral higher than 1 and lower or equal than 10.[/color]", this.channel);
            return;
        }
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            this.fight.setTeamsCount(parsedTeams);
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    async unhidemystats(args:string, data:IMsgEvent) {
        let fighter:BaseFighter = new this.Fighter();
        await fighter.load(data.character);
        if (fighter != null) {
            fighter.areStatsPrivate = false;
            try {
                await fighter.save();
                this.fChatLibInstance.sendPrivMessage("[color=green]You stats are now public.[/color]", data.character);
            }
            catch (ex) {
                this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
            }
        }
        else {
            this.fChatLibInstance.sendPrivMessage(Messages.errorNotRegistered, data.character);
        }
    };

    //Attacks placed in FightSystem/CommandHandler

    async resetfight(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserChatOP(data.character, data.channel)) {
            if(this.fight && this.fight.idFight){
                await this.fight.delete();
            }
            this.fight = new this.Fight();
            this.fight.build(this.fChatLibInstance, this.channel);
            this.fChatLibInstance.sendMessage("The fight has been ended.", data.channel);
        }
        else {
            this.fChatLibInstance.sendPrivMessage("[color=red]You're not an operator for this channel.[/color]", data.character);
        }
    };

    async forfeit(args:string, data:IMsgEvent) {
        if (this.fight == undefined || !this.fight.hasStarted || this.fight.hasEnded) {
            this.fChatLibInstance.sendPrivMessage("[color=red]There isn't any fight going on.[/color]", data.character);
            return false;
        }
        if (args != "" && !this.fChatLibInstance.isUserChatOP(data.character, data.channel)) {
            this.fChatLibInstance.sendPrivMessage("[color=red]You're not an operator for this channel. You can't force someone to forfeit.[/color]", data.character);
            return false;
        }
        if (args == "") {
            args = data.character;
        }

        try {
            await this.fight.forfeit(args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };

    async draw(args:string, data:IMsgEvent) {
        if (this.fight == undefined || !this.fight.hasStarted || this.fight.hasEnded) {
            this.fChatLibInstance.sendPrivMessage("[color=red]There isn't any fight going on.[/color]", data.character);
            return false;
        }
        try {
            this.fight.requestDraw(data.character);
            await this.fight.checkForDraw();
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };

    async undraw(args:string, data:IMsgEvent) {
        if (this.fight == undefined || !this.fight.hasStarted || this.fight.hasEnded) {
            this.fChatLibInstance.sendPrivMessage("[color=red]There isn't any fight going on.[/color]", data.character);
            return false;
        }
        try {
            this.fight.unrequestDraw(data.character);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };

    target(args:string, data:IMsgEvent) {
        if (this.fight == undefined || !this.fight.hasStarted || this.fight.hasEnded) {
            this.fChatLibInstance.sendPrivMessage("[color=red]There isn't any fight going on.[/color]", data.character);
            return false;
        }
        try {
            if (this.fight.getFighterByName(data.character)) {
                this.fight.assignTarget(data.character, args);
            }
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandError, ex.message), data.character);
        }
    };


}

// class PrivateCommandHandler {
//     fChatLibInstance:IFChatLib;
//
//     constructor(fChatLib) {
//         this.fChatLibInstance = fChatLib;
//     }
//
//     clearfeatures = BaseCommandHandler.prototype.clearfeatures;
//     debugmode = BaseCommandHandler.prototype.debugmode;
//     setdicescore = BaseCommandHandler.prototype.setdicescore;
//     resetdmg = BaseCommandHandler.prototype.resetdmg;
//     exec = BaseCommandHandler.prototype.exec;
//     runas = BaseCommandHandler.prototype.runas;
//     getstats = BaseCommandHandler.prototype.getstats;
//     hidemystats = BaseCommandHandler.prototype.hidemystats;
//     howtostart = BaseCommandHandler.prototype.howtostart;
//     stats = BaseCommandHandler.prototype.stats;
//     register = BaseCommandHandler.prototype.register;
//     //removestat = BaseCommandHandler.prototype.removestat;
//     removefeature = BaseCommandHandler.prototype.removefeature;
//     unhidemystats = BaseCommandHandler.prototype.unhidemystats;
//     restat = BaseCommandHandler.prototype.restat;
//     statsforprofile = BaseCommandHandler.prototype.statsforprofile;
// }

// let privMsgEventHandler = function (data) {
//
//     let privHandler = new PrivateCommandHandler(parent);
//
//     let opts = {
//         command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
//         argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
//     };
//
//     if (typeof privHandler[opts.command] === 'function') {
//         privHandler[opts.command](opts.argument, data);
//     }
// };