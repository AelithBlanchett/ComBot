import {Database} from "../../Common/Utils/Model";
import {Utils} from "../../Common/Utils/Utils";
import {IAchievement} from "../../Common/Achievements/IAchievement";
import {AchievementManager} from "../../Common/Achievements/AchievementManager";
import * as BaseConstants from "../../Common/Constants/BaseConstants";
import {BaseFeature} from "../../Common/Features/BaseFeature";
import {IRWFighter} from "../Fight/IRWFighter";
import {FeatureFactory} from "../Features/FeatureFactory";
import {TransactionType} from "../../Common/Constants/TransactionType";

export class FighterRepository{

    public static async persist(fighter:IRWFighter):Promise<void>{
        try
        {
            let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();

            if(!await FighterRepository.exists(fighter.name)){
                fighter.createdAt = new Date();
                await Database.get(BaseConstants.SQL.fightersTableName).insert({
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
                await Database.get(BaseConstants.SQL.fightersTableName).where({name: fighter.name, season: currentSeason.value}).update({
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
        let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();

        for(let feature of fighter.features){
            if(!feature.isExpired() && feature.deletedAt == null){
                featuresIdToKeep.push(feature.id);
            }

            let loadedData = await Database.get(BaseConstants.SQL.fightersFeaturesTableName).where({idFighter: fighter.name, idFeature: feature.id}).select();
            if(loadedData.length == 0){
                feature.createdAt = new Date();
                await Database.get(BaseConstants.SQL.fightersFeaturesTableName).insert({
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
                await Database.get(BaseConstants.SQL.fightersFeaturesTableName).where({idFighter: fighter.name, idFeature: feature.id}).update({
                    season: currentSeason.value,
                    type: feature.type,
                    uses: feature.uses,
                    permanent: feature.permanent,
                    updatedAt: feature.updatedAt
                });
            }

        }

        await Database.get(BaseConstants.SQL.fightersFeaturesTableName).where('idFighter', fighter.name).whereNull('deletedAt').whereNotIn('idFeature', featuresIdToKeep).update({
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
            let loadedData = await Database.get(BaseConstants.SQL.fightersAchievementsTableName).where({idFighter: fighter.name, idAchievement: achievement.getName()}).select();

            if(loadedData.length == 0){
                achievement.createdAt = new Date();
                await Database.get(BaseConstants.SQL.fightersAchievementsTableName).insert({
                    idAchievement: achievement.getName(),
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
            let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();
            await Database.get(BaseConstants.SQL.fightersTransactionsTableName).insert({
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
        let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();
        let loadedData = await Database.get(BaseConstants.SQL.fightersViewName).where({name: name, season: currentSeason.value}).and.whereNull('deletedAt').select();
        return (loadedData.length > 0);
    }

    public static async load(name:string, loadedFighter:IRWFighter):Promise<IRWFighter>{
        if(!await FighterRepository.exists(name)){
            return null;
        }

        try
        {
            let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();

            let loadedData = await Database.get(BaseConstants.SQL.fightersViewName).where({name: name, season: currentSeason.value}).and.whereNull('deletedAt').select();
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

    // public static async loadActiveFighter(name:string):Promise<ActiveFighter>{
    //     let baseFighter = await FighterRepository.load(name);
    //     let activeFighter = new ActiveFighter(new FeatureFactory());
    //     Utils.mergeFromTo(baseFighter, activeFighter);
    //     return activeFighter;
    // }

    static async loadAllAchievements(fighterName:string):Promise<IAchievement[]>{
        let result;

        try{
            result = await Database.get(BaseConstants.SQL.fightersAchievementsTableName).select('idAchievement', 'createdAt').where({idFighter: fighterName});
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
            result = await Database.get(BaseConstants.SQL.fightersFeaturesTableName).where({idFighter: fighterName, season: season}).and.whereNull('deletedAt').select();
        }
        catch(ex){
            throw ex;
        }

        let featuresArray:BaseFeature[] = [];
        for(let row of result){
            featuresArray.push(new FeatureFactory().getFeature(row.type, row.uses, row.idFeature));
        }
        return featuresArray;
    }

    public static async GiveTokensToPlayersRegisteredBeforeNow(amount:number):Promise<void>{
        let currentDate = new Date();
        let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();
        await Database.get(BaseConstants.SQL.fightersTableName).where({season: currentSeason.value}).and.whereNull('deletedAt').andWhere('createdAt', '<', currentDate).increment('tokens', amount);
    }

    public static async remove(name:string):Promise<void>{
        let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();
        await Database.get(BaseConstants.SQL.fightersTableName).where({name: name, season: currentSeason.value}).and.whereNull('deletedAt').update({
            deletedAt: new Date()
        });
    }

}