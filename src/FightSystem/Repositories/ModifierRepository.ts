import {Database} from "../../Common/Utils/Model";
import {Utils} from "../../Common/Utils/Utils";
import {Modifier} from "../Modifiers/Modifier";
import * as BaseConstants from "../../Common/BaseConstants";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {ModifierType} from "../RWConstants";

export class ModifierRepository{

    public static async persist(modifier:Modifier):Promise<void>{
        try
        {
            if(!await ModifierRepository.exists(modifier.idModifier)){
                modifier.createdAt = new Date();
                await Database.get(BaseConstants.SQL.modifiersTableName).insert(
                    {
                        idModifier: modifier.idModifier,
                        idFight: modifier.fight.idFight,
                        idReceiver: modifier.receiver.name,
                        idApplier: modifier.applier.name,
                        tier: modifier.tier,
                        type: modifier.name,
                        focusDamage: modifier.focusDamage,
                        hpDamage: modifier.hpDamage,
                        lustDamage: modifier.lustDamage,
                        areDamageMultipliers: modifier.areDamageMultipliers,
                        diceRoll: modifier.diceRoll,
                        escapeRoll: modifier.escapeRoll,
                        uses: modifier.uses,
                        event: modifier.event,
                        timeToTrigger: modifier.timeToTrigger,
                        idParentActions: modifier.idParentActions.join(";"),
                        createdAt: modifier.createdAt
                    }).into(BaseConstants.SQL.modifiersTableName);
            }
            else{
                modifier.updatedAt = new Date();
                await Database.get(BaseConstants.SQL.modifiersTableName).where({idModifier: modifier.idModifier}).update(
                    {
                        idFight: modifier.fight.idFight,
                        idReceiver: modifier.receiver.name,
                        idApplier: modifier.applier.name,
                        tier: modifier.tier,
                        type: modifier.name,
                        focusDamage: modifier.focusDamage,
                        hpDamage: modifier.hpDamage,
                        lustDamage: modifier.lustDamage,
                        areDamageMultipliers: modifier.areDamageMultipliers,
                        diceRoll: modifier.diceRoll,
                        escapeRoll: modifier.escapeRoll,
                        uses: modifier.uses,
                        event: modifier.event,
                        timeToTrigger: modifier.timeToTrigger,
                        idParentActions: JSON.stringify(modifier.idParentActions),
                        updatedAt: modifier.updatedAt
                    }).into(BaseConstants.SQL.modifiersTableName);
            }

        }
        catch(ex){
            throw ex;
        }
    }

    public static async loadFromFight(idFighter:string, idFight:string):Promise<Modifier[]>{
        let loadedModifiers:Modifier[] = [];

        try
        {
            let loadedData = await Database.get(BaseConstants.SQL.modifiersTableName).where({idFight: idFight, idReceiver: idFighter}).and.whereNull('deletedAt').select();

            for(let data of loadedData){
                let modifier = ModifierFactory.getModifier(ModifierType.DummyModifier, null, null, null);
                Utils.mergeFromTo(data, modifier);
                modifier.idParentActions = [];
                if(data.idParentActions != null){
                    for(let id of data.idParentActions.split(";")){
                        modifier.idParentActions.push(id);
                    }
                }
                loadedModifiers.push(modifier);
            }

        }
        catch(ex){
            throw ex;
        }

        return loadedModifiers;
    }

    public static async exists(idModifier:string):Promise<boolean>{
        let loadedData = await Database.get(BaseConstants.SQL.modifiersTableName).where({idModifier: idModifier}).and.whereNull('deletedAt').select();
        return (loadedData.length > 0);
    }

    public static async delete(idModifier:string):Promise<void>{
        try{
            await Database.get(BaseConstants.SQL.modifiersTableName).where({idModifier: idModifier}).and.whereNull('deletedAt').update({
                deletedAt: new Date()
            });
        }
        catch(ex){
            throw ex;
        }
    }

    public static async deleteFromFight(idFight:string):Promise<void>{
        try{
            await Database.get(BaseConstants.SQL.modifiersTableName).where({idFight: idFight}).and.whereNull('deletedAt').update({
                deletedAt: new Date()
            });
        }
        catch(ex){
            throw ex;
        }
    }

}