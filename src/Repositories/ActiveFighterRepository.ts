import {Model} from "../Common/Model";
import {ActiveFighter} from "../FightSystem/ActiveFighter";
import {FighterRepository} from "./FighterRepository";
import {Utils} from "../Common/Utils";
import {ModifierRepository} from "./ModifierRepository";
import * as Constants from "../FightSystem/Constants";

export class ActiveFighterRepository{

    public static async persist(fighter:ActiveFighter):Promise<void>{
        try
        {
            let currentSeason = await Model.db(Constants.SQL.constantsTableName).where({key: Constants.SQL.currentSeasonKeyName}).first();

            if(fighter.idFight == null){
                return;
            }

            if(!await ActiveFighterRepository.exists(fighter.name, fighter.idFight)){
                fighter.createdAt = new Date();
                await Model.db(Constants.SQL.activeFightersTableName).insert({
                    idFighter: fighter.name,
                    idFight: fighter.idFight,
                    season: currentSeason.value,
                    assignedTeam: fighter.assignedTeam,
                    isReady: fighter.isReady,
                    hp: fighter.hp,
                    lust: fighter.lust,
                    livesRemaining: fighter.livesRemaining,
                    focus: fighter.focus,
                    lastDiceRoll: fighter.lastDiceRoll,
                    isInTheRing: fighter.isInTheRing,
                    canMoveFromOrOffRing: fighter.canMoveFromOrOffRing,
                    lastTagTurn: fighter.lastTagTurn,
                    wantsDraw: fighter.wantsDraw,
                    consecutiveTurnsWithoutFocus: fighter.consecutiveTurnsWithoutFocus,
                    fightStatus: fighter.fightStatus,
                    startingPower: fighter.startingPower,
                    startingSensuality: fighter.startingSensuality,
                    startingDexterity: fighter.startingDexterity,
                    startingToughness: fighter.startingToughness,
                    startingEndurance: fighter.startingEndurance,
                    startingWillpower: fighter.startingWillpower,
                    powerDelta: fighter.powerDelta,
                    sensualityDelta: fighter.sensualityDelta,
                    dexterityDelta: fighter.dexterityDelta,
                    toughnessDelta: fighter.toughnessDelta,
                    enduranceDelta: fighter.enduranceDelta,
                    willpowerDelta: fighter.willpowerDelta,
                    createdAt: fighter.createdAt
                });
            }
            else{
                fighter.updatedAt = new Date();
                await Model.db(Constants.SQL.activeFightersTableName).where({idFighter: fighter.name, idFight: fighter.idFight}).update({
                    assignedTeam: fighter.assignedTeam,
                    isReady: fighter.isReady,
                    hp: fighter.hp,
                    lust: fighter.lust,
                    livesRemaining: fighter.livesRemaining,
                    focus: fighter.focus,
                    lastDiceRoll: fighter.lastDiceRoll,
                    isInTheRing: fighter.isInTheRing,
                    canMoveFromOrOffRing: fighter.canMoveFromOrOffRing,
                    lastTagTurn: fighter.lastTagTurn,
                    wantsDraw: fighter.wantsDraw,
                    consecutiveTurnsWithoutFocus: fighter.consecutiveTurnsWithoutFocus,
                    fightStatus: fighter.fightStatus,
                    startingPower: fighter.startingPower,
                    startingSensuality: fighter.startingSensuality,
                    startingDexterity: fighter.startingDexterity,
                    startingToughness: fighter.startingToughness,
                    startingEndurance: fighter.startingEndurance,
                    startingWillpower: fighter.startingWillpower,
                    powerDelta: fighter.powerDelta,
                    sensualityDelta: fighter.sensualityDelta,
                    dexterityDelta: fighter.dexterityDelta,
                    toughnessDelta: fighter.toughnessDelta,
                    enduranceDelta: fighter.enduranceDelta,
                    willpowerDelta: fighter.willpowerDelta,
                    updatedAt: fighter.updatedAt
                });
            }


        }
        catch(ex){
            throw ex;
        }
    }

    public static async exists(idFighter:string, idFight:string):Promise<boolean>{
        let loadedData = await Model.db(Constants.SQL.activeFightersTableName).where({idFighter: idFighter, idFight: idFight}).select();
        return (loadedData.length > 0);
    }

    public static async initialize(idFighter:string):Promise<ActiveFighter>{
        let loadedActiveFighter:ActiveFighter = new ActiveFighter();

        if(!await FighterRepository.exists(idFighter)){
            return null;
        }

        let loadedFighter = await FighterRepository.load(idFighter);
        Utils.mergeFromTo(loadedFighter, loadedActiveFighter);

        loadedActiveFighter.initialize();

        return loadedActiveFighter;
    }

    public static async load(idFighter:string, idFight:string):Promise<ActiveFighter>{
        let loadedActiveFighter:ActiveFighter = new ActiveFighter();

        if(!await ActiveFighterRepository.exists(idFighter, idFight)){
            return null;
        }

        try
        {
            loadedActiveFighter = await ActiveFighterRepository.initialize(idFighter);

            let loadedData = await Model.db(Constants.SQL.activeFightersTableName).where({idFighter: idFighter, idFight: idFight}).select();
            let data = loadedData[0];

            Utils.mergeFromTo(data, loadedActiveFighter);

            loadedActiveFighter.modifiers = await ModifierRepository.loadFromFight(idFighter, idFight);
            //No need to load actions, that's done in the fight loading
        }
        catch(ex){
            throw ex;
        }

        return loadedActiveFighter;
    }

    public static async loadFromFight(idFight:string):Promise<ActiveFighter[]>{
        let loadedActiveFighters:ActiveFighter[] = [];

        try
        {
            let loadedData = await Model.db(Constants.SQL.activeFightersTableName).where({idFight: idFight}).select();

            for(let data of loadedData){
                let activeFighter = new ActiveFighter();
                activeFighter = await ActiveFighterRepository.load(data.idFighter, idFight);
                loadedActiveFighters.push(activeFighter);
            }

        }
        catch(ex){
            throw ex;
        }

        return loadedActiveFighters;
    }

    public static async delete(idFighter:string, idFight:string):Promise<void>{
        await Model.db(Constants.SQL.activeFightersTableName).where({idFighter: idFighter, idFight: idFight}).del();
    }

}