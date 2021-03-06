import {Utils} from "../../Common/Utils/Utils";
import {RWFighterState} from "./RWFighterState";
import {BaseFight} from "../../Common/Fight/BaseFight";
import {RWActionFactory} from "../Actions/RWActionFactory";
import {ModifierType} from "../RWConstants";
import {Messages} from "../../Common/Constants/Messages";
import {TriggerMoment} from "../../Common/Constants/TriggerMoment";
import {Trigger} from "../../Common/Constants/Trigger";
import {ChildEntity, Column, Entity, JoinColumn, OneToMany} from "typeorm";
import {ModifierFactory} from "../Modifiers/ModifierFactory";


@ChildEntity("rw")
export class RWFight extends BaseFight<RWFighterState>{

    @Column()
    test:string;

    public constructor() {
        super(new RWActionFactory());
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

    punishPlayerOnForfeit(fighter: RWFighterState) {
        this.message.addHit(Utils.strFormat(Messages.forfeitItemApply, [fighter.getStylizedName(), fighter.maxBondageItemsOnSelf().toString()]));
        for(let i = 0; i < fighter.maxBondageItemsOnSelf(); i++){
            fighter.modifiers.push(ModifierFactory.getModifier(ModifierType.Bondage, this, fighter, null));
        }
        this.message.addHit(Utils.strFormat(Messages.forfeitTooManyItems, [fighter.getStylizedName()]));
        fighter.triggerPermanentOutsideRing();
    }


}