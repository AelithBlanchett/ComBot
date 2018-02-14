import {Utils} from "../Common/Utils";
import * as Constants from "../Common/Constants";
import {ActiveFighter} from "./ActiveFighter";
import {ActiveFighterRepository} from "./Repositories/ActiveFighterRepository";
import {FightRepository} from "./Repositories/FightRepository";
import {ModifierType} from "../Common/Constants";
import {ModifierFactory} from "./Modifiers/ModifierFactory";
import {BaseFight} from "../Common/BaseFight";
import {RWActionFactory} from "./Actions/RWActionFactory";

export class Fight extends BaseFight<ActiveFighter>{

    public constructor() {
        super();
        this.actionFactory = new RWActionFactory();
    }

    async loadFighter(idFighter: string):Promise<ActiveFighter> {
        return await ActiveFighterRepository.initialize(idFighter);
    }

    punishPlayerOnForfeit(fighter: ActiveFighter) {
        this.message.addHit(Utils.strFormat(Constants.Messages.forfeitItemApply, [fighter.getStylizedName(), fighter.maxBondageItemsOnSelf().toString()]));
        for(let i = 0; i < fighter.maxBondageItemsOnSelf(); i++){
            fighter.modifiers.push(ModifierFactory.getModifier(ModifierType.Bondage, this, fighter, null));
        }
        this.message.addHit(Utils.strFormat(Constants.Messages.forfeitTooManyItems, [fighter.getStylizedName()]));
        fighter.triggerPermanentOutsideRing();
    }

    async save(): Promise<void> {
        await FightRepository.persist(this);
    }

    async deleteFighterFromFight(idFighter:string, idFight:string){
        try {
            if(await ActiveFighterRepository.exists(idFighter, idFight)){
                await ActiveFighterRepository.delete(idFighter, idFight);
            }
        }
        catch (ex) {
            this.message.addError(Utils.strFormat(Constants.Messages.commandError, ex.message));
            this.message.send();
        }
    }

}