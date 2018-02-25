import {BaseFight} from "../Fight/BaseFight";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";
import {BaseActiveAction} from "../Actions/BaseActiveAction";

export class BaseFeatureParameter{
    fight?:BaseFight;
    fighter?:BaseActiveFighter;
    target?:BaseActiveFighter;
    action?:BaseActiveAction;

    constructor(fight?:BaseFight, fighter?:BaseActiveFighter, target?:BaseActiveFighter, action?:BaseActiveAction){
        this.fight = fight;
        this.fighter = fighter;
        this.target = target;
        this.action = action;
    }
}