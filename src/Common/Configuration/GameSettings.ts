import * as fs from "fs";
import {Utils} from "../Utils/Utils";
import {Team} from "../Constants/Team";


export class GameSettings {
    public static botName:string = "Miss_Spencer";
    public static pluginName:string = "nsfw";
    public static currencyName:string = "tokens";
    public static currentSeason:number = 1;

    public static numberOfAvailableTeams:number = (Utils.getEnumList(Team).length - 2);
    public static diceSides:number = 10;
    public static diceCount:number = 2;

    public static featuresEnabled:boolean = true;
    public static featuresMinMatchesDurationCount:number = 1;
    public static featuresMaxMatchesDurationCount:number = 10;

    public static modifiersEnabled:boolean = true;

    public static tokensPerLossMultiplier: number = 0.5; //needs to be < 1 of course
    public static tokensForWinnerByForfeitMultiplier: number = 0.5; //needs to be < 1 of course
    public static tokensCostToFight:number = 10;
    public static tippingEnabled:boolean = true;
    public static tippingMinimum:number = 0;

    public static numberOfDifferentStats:number = 6;
    public static numberOfRequiredStatPoints:number = 230;
    public static minStatLimit:number = 10;
    public static maxStatLimit:number = 100;
    public static restatCostInTokens:number = 5;
    public static tierRequiredToBreakHold = -1;

    public static turnsToWaitBetweenTwoTags: number = 4;
    public static requiredScoreTag: number = 8;
    public static requiredScoreRest: number = 4;
    public static maximumDistanceToBeConsideredInRange: number = 10;

    static loadConfigFile(configJson:any){
        for(let prop of Object.getOwnPropertyNames(configJson)){
            this[prop] = configJson[prop];
        }
    }

    static getJsonOutput():string{
        let configJson:any = {};

        for(let prop of Object.getOwnPropertyNames(this)){
            configJson[prop] = this[prop];
        }

        return configJson;
    }
}