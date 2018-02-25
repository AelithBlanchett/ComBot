import {CommandHandler} from "./CommandHandler";
import {IFChatLib} from "fchatlib/dist/src/Interfaces/IFChatLib";
import * as BaseConstants from "../Common/BaseConstants";
import {Model} from "../Common/Utils/Model";
import {GameSettings} from "../Common/Configuration/GameSettings";
import * as RWGameSettings from "./Configuration/RWGameSettings.json"

export class RendezVousWrestling extends CommandHandler{

    constructor(fChatLib:IFChatLib, channel:string) {
        super(fChatLib, channel);
        this.initialize();
        this.initializeGameSettings();
    }

    private initialize(){

    }

    private initializeGameSettings():void{
        GameSettings.loadConfigFile(RWGameSettings);
    }
}