import * as RWGameSettingsJson from "./Configuration/RWGameSettings.json"
import {RWFighter} from "./Fight/RWFighter";
import {RWFight} from "./Fight/RWFight";
import {IFChatLib} from "fchatlib/dist/src/Interfaces/IFChatLib";
import {CommandHandler} from "./CommandHandler";
import {RWGameSettings} from "./Configuration/RWGameSettings";

export class RendezVousWrestling extends CommandHandler{
    constructor(fChatLib:IFChatLib, channel:string) {
        super(RWFight, RWFighter, fChatLib, channel);
        RWGameSettings.loadConfigFile(RWGameSettingsJson);
    }
}