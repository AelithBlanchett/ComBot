import {BaseFeatureParameter} from "../../Common/Features/BaseFeatureParameter";
import {RWFight} from "../Fight/RWFight";
import {RWFighterState} from "../Fight/RWFighterState";
import {RWAction} from "../Actions/RWAction";

export class FeatureParameter extends BaseFeatureParameter{
    fight?:RWFight;
    fighter?:RWFighterState;
    target?:RWFighterState;
    action?:RWAction;
}