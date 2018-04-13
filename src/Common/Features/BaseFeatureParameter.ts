import {BaseFight} from "../Fight/BaseFight";
import {BaseFighterState} from "../Fight/BaseFighterState";
import {BaseActiveAction} from "../Actions/BaseActiveAction";

export class BaseFeatureParameter{
    fight?:BaseFight;
    fighter?:BaseFighterState;
    target?:BaseFighterState;
    action?:BaseActiveAction;

    constructor(fight?:BaseFight, fighter?:BaseFighterState, target?:BaseFighterState, action?:BaseActiveAction){
        this.fight = fight;
        this.fighter = fighter;
        this.target = target;
        this.action = action;
    }
}