import {Model} from "../../Common/Model";
import {RWFighter} from "../RWFighter";
import {Utils} from "../../Common/Utils";
import {IAchievement} from "../../Achievements/IAchievement";
import {AchievementManager} from "../../Achievements/AchievementManager";
import {TransactionType} from "../../Common/Constants";
import * as Constants from "../../Common/Constants";
import {BaseFeature} from "../../Common/BaseFeature";
import {FeatureFactory} from "../../Common/FeatureFactory";
import {IRWFighter} from "../IRWFighter";
import {ActiveFighter} from "../ActiveFighter";

export class FighterRepository{

    public static async persist(fighter:IRWFighter):Promise<void>{
        try
        {
            let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();

            if(!await FighterRepository.exists(fighter.name)){
                fighter.createdAt = new Date();
                await Model.db(Constants.SQL.fightersTableName).insert({
                    name: fighter.name,
                    season: currentSeason.value,
                    power: fighter.power,
                    sensuality: fighter.sensuality,
                    dexterity: fighter.dexterity,
                    toughness: fighter.toughness,
                    endurance: fighter.endurance,
                    willpower: fighter.willpower,
                    areStatsPrivate: fighter.areStatsPrivate,
                    tokens: Number(fighter.tokens).toFixed(2),
                    tokensSpent: Number(fighter.tokensSpent).toFixed(2),
                    eloRating: fighter.eloRating,
                    createdAt: fighter.createdAt
                });
            }
            else{
                fighter.updatedAt = new Date();
                await Model.db(Constants.SQL.fightersTableName).where({name: fighter.name, season: currentSeason.value}).update({
                    power: fighter.power,
                    sensuality: fighter.sensuality,
                    dexterity: fighter.dexterity,
                    toughness: fighter.toughness,
                    endurance: fighter.endurance,
                    willpower: fighter.willpower,
                    areStatsPrivate: fighter.areStatsPrivate,
                    tokens: Number(fighter.tokens).toFixed(2),
                    tokensSpent: Number(fighter.tokensSpent).toFixed(2),
                    eloRating: fighter.eloRating,
                    updatedAt: fighter.updatedAt
                });

                await FighterRepository.persistFeatures(fighter);
                await FighterRepository.persistAchievements(fighter);
            }
        }
        catch(ex){
            throw ex;
        }
    }

    public static async persistFeatures(fighter:IRWFighter):Promise<void>{

        let featuresIdToKeep = [];
        let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();

        for(let feature of fighter.features){
            if(!feature.isExpired() && feature.deletedAt == null){
                featuresIdToKeep.push(feature.id);
            }

            let loadedData = await Model.db(Constants.SQL.fightersFeaturesTableName).where({idFighter: fighter.name, idFeature: feature.id}).select();
            if(loadedData.length == 0){
                feature.createdAt = new Date();
                await Model.db(Constants.SQL.fightersFeaturesTableName).insert({
                    idFeature: feature.id,
                    idFighter: fighter.name,
                    season: currentSeason.value,
                    type: feature.type,
                    uses: feature.uses,
                    permanent: feature.permanent,
                    createdAt: feature.createdAt
                });
            }
            else{
                feature.updatedAt = new Date();
                await Model.db(Constants.SQL.fightersFeaturesTableName).where({idFighter: fighter.name, idFeature: feature.id}).update({
                    season: currentSeason.value,
                    type: feature.type,
                    uses: feature.uses,
                    permanent: feature.permanent,
                    updatedAt: feature.updatedAt
                });
            }

        }

        await Model.db(Constants.SQL.fightersFeaturesTableName).where('idFighter', fighter.name).whereNull('deletedAt').whereNotIn('idFeature', featuresIdToKeep).update({
            deletedAt: new Date()
        });

        let featuresToRemove = fighter.features.filter(x => featuresIdToKeep.indexOf(x.id) == -1);
        for(let feature of featuresToRemove){
            let index = fighter.features.findIndex(x => x.id == feature.id);
            if(index != -1){
                fighter.features.splice(index, 1);
            }
        }
    }

    public static async persistAchievements(fighter:IRWFighter):Promise<void>{

        for(let achievement of fighter.achievements){
            let loadedData = await Model.db(Constants.SQL.fightersAchievementsTableName).where({idFighter: fighter.name, idAchievement: achievement.getType()}).select();

            if(loadedData.length == 0){
                achievement.createdAt = new Date();
                await Model.db(Constants.SQL.fightersAchievementsTableName).insert({
                    idAchievement: achievement.getType(),
                    idFighter: fighter.name,
                    createdAt: achievement.createdAt
                });
            }
        }

    }

    public static async logTransaction(idFighter:string, amount:number, transactionType:TransactionType, fromFighter:string = ""):Promise<void>{
        if(await FighterRepository.exists(idFighter)){
            if(fromFighter != "" && !await FighterRepository.exists(fromFighter)){
                throw new Error("The fighter who gave this money wasn't found in the database.")
            }
            let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();
            await Model.db(Constants.SQL.fightersTransactionsTableName).insert({
                idFighter: idFighter,
                idGiver: fromFighter,
                season: currentSeason.value,
                transactionType: transactionType,
                amount: amount,
                date: new Date()
            });
        }
    }

    public static async exists(name:string):Promise<boolean>{
        let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();
        let loadedData = await Model.db(Constants.SQL.fightersViewName).where({name: name, season: currentSeason.value}).and.whereNull('deletedAt').select();
        return (loadedData.length > 0);
    }

    public static async load(name:string):Promise<IRWFighter>{
        let loadedFighter:RWFighter = new RWFighter();

        if(!await FighterRepository.exists(name)){
            return null;
        }

        try
        {
            let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();

            let loadedData = await Model.db(Constants.SQL.fightersViewName).where({name: name, season: currentSeason.value}).and.whereNull('deletedAt').select();
            let data = loadedData[0];

            Utils.mergeFromTo(data, loadedFighter);

            loadedFighter.achievements = await FighterRepository.loadAllAchievements(name);
            loadedFighter.features = await FighterRepository.loadAllFeatures(name, currentSeason.value);
        }
        catch(ex){
            throw ex;
        }

        return loadedFighter;
    }

    public static async loadActiveFighter(name:string):Promise<ActiveFighter>{
        let baseFighter = await FighterRepository.load(name);
        let activeFighter = new ActiveFighter();
        Utils.mergeFromTo(baseFighter, activeFighter);
        return activeFighter;
    }

    static async loadAllAchievements(fighterName:string):Promise<IAchievement[]>{
        let result;

        try{
            result = await Model.db(Constants.SQL.fightersAchievementsTableName).select('idAchievement', 'createdAt').where({idFighter: fighterName});
        }
        catch(ex){
            throw ex;
        }

        let achievementsArray:IAchievement[] = [];
        for(let row of result){
            let achievement = AchievementManager.get(row.idAchievement);
            if(achievement){
                achievement.createdAt = row.createdAt;
                achievementsArray.push(achievement);
            }
        }
        return achievementsArray;
    }

    static async loadAllFeatures(fighterName:string, season:number):Promise<BaseFeature[]>{
        let result;

        try{
            result = await Model.db(Constants.SQL.fightersFeaturesTableName).where({idFighter: fighterName, season: season}).and.whereNull('deletedAt').select();
        }
        catch(ex){
            throw ex;
        }

        let featuresArray:BaseFeature[] = [];
        for(let row of result){
            featuresArray.push(FeatureFactory.getFeature(row.type, row.uses, row.idFeature));
        }
        return featuresArray;
    }

    public static async GiveTokensToPlayersRegisteredBeforeNow(amount:number):Promise<void>{
        let currentDate = new Date();
        let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();
        await Model.db(Constants.SQL.fightersTableName).where({season: currentSeason.value}).and.whereNull('deletedAt').andWhere('createdAt', '<', currentDate).increment('tokens', amount);
    }

    public static async remove(name:string):Promise<void>{
        let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();
        await Model.db(Constants.SQL.fightersTableName).where({name: name, season: currentSeason.value}).and.whereNull('deletedAt').update({
            deletedAt: new Date()
        });
    }

}