import {BaseCommandHandler} from "../Common/BaseCommandHandler";
import {Utils} from "../Common/Utils/Utils";
import * as BaseConstants from "../Common/BaseConstants";
import {ActionType} from "./Actions/RWAction";
import {IMsgEvent} from "fchatlib/dist/src/Interfaces/IMsgEvent";
import {RWFight} from "./Fight/RWFight";
import {Messages} from "../Common/Constants/Messages";
import {Tiers} from "./Constants/Tiers";

export class CommandHandler extends BaseCommandHandler {

    private wait(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async autoplay(args:string, data:IMsgEvent) {
        if (this.fChatLibInstance.isUserMaster(data.character)) {
            this.blnAutofight = !this.blnAutofight;
            if(this.blnAutofight == false){
                return;
            }

            let availableCommands = Utils.getEnumList(ActionType);
            let availableTiers = Utils.getEnumList(Tiers);
            availableTiers.shift();

            let firstCharData:IMsgEvent = {character: "MyFirstFighterThatDoesntExist", channel: data.channel, message: "!ready"};
            let secondCharData:IMsgEvent = {character: "MySecondFighterThatDoesntExist", channel: data.channel, message: "!ready"};



            while(this.blnAutofight == true){
                if (this.fight == undefined || this.fight.hasEnded) {
                    this.fight = new RWFight();
                    this.fight.build(this.fChatLibInstance, this.channel);
                }
                if(!this.fight.hasStarted){
                    await this.ready("", firstCharData);
                    await this.wait(1000);
                    await this.ready("", secondCharData);
                    await this.wait(1000);
                }

                await this.wait(1000);

                if(this.fight.currentPlayer.name == firstCharData.character){
                    let randomCommand = availableCommands[Utils.getRandomInt(0, availableCommands.length)].toLowerCase();
                    let randomTier = availableTiers[Utils.getRandomInt(0, availableTiers.length)].toLowerCase();
                    await this[randomCommand].apply(this, [randomTier, firstCharData]);
                }
                else if(this.fight.currentPlayer.name == secondCharData.character)
                {
                    let randomCommandTina = availableCommands[Utils.getRandomInt(0, availableCommands.length)].toLowerCase();
                    let randomTierTina = availableTiers[Utils.getRandomInt(0, availableTiers.length)].toLowerCase();
                    await this[randomCommandTina].apply(this, [randomTierTina, secondCharData]);
                }

                if(!this.blnAutofight){
                    break;
                }
            }
        }
    }

    async bondage(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Bondage, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async brawl(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Brawl, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async degradation(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Degradation, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async escape(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Escape, false, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async releasehold(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.ReleaseHold, false, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async forcedworship(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.ForcedWorship, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async highrisk(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.HighRisk, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async riskylewd(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.RiskyLewd, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async humhold(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.HumHold, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async itempickup(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.ItemPickup, false, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async rest(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Rest, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async tease(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Tease, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async sexhold(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SexHold, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async subhold(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SubHold, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async straptoy(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.StrapToy, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async sextoypickup(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SextoyPickup, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async stun(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Stun, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async tag(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Tag, false, true, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async submit(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Submit, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async finisher(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Finisher, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async masturbate(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Masturbate, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async selfdebase(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SelfDebase, true, false, Utils.stringToEnum(Tiers, args));
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };

    async pass(args:string, data:IMsgEvent) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Pass, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Messages.commandErrorWithStack, [ex.message, ex.stack]), data.character);
        }
    };
}