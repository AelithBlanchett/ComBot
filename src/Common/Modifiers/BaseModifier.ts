import {IBaseModifier} from "./IBaseModifier";
import {Utils} from "../Utils/Utils";
import {BaseFight} from "../Fight/BaseFight";
import {BaseFighterState} from "../Fight/BaseFighterState";
import {Trigger} from "../Constants/Trigger";
import {TriggerMoment} from "../Constants/TriggerMoment";


export abstract class BaseModifier implements IBaseModifier{
    idModifier: string;
    tier:number;
    name:string;

    areDamageMultipliers: boolean = false;
    diceRoll: number;
    escapeRoll: number;
    uses: number;
    event:Trigger;
    timeToTrigger:TriggerMoment;
    idParentActions:Array<string>;

    fight:BaseFight;
    applier:BaseFighterState;
    receiver:BaseFighterState;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    constructor(name:string, fight:BaseFight, receiver:BaseFighterState, applier:BaseFighterState, tier:number, uses:number, timeToTrigger:TriggerMoment, event:Trigger, parentActionIds?:Array<string>){
        this.idModifier = Utils.generateUUID();
        this.receiver = receiver;
        this.applier = applier;
        this.fight = fight;
        this.tier = tier;
        this.name = name;
        this.uses = uses;
        this.event = event;
        this.timeToTrigger = timeToTrigger;
        this.idParentActions = parentActionIds;
        this.initialize();
    }

    initialize(){
        this.areDamageMultipliers = false;
        this.diceRoll = 0;
    }

    isOver():boolean{
        return (this.uses <= 0); //note: removed "|| this.receiver.isTechnicallyOut()" in latest patch. may break things.
    }

    remove():void{
        let indexModReceiver = this.receiver.modifiers.findIndex(x => x.idModifier == this.idModifier);
        if (indexModReceiver != -1) {
            this.receiver.modifiers.splice(indexModReceiver, 1);
        }

        if(this.applier != null){
            let indexModApplier = this.applier.modifiers.findIndex(x => x.idModifier == this.idModifier);
            if (indexModApplier != -1) {
                this.applier.modifiers.splice(indexModApplier, 1);
            }
        }


        for (let mod of this.receiver.modifiers) {
            if (mod.idParentActions) {
                if (mod.idParentActions.length == 1 && mod.idParentActions[0] == this.idModifier) {
                    mod.remove();
                }
                else if (mod.idParentActions.indexOf(this.idModifier) != -1) {
                    mod.idParentActions.splice(mod.idParentActions.indexOf(this.idModifier), 1);
                }
            }
        }

        if(this.applier != null) {
            for (let mod of this.applier.modifiers) {
                if (mod.idParentActions) {
                    if (mod.idParentActions.length == 1 && mod.idParentActions[0] == this.idModifier) {
                        mod.remove();
                    }
                    else if (mod.idParentActions.indexOf(this.idModifier) != -1) {
                        mod.idParentActions.splice(mod.idParentActions.indexOf(this.idModifier), 1);
                    }
                }
            }
        }

    }

    trigger(moment: TriggerMoment, event:Trigger, objFightAction?:any):string{
        let messageAboutModifier:string = "";

        if(Utils.willTriggerForEvent(this.timeToTrigger, moment, this.event, event)){
            this.uses--;
            messageAboutModifier = `${this.receiver.getStylizedName()} is affected by the ${this.name}, `;
            if(!objFightAction){
                messageAboutModifier += this.applyModifierOnReceiver(moment, event);
            }
            else{
                messageAboutModifier += this.applyModifierOnAction(moment, event, objFightAction);
            }

            if(this.isOver()){
                for(let fighter of this.fight.fighters){
                    fighter.removeMod(this.idModifier);
                }
                messageAboutModifier += ` and it is now expired.`;
            }
            else{
                messageAboutModifier += ` still effective for ${this.uses} more turns.`;
            }

            this.fight.message.addSpecial(messageAboutModifier);
        }

        return messageAboutModifier;
    }

    abstract applyModifierOnReceiver(moment: TriggerMoment, event:Trigger);
    abstract applyModifierOnAction(moment: TriggerMoment, event:Trigger, objFightAction:any);
    abstract isAHold():boolean;

}