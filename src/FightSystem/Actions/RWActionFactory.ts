import {IActionFactory} from "../../Common/IActionFactory";
import {ActionType, RWAction} from "../RWAction";
import {ActionTag} from "./ActionTag";
import {Fight} from "../Fight";
import {ActiveFighter} from "../ActiveFighter";
import {Tier} from "../../Common/Constants";

export class RWActionFactory implements IActionFactory<Fight, ActiveFighter> {
    getAction(actionName: string, fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier): RWAction {
        if(actionName == ActionType.Tag){
            return new ActionTag(fight, attacker, defenders);
        }
    }
}