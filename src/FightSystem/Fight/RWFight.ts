import {Utils} from "../../Common/Utils/Utils";
import * as Constants from "../../Common/Constants/BaseConstants";
import {ActiveFighter} from "./ActiveFighter";
import {ActiveFighterRepository} from "../Repositories/ActiveFighterRepository";
import {FightRepository} from "../Repositories/FightRepository";
import {ModifierFactory} from "../Modifiers/ModifierFactory";
import {BaseFight} from "../../Common/Fight/BaseFight";
import {RWActionFactory} from "../Actions/RWActionFactory";
import {ModifierType} from "../RWConstants";
import {Messages} from "../../Common/Constants/Messages";
import {TriggerMoment} from "../../Common/Constants/TriggerMoment";
import {Trigger} from "../../Common/Constants/Trigger";

export class RWFight extends BaseFight<ActiveFighter>{

    public constructor() {
        super(new RWActionFactory());
    }

    async loadFighter(idFighter: string):Promise<ActiveFighter> {
        return await ActiveFighterRepository.initialize(idFighter);
    }

    async nextTurn(){
        for (let fighter of this.fighters) {
            fighter.triggerMods(TriggerMoment.Any, Trigger.TurnChange);
            if(!fighter.isInHold()){
                fighter.healFP(1);
            }
            if(fighter.focus < fighter.minFocus()){
                fighter.consecutiveTurnsWithoutFocus++;
            }
            else{
                fighter.consecutiveTurnsWithoutFocus = 0;
            }
        }
        await super.nextTurn();
    }

    punishPlayerOnForfeit(fighter: ActiveFighter) {
        this.message.addHit(Utils.strFormat(Messages.forfeitItemApply, [fighter.getStylizedName(), fighter.maxBondageItemsOnSelf().toString()]));
        for(let i = 0; i < fighter.maxBondageItemsOnSelf(); i++){
            fighter.modifiers.push(ModifierFactory.getModifier(ModifierType.Bondage, this, fighter, null));
        }
        this.message.addHit(Utils.strFormat(Messages.forfeitTooManyItems, [fighter.getStylizedName()]));
        fighter.triggerPermanentOutsideRing();
    }

    async save(): Promise<void> {
        await FightRepository.persist(this);
    }

    async load(fightId:string): Promise<void> {
        await FightRepository.load(fightId, this);
    }

    async deleteFighterFromFight(idFighter:string, idFight:string){
        try {
            if(await ActiveFighterRepository.exists(idFighter, idFight)){
                await ActiveFighterRepository.delete(idFighter, idFight);
            }
        }
        catch (ex) {
            this.message.addError(Utils.strFormat(Messages.commandError, ex.message));
            this.sendFightMessage();
        }
    }

    async delete(): Promise<void> {
        await FightRepository.delete(this.idFight);
    }

}