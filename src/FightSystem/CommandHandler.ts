import {BaseCommandHandler} from "../Common/BaseCommandHandler";
import {Utils} from "../Common/Utils";
import * as Constants from "../Common/Constants";
import {ActionType} from "./RWAction";

export class CommandHandler extends BaseCommandHandler {

    bondage(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Bondage, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    brawl(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Brawl, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    degradation(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Degradation, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    escape(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Escape, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    releasehold(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.ReleaseHold, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    forcedworship(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.ForcedWorship, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    highrisk(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.HighRisk, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    riskylewd(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.RiskyLewd, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    humhold(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.HumHold, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    itempickup(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.ItemPickup, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    rest(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Rest, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    tease(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Tease, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    sexhold(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.SexHold, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    subhold(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.SubHold, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    straptoy(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.StrapToy, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    sextoypickup(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.SextoyPickup, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    stun(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Stun, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    tag(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Tag, false, true, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    submit(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Submit, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    finisher(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Finisher, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    masturbate(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Masturbate, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    selfdebase(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.SelfDebase, true, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };

    pass(args:string, data:FChatResponse) {
        try {
            this.fight.prepareAction(data.character, ActionType.Pass, false, false, args);
        }
        catch (ex) {
            this.fChatLibInstance.sendPrivMessage(Utils.strFormat(Constants.Messages.commandError, ex.message), data.character);
        }
    };
}