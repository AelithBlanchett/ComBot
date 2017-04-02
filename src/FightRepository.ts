
import {Fight} from "./Fight";
import {Model} from "./Model";
import {Action} from "./Action";
import {ActionRepository} from "./ActionRepository";
import {Utils} from "./Utils";
import {ActiveFighterRepository} from "./ActiveFighterRepository";
import {FighterRepository} from "./FighterRepository";

export class FightRepository{

    public static async persist(fight:Fight):Promise<void>{
        try
        {
            let currentSeason = await Model.db('nsfw_constants').where({key: "currentSeason"}).first();

            if(!await FightRepository.exists(fight.idFight)){
                fight.createdAt = new Date();
                await Model.db('nsfw_fights').insert({
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
                await Model.db('nsfw_fights').where({idFight: fight.idFight, season: currentSeason.value}).update({
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
            }
        }
        catch(ex){
            throw ex;
        }
    }


    public static async exists(idFight:string, notFinished?:boolean):Promise<boolean>{
        let loadedData;
        if(notFinished){
            loadedData = await Model.db('nsfw_fights').where({idFight: idFight, hasStarted: true, hasEnded: false}).and.whereNull('deletedAt').select();
        }
        else{
            loadedData = await Model.db('nsfw_fights').where({idFight: idFight}).and.whereNull('deletedAt').select();
        }
        return (loadedData.length > 0);
    }

    public static async loadLatestInvolvingFighter(idFighter:string):Promise<Fight>{
        let loadedFight:Fight = new Fight();

        if(!await FighterRepository.exists(idFighter)){
            return null;
        }

        let latestIdFightInvolvingFighter = await Model.db('nsfw_activefighters').where({idFighter: idFighter, hasEnded: false, hasStarted: true}).and.whereNull('deletedAt').select();

        if(latestIdFightInvolvingFighter != null && !await FightRepository.exists(latestIdFightInvolvingFighter.idFight, true)){
            return null;
        }

        try
        {
            loadedFight = await FightRepository.load(latestIdFightInvolvingFighter);
        }
        catch(ex){
            throw ex;
        }

        return loadedFight;
    }

    public static async load(idFight:string):Promise<Fight>{
        let loadedFight:Fight = new Fight();

        if(!await FightRepository.exists(idFight, true)){
            return null;
        }

        try
        {
            let loadedData = await Model.db('nsfw_fights').where({idFight: idFight, hasEnded: false, hasStarted: true}).and.whereNull('deletedAt').select();
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

    public static async loadActions(fight:Fight):Promise<Action[]>{
        let loadedActions:Action[] = [];

        if(!await FightRepository.exists(fight.idFight)){
            return null;
        }

        try
        {
            loadedActions = await ActionRepository.loadFromFight(fight.idFight);

            for(let action of loadedActions){
                let attackingFighterIndex = fight.fighters.findIndex(x => x.name == action.idAttacker);
                let defendingFighterIndex = fight.fighters.findIndex(x => x.name == action.idDefender);

                if(attackingFighterIndex != -1){
                    fight.fighters[attackingFighterIndex].actionsDone.push(action);
                }

                if(defendingFighterIndex != -1){
                    fight.fighters[defendingFighterIndex].actionsInflicted.push(action);
                }
            }

        }
        catch(ex){
            throw ex;
        }

        return loadedActions;
    }


    public static async delete(idFight:string):Promise<void>{
        await Model.db('nsfw_fights').where({idFight: idFight}).update({
            deletedAt: new Date()
        });
    }

}