import * as fs from "fs";
import {Utils} from "../Utils/Utils";
import {Teams} from "../Constants/Teams";

export class GameSettings {
    public static botName:string = "Miss_Spencer";
    public static pluginName:string = "nsfw";
    public static currencyName:string = "tokens";
    public static currentSeason:number = 1;

    public static numberOfAvailableTeams:number = (Utils.getEnumList(Teams).length - 2);
    public static diceSides:number = 10;
    public static diceCount:number = 2;

    public static featuresEnabled:boolean = true;
    public static featuresList:any;
    public static featuresMinMatchesDurationCount:number = 1;
    public static featuresMaxMatchesDurationCount:number = 10;

    public static modifiersEnabled:boolean = true;
    public static modifiersList:any;

    public static tippingEnabled:boolean = true;
    public static tippingMinimum:number = 0;

    public static numberOfDifferentStats:number = 6;
    public static numberOfRequiredStatPoints:number = 230;
    public static minStatLimit:number = 10;
    public static maxStatLimit:number = 100;
    public static restatCostInTokens:number = 5;
    public static tierRequiredToBreakHold = -1;

    static loadConfigFile(configJson:any){
        this.pluginName = configJson.pluginName;
        this.botName = configJson.botName;
        this.currencyName = configJson.currencyName;
        this.currentSeason = configJson.currentSeason;
        this.diceSides = configJson.diceSides;
        this.diceCount = configJson.diceCount;

        this.modifiersEnabled = configJson.modifiersEnabled;

        this.featuresEnabled = configJson.featuresEnabled;

        this.featuresMinMatchesDurationCount = configJson.featuresMinMatchesDurationCount;
        this.featuresMaxMatchesDurationCount = configJson.featuresMaxMatchesDurationCount;

        this.tippingEnabled = configJson.tippingEnabled;
        this.tippingMinimum = configJson.tippingMinimum;

        this.numberOfDifferentStats = configJson.numberOfDifferentStats;
        this.numberOfRequiredStatPoints = configJson.numberOfRequiredStatPoints;
        this.minStatLimit = configJson.minStatLimit;
        this.maxStatLimit = configJson.maxStatLimit;
        this.restatCostInTokens = configJson.restatCostInTokens;

        this.tierRequiredToBreakHold = configJson.tierRequiredToBreakHold;
    }

    static getJsonOutput():string{
        let configJson:any = {};

        configJson.pluginName = this.pluginName;
        configJson.botName = this.botName;
        configJson.currencyName = this.currencyName;
        configJson.currentSeason = this.currentSeason;
        configJson.diceSides = this.diceSides;
        configJson.diceCount = this.diceCount;

        configJson.modifiersEnabled = this.modifiersEnabled;

        configJson.featuresEnabled = this.featuresEnabled;

        configJson.featuresMinMatchesDurationCount = this.featuresMinMatchesDurationCount;
        configJson.featuresMaxMatchesDurationCount = this.featuresMaxMatchesDurationCount;

        configJson.tippingEnabled = this.tippingEnabled;
        configJson.tippingMinimum = this.tippingMinimum;

        configJson.numberOfDifferentStats = this.numberOfDifferentStats;
        configJson.numberOfRequiredStatPoints = this.numberOfRequiredStatPoints;
        configJson.minStatLimit = this.minStatLimit;
        configJson.maxStatLimit = this.maxStatLimit;
        configJson.restatCostInTokens = this.restatCostInTokens;

        configJson.tierRequiredToBreakHold = this.tierRequiredToBreakHold;

        return configJson;
    }
}