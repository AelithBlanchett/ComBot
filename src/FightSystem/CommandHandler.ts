import {BaseCommandHandler} from "../Common/BaseCommandHandler";
import {Utils} from "../Common/Utils";
import * as Constants from "../Common/BaseConstants";
import {ActionType} from "./RWAction";

export class CommandHandler extends BaseCommandHandler {

    async bondage(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Bondage, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async brawl(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Brawl, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async degradation(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Degradation, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async escape(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Escape, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async releasehold(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.ReleaseHold, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async forcedworship(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.ForcedWorship, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async highrisk(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.HighRisk, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async riskylewd(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.RiskyLewd, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async humhold(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.HumHold, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async itempickup(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.ItemPickup, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async rest(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Rest, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async tease(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Tease, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async sexhold(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SexHold, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async subhold(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SubHold, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async straptoy(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.StrapToy, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async sextoypickup(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SextoyPickup, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async stun(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Stun, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async tag(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Tag, false, true, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async submit(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Submit, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async finisher(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Finisher, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async masturbate(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Masturbate, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async selfdebase(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.SelfDebase, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    async pass(args:string, data:FChatResponse) {
        try {
            await this.fight.prepareAction(data.character, ActionType.Pass, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };
}