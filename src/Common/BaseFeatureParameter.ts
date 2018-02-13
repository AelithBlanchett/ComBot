import {BaseFight} from "./BaseFight";
import {BaseActiveFighter} from "./BaseActiveFighter";
import {BaseActiveAction} from "./BaseActiveAction";

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