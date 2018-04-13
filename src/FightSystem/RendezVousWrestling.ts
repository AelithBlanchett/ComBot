import * as RWGameSettingsJson from "./Configuration/RWGameSettings.json"
import {RWFighterState} from "./Fight/RWFighterState";
import {RWFight} from "./Fight/RWFight";
import {IFChatLib} from "fchatlib/dist/src/Interfaces/IFChatLib";
import {CommandHandler} from "./CommandHandler";
import {RWGameSettings} from "./Configuration/RWGameSettings";
import {RWUser} from "./Fight/RWUser";

export class RendezVousWrestling extends CommandHandler{
    constructor(fChatLib:IFChatLib, channel:string) {
        super(RWFight, RWUser, RWFighterState, fChatLib, channel);
        RWGameSettings.loadConfigFile(RWGameSettingsJson);
    }
}