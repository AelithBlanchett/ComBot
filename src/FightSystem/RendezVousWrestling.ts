import {CommandHandler} from "./CommandHandler";
import {IFChatLib} from "fchatlib/dist/src/Interfaces/IFChatLib";
import {GameSettings} from "../Common/Configuration/GameSettings";
import * as RWGameSettings from "./Configuration/RWGameSettings.json"
import {RWFighter} from "./Fight/RWFighter";
import {RWFight} from "./Fight/RWFight";

export class RendezVousWrestling extends CommandHandler{

    constructor(fChatLib:IFChatLib, channel:string) {
        super(RWFight, RWFighter, fChatLib, channel);
        this.initialize();
        this.initializeGameSettings();
    }

    private initialize(){

    }

    private initializeGameSettings():void{
        GameSettings.loadConfigFile(RWGameSettings);
    }
}