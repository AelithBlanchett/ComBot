import {Model} from "../../Common/Model";
import {Utils} from "../../Common/Utils";
import * as Constants from "../../Common/Constants";
import {BaseRWAction, EmptyAction} from "../RWAction";

export class ActionRepository{

    public static async persist(action:BaseRWAction):Promise<void>{
        try
        {
            for(let i = 0; i < action.defenders.length; i++){
                let baseParameter:any = {
                    idFight: action.fight.idFight,
                    atTurn: action.atTurn,
                    type: action.name,
                    tier: action.tier,
                    isHold: action.isHold,
                    diceScore: action.diceScore,
                    missed: action.missed,
                    idAttacker: action.attacker.name,
                    idDefender: action.defenders[i].name,
                    hpDamageToDef: action.hpDamageToDefs[i],
                    lpDamageToDef: action.fpDamageToDefs[i],
                    fpDamageToDef: action.lpDamageToDefs[i],
                    hpDamageToAtk: action.hpDamageToAtk,
                    lpDamageToAtk: action.fpDamageToAtk,
                    fpDamageToAtk: action.lpDamageToAtk,
                    hpHealToDef: action.hpHealToDefs[i],
                    lpHealToDef: action.fpHealToDefs[i],
                    fpHealToDef: action.lpHealToDefs[i],
                    hpHealToAtk: action.hpHealToAtk,
                    lpHealToAtk: action.fpHealToAtk,
                    fpHealToAtk: action.lpHealToAtk,
                    requiresRoll: action.requiresRoll};

                if(!await ActionRepository.exists(action.id)){
                    baseParameter.idAction = action.id;
                    action.createdAt = new Date();
                    baseParameter.createdAt = action.createdAt;
                    await Model.db(Constants.SQL.actionTableName).insert(baseParameter).into(Constants.SQL.actionTableName);
                }
                else{
                    action.updatedAt = new Date();
                    baseParameter.updatedAt = action.updatedAt;
                    await Model.db(Constants.SQL.actionTableName).where({idAction: action.id}).update(
                        {
                            idFight: action.fight.idFight,
                            atTurn: action.atTurn,
                            type: action.name,
                            tier: action.tier,
                            isHold: action.isHold,
                            diceScore: action.diceScore,
                            missed: action.missed,
                            idAttacker: action.attacker.name,
                            idDefender: action.defenders[i].name,
                            hpDamageToDef: action.hpDamageToDefs[i],
                            lpDamageToDef: action.fpDamageToDefs[i],
                            fpDamageToDef: action.lpDamageToDefs[i],
                            hpDamageToAtk: action.hpDamageToAtk,
                            lpDamageToAtk: action.fpDamageToAtk,
                            fpDamageToAtk: action.lpDamageToAtk,
                            hpHealToDef: action.hpHealToDefs[i],
                            lpHealToDef: action.fpHealToDefs[i],
                            fpHealToDef: action.lpHealToDefs[i],
                            hpHealToAtk: action.hpHealToAtk,
                            lpHealToAtk: action.fpHealToAtk,
                            fpHealToAtk: action.lpHealToAtk,
                            requiresRoll: action.requiresRoll,
                            updatedAt: action.updatedAt
                        }).into(Constants.SQL.actionTableName);
                }
            }
        }
        catch(ex){
            throw ex;
        }
    }

    public static async loadFromFight(idFight:string):Promise<BaseRWAction[]>{
        let loadedActions:BaseRWAction[] = [];

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