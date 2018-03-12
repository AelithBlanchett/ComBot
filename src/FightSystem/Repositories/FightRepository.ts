import {RWFight} from "../Fight/RWFight";
import {Database} from "../../Common/Utils/Model";
import {ActionRepository} from "./ActionRepository";
import {Utils} from "../../Common/Utils/Utils";
import {ActiveFighterRepository} from "./ActiveFighterRepository";
import {FighterRepository} from "./FighterRepository";
import * as BaseConstants from "../../Common/BaseConstants";
import {ModifierRepository} from "./ModifierRepository";
import {RWAction} from "../Actions/RWAction";

export class FightRepository{

    public static async persist(fight:RWFight):Promise<void>{
        try
        {
            let currentSeason = await Database.get(BaseConstants.SQL.constantsTableName).where({key: BaseConstants.SQL.currentSeasonKeyName}).first();

            if(!await FightRepository.exists(fight.idFight)){
                fight.createdAt = new Date();
                await Database.get(BaseConstants.SQL.fightTableName).insert({
                    idFight: fight.idFight,
                    fightType: fight.fightType,
                    stage: fight.stage,
                    currentTurn: fight.currentTurn,
                    hasStarted: fight.hasStarted,
                    hasEnded: fight.hasEnded,
                    winnerTeam: fight.winnerTeam,
                    season: fight.season,
                    fightLength: fight.fightLength,
                    createdAt: fight.createdAt
                });
            }
            else{
                fight.updatedAt = new Date();
                await Database.get(BaseConstants.SQL.fightTableName).where({idFight: fight.idFight, season: currentSeason.value}).update({
                    fightType: fight.fightType,
                    stage: fight.stage,
                    currentTurn: fight.currentTurn,
                    hasStarted: fight.hasStarted,
                    hasEnded: fight.hasEnded,
                    winnerTeam: fight.winnerTeam,
                    fightLength: fight.fightLength,
                    updatedAt: fight.updatedAt
                });
            }

            for(let fighter of fight.fighters){
                await ActiveFighterRepository.persist(fighter);
                await FighterRepository.persist(fighter);
                for(let modifier of fighter.modifiers){
                    await ModifierRepository.persist(modifier);
                }
            }
        }
        catch(ex){
            throw ex;
        }
    }


    public static async exists(idFight:string, notFinished?:boolean):Promise<boolean>{
        let loadedData;
        if(notFinished){
            loadedData = await Database.get(BaseConstants.SQL.fightTableName).where({idFight: idFight, hasStarted: true, hasEnded: false}).and.whereNull('deletedAt').select();
        }
        else{
            loadedData = await Database.get(BaseConstants.SQL.fightTableName).where({idFight: idFight}).and.whereNull('deletedAt').select();
        }
        return (loadedData.length > 0);
    }

    // public static async loadLatestInvolvingFighter(idFighter:string):Promise<RWFight>{
    //     let loadedFight:RWFight = new RWFight();
    //
    //     if(!await FighterRepository.exists(idFighter)){
    //         return null;
    //     }
    //
    //     let latestIdFightInvolvingFighter = await Database.get(BaseConstants.SQL.activeFightersTableName).where({idFighter: idFighter, hasEnded: false, hasStarted: true}).and.whereNull('deletedAt').select();
    //
    //     if(latestIdFightInvolvingFighter != null && !await FightRepository.exists(latestIdFightInvolvingFighter.idFight, true)){
    //         return null;
    //     }
    //
    //     try
    //     {
    //         loadedFight = await FightRepository.load(latestIdFightInvolvingFighter);
    //     }
    //     catch(ex){
    //         throw ex;
    //     }
    //
    //     return loadedFight;
    // }

    public static async load(idFight:string, loadedFight:RWFight):Promise<RWFight>{

        if(!await FightRepository.exists(idFight, true)){
            return null;
        }

        try
        {
            let loadedData = await Database.get(BaseConstants.SQL.fightTableName).where({idFight: idFight, hasEnded: false, hasStarted: true}).and.whereNull('deletedAt').select();
            let data = loadedData[0];

            Utils.mergeFromTo(data, loadedFight);

            loadedFight.fighters = await ActiveFighterRepository.loadFromFight(idFight);
            loadedFight.pastActions = await FightRepository.loadActions(loadedFight);

            for(let fighter of loadedFight.fighters){
                fighter.fight = loadedFight;
            }
        }
        catch(ex){
            throw ex;
        }

        return loadedFight;
    }

    public static async loadActions(fight:RWFight):Promise<RWAction[]>{
        let loadedActions:RWAction[] = [];

        if(!await FightRepository.exists(fight.idFight)){
            return null;
        }

        try
        {
            loadedActions = await ActionRepository.loadFromFight(fight.idFight);
            fight.pastActions = loadedActions;
        }
        catch(ex){
            throw ex;
        }

        return loadedActions;
    }


    public static async delete(idFight:string):Promise<void>{
        await Database.get(BaseConstants.SQL.fightTableName).where({idFight: idFight}).update({
            deletedAt: new Date()
        });
    }

}