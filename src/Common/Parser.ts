import {Utils} from "./Utils";
import * as Constants from "../FightSystem/Constants";
import Team = Constants.Team;
import Stats = Constants.Stats;
import {FightType} from "../FightSystem/Constants";
import {FeatureType} from "../FightSystem/Constants";
import {FightLength} from "../FightSystem/Constants";

export class Commands{

    public static join(args){
        let teams = Utils.getEnumList(Team);
        for(let teamId in teams){
            teams[teamId] = teams[teamId].toLowerCase();
        }
        let indexOfTeam = teams.indexOf(args.toLowerCase());
        if(indexOfTeam != -1){
            return Team[Team[indexOfTeam]];
        }
        return -1;
    }

    public static addStat(args){
        let stats = Utils.getEnumList(Stats);
        for(let statId in stats){
            stats[statId] = stats[statId].toLowerCase();
        }
        let indexOfStat = stats.indexOf(args.toLowerCase());
        if(indexOfStat != -1){
            return Stats[Stats[indexOfStat]];
        }
        return -1;
    }

    private static isInt(value) {
        return !isNaN(value) && (function (x) {
                return (x | 0) === x;
            })(parseFloat(value))
    }

    public static checkIfValidStats(strParameters:string):string {
        let arrParam:Array<number> = [];

        for(let nbr of strParameters.split(`,`)){
            arrParam.push(parseInt(nbr));
        }

        let exampleStats = ``;
        let intStatsToAssign:number = Math.floor(Constants.Globals.numberOfRequiredStatPoints / Constants.Globals.numberOfDifferentStats);
        let statOverflow:number = Constants.Globals.numberOfRequiredStatPoints - (intStatsToAssign * Constants.Globals.numberOfDifferentStats);

        for(let i = 0; i < Constants.Globals.numberOfDifferentStats - 1; i++){
            exampleStats += intStatsToAssign.toString() + `,`;
        }
        exampleStats += (intStatsToAssign + statOverflow).toString();

        if (arrParam.length != Constants.Globals.numberOfDifferentStats) {
           return `The number of parameters was incorrect. Example: !register ${exampleStats}`;
        }
        else if (!arrParam.every(arg => Commands.isInt(arg))) {
            return `All the parameters aren't integers. Example: !register ${exampleStats}`;
        }
        else {
            //register
            let total: number;
            total = arrParam.reduce(function (a, b) {
                return a + b;
            }, 0);

            if (total != Constants.Globals.numberOfRequiredStatPoints) {
                return `The total of stat points you've spent isn't equal to ${Constants.Globals.numberOfRequiredStatPoints}. (${total}). Example: !register ${exampleStats} (or !restat ${exampleStats} if you're already registered)`;
            }

            for(let i = 0; i < Constants.Globals.numberOfDifferentStats; i++){
                if (arrParam[i] > Constants.Globals.maxStatLimit || (arrParam[i] < Constants.Globals.minStatLimit)){
                    return `The ${Constants.Stats[i]} stat must be higher than ${Constants.Globals.minStatLimit} and lower than ${Constants.Globals.maxStatLimit}. Example: !register ${exampleStats} (or !restat ${exampleStats} if you're already registered)`;
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
            if(isNaN(splittedArgs[0]) || splittedArgs[0] <= Constants.Globals.tippingMinimum){
                result.message = `The specified amount is invalid. It must be a number > ${Constants.Globals.tippingMinimum}.`;
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

    public static getFeatureType(args, onlyType:boolean = false){
        let result = {featureType: null, turns: -1, message: null};
        let splittedArgs = args.split(` `);
        let typeToSearch = splittedArgs[0];

        if(splittedArgs.length > 1 && !onlyType){
            if(isNaN(splittedArgs[1]) || splittedArgs[1] <= Constants.Globals.featuresMinMatchesDurationCount || splittedArgs[1] > Constants.Globals.featuresMaxMatchesDurationCount){
                result.message = `The number of fights specified is invalid. It must be a number > ${Constants.Globals.featuresMinMatchesDurationCount} and <= ${Constants.Globals.featuresMaxMatchesDurationCount}`;
                return result;
            }
            else{
                result.turns = splittedArgs[1];
            }
        }
        else{
            result.turns = 0;
        }

        let featTypes = Utils.getEnumList(FeatureType);
        for(let featTypeId in featTypes){
            featTypes[featTypeId] = featTypes[featTypeId].toLowerCase();
        }
        let indexOfFeatType = featTypes.indexOf(typeToSearch.toLowerCase());
        if(indexOfFeatType != -1){
            result.featureType =  FeatureType[FeatureType[indexOfFeatType]];
        }
        else{
            result.message = `This feature doesn't exist.`;
        }

        if(result.featureType == FeatureType[FeatureType.SexyKickStart] || result.featureType == FeatureType[FeatureType.KickStart]){
            result.message = `You did not specify a number of fights, and features requiring payment cannot be permanent.`;
        }

        return result;
    }

    public static setFightType(args){
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

    public static setFightLength(args){
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

    public static setTeamsCount(args){
        if(isNaN(args)){
            return -1;
        }
        else{
            if(args > Constants.Globals.numberOfAvailableTeams){
                return -1;
            }
        }
        return Number(args);
    }
}