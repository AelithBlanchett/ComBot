import {Action, EmptyAction} from "./Action";
import {Model} from "./Model";
import {Utils} from "./Utils";
import * as Constants from "./Constants";

export class ActionRepository{

    public static async persist(action:Action):Promise<void>{
        try
        {
            if(!await ActionRepository.exists(action.idAction)){
                action.createdAt = new Date();
                await Model.db(Constants.SQL.actionTableName).insert(
                    {
                        idAction: action.idAction,
                        idFight: action.idFight,
                        atTurn: action.atTurn,
                        type: action.type,
                        tier: action.tier,
                        isHold: action.isHold,
                        diceScore: action.diceScore,
                        missed: action.missed,
                        idAttacker: action.idAttacker,
                        idDefender: action.idDefender,
                        hpDamageToDef: action.hpDamageToDef,
                        lpDamageToDef: action.fpDamageToDef,
                        fpDamageToDef: action.lpDamageToDef,
                        hpDamageToAtk: action.hpDamageToAtk,
                        lpDamageToAtk: action.fpDamageToAtk,
                        fpDamageToAtk: action.lpDamageToAtk,
                        hpHealToDef: action.hpHealToDef,
                        lpHealToDef: action.fpHealToDef,
                        fpHealToDef: action.lpHealToDef,
                        hpHealToAtk: action.hpHealToAtk,
                        lpHealToAtk: action.fpHealToAtk,
                        fpHealToAtk: action.lpHealToAtk,
                        requiresRoll: action.requiresRoll,
                        createdAt: action.createdAt
                    }).into(Constants.SQL.actionTableName);
            }
            else{
                action.updatedAt = new Date();
                await Model.db(Constants.SQL.actionTableName).where({idAction: action.idAction}).update(
                    {
                        idFight: action.idFight,
                        atTurn: action.atTurn,
                        type: action.type,
                        tier: action.tier,
                        isHold: action.isHold,
                        diceScore: action.diceScore,
                        missed: action.missed,
                        idAttacker: action.idAttacker,
                        idDefender: action.idDefender,
                        hpDamageToDef: action.hpDamageToDef,
                        lpDamageToDef: action.fpDamageToDef,
                        fpDamageToDef: action.lpDamageToDef,
                        hpDamageToAtk: action.hpDamageToAtk,
                        lpDamageToAtk: action.fpDamageToAtk,
                        fpDamageToAtk: action.lpDamageToAtk,
                        hpHealToDef: action.hpHealToDef,
                        lpHealToDef: action.fpHealToDef,
                        fpHealToDef: action.lpHealToDef,
                        hpHealToAtk: action.hpHealToAtk,
                        lpHealToAtk: action.fpHealToAtk,
                        fpHealToAtk: action.lpHealToAtk,
                        requiresRoll: action.requiresRoll,
                        updatedAt: action.updatedAt
                    }).into(Constants.SQL.actionTableName);
            }

        }
        catch(ex){
            throw ex;
        }
    }

    public static async loadFromFight(idFight:string):Promise<Action[]>{
        let loadedActions:Action[] = [];

        try
        {
            let loadedData = await Model.db(Constants.SQL.actionTableName).where({idFight: idFight}).select();

            for(let data of loadedData){
                let action = new EmptyAction();
                Utils.mergeFromTo(data, action);
                loadedActions.push(action);
            }

        }
        catch(ex){
            throw ex;
        }

        return loadedActions;
    }

    public static async exists(idAction:string):Promise<boolean>{
        let loadedData = [];
        if(idAction){
            try{
                loadedData = await Model.db(Constants.SQL.actionTableName).where({idAction: idAction}).select();
            }
            catch(ex){
                throw ex;
            }
        }
        return (loadedData.length > 0);
    }

    public static async delete(actionId:string):Promise<void>{
        if(actionId){
            try{
                await Model.db(Constants.SQL.actionTableName).where({idAction: actionId}).del();
            }
            catch(ex){
                throw ex;
            }
        }
    }

}