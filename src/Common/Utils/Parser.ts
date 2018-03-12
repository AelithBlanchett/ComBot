import {Utils} from "./Utils";
import * as BaseConstants from "../BaseConstants";
import {FightType} from "../BaseConstants";
import {FightLength} from "../BaseConstants";
import {Teams} from "../Constants/Teams";
import {GameSettings} from "../Configuration/GameSettings";

export class Parser{

    public static parseArgs(nberAwaitedArgs:number, awaitedTypes:any[], args:string):any[]{
        let returnedArgs = [];
        let error = false;

        if(nberAwaitedArgs == 1){
            if(typeof(args) != typeof(awaitedTypes[0])){
                error = true;
            }
            else{
                returnedArgs.push("");
            }
            return ;
        }
        else if(nberAwaitedArgs > 1){
            let splits = args.split(" ");
            let finalArgs:string[] = [];
            for(let i = 0; i < nberAwaitedArgs; i++){
                finalArgs.push(splits[0]);
                splits.shift();
            }

            let otherArgs = splits.join(" ");
            finalArgs.push(otherArgs);
            return finalArgs;
        }

        if(error){
            let concatenatedTypes = "";
            for(let i = 0; i < nberAwaitedArgs; i++){
                concatenatedTypes += " " + typeof(awaitedTypes[i]).toString().toUpperCase();
            }
            throw new Error(`The command you executed received the wrong number of parameters, and/or the wrong type of parameters. Correct syntax is: '!command${concatenatedTypes}'`)
        }
    }

    public static join(args){
        let teams = Utils.getEnumList(Teams);
        for(let teamId in teams){
            teams[teamId] = teams[teamId].toLowerCase();
        }
        let indexOfTeam = teams.indexOf(args.toLowerCase());
        if(indexOfTeam != -1){
            return Teams[Teams[indexOfTeam]];
        }
        return -1;
    }

    private static isInt(value) {
        return !isNaN(value) && (function (x) {
                return (x | 0) === x;
            })(parseFloat(value))
    }

    public static checkIfValidStats(strParameters:string, numberOfRequiredStatPoints:number, numberOfDifferentStats:number, minStatLimit:number, maxStatLimit:number):string {
        let arrParam:Array<number> = [];

        for(let nbr of strParameters.split(`,`)){
            arrParam.push(parseInt(nbr));
        }

        let exampleStats = ``;
        let intStatsToAssign:number = Math.floor(numberOfRequiredStatPoints / numberOfDifferentStats);
        let statOverflow:number = numberOfRequiredStatPoints - (intStatsToAssign * numberOfDifferentStats);

        for(let i = 0; i < numberOfDifferentStats - 1; i++){
            exampleStats += intStatsToAssign.toString() + `,`;
        }
        exampleStats += (intStatsToAssign + statOverflow).toString();

        if (arrParam.length != numberOfDifferentStats) {
           return `The number of parameters was incorrect. Example: !register ${exampleStats}`;
        }
        else if (!arrParam.every(arg => Parser.isInt(arg))) {
            return `All the parameters aren't integers. Example: !register ${exampleStats}`;
        }
        else {
            //register
            let total: number;
            total = arrParam.reduce(function (a, b) {
                return a + b;
            }, 0);

            if (total != numberOfRequiredStatPoints) {
                return `The total of stat points you've spent isn't equal to ${numberOfRequiredStatPoints}. (${total}). Example: !register ${exampleStats} (or !restat ${exampleStats} if you're already registered)`;
            }

            for(let i = 0; i < numberOfDifferentStats; i++){
                if (arrParam[i] > maxStatLimit || (arrParam[i] < minStatLimit)){
                    return `Each stat must be higher than ${minStatLimit} and lower than ${maxStatLimit}. Example: !register ${exampleStats} (or !restat ${exampleStats} if you're already registered)`;
                }
            }

            //If it passed all the checks before, all's good
            return ``;
        }
    }

    public static tipPlayer(args){
        let result = {player: null, amount: -1, message: null};
        let splittedArgs = args.split(` `);
        let amount = 0;

        if(splittedArgs.length > 1){
            if(isNaN(splittedArgs[0]) || splittedArgs[0] <= GameSettings.tippingMinimum){
                result.message = `The specified amount is invalid. It must be a number > ${GameSettings.tippingMinimum}.`;
                return result;
            }
            else{
                result.amount = Number(splittedArgs[0]);
            }

            splittedArgs.shift();
            result.player = splittedArgs.join(` `);
        }
        else{
            result.message = `The parameter count is invalid.`;
            return result;
        }

        return result;
    }

    public static setFightType(args):FightType{
        let fightTypes = Utils.getEnumList(FightType);
        for(let fightTypeId in fightTypes){
            fightTypes[fightTypeId] = fightTypes[fightTypeId].toLowerCase();
        }
        let indexOfFightType = fightTypes.indexOf(args.toLowerCase());
        if(indexOfFightType != -1){
            return FightType[FightType[indexOfFightType]];
        }
        return -1;
    }

    public static setFightLength(args):FightLength{
        let fightDurations = Utils.getEnumList(FightLength);
        for(let fightTypeId in fightDurations){
            fightDurations[fightTypeId] = fightDurations[fightTypeId].toLowerCase();
        }
        let indexOfFightDuration = fightDurations.indexOf(args.toLowerCase());
        if(indexOfFightDuration != -1){
            return FightLength[FightLength[indexOfFightDuration]];
        }
        return -1;
    }

    public static setTeamsCount(args):number{
        if(isNaN(args)){
            return -1;
        }
        else{
            if(args > GameSettings.numberOfAvailableTeams){
                return -1;
            }
        }
        return Number(args);
    }
}