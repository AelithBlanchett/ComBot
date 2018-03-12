import {BaseFeatureParameter} from "../../Common/Features/BaseFeatureParameter";
import {RWFight} from "../Fight/RWFight";
import {ActiveFighter} from "../Fight/ActiveFighter";
import {RWAction} from "../Actions/RWAction";

export class FeatureParameter extends BaseFeatureParameter{
    fight?:RWFight;
    fighter?:ActiveFighter;
    target?:ActiveFighter;
    action?:RWAction;
}