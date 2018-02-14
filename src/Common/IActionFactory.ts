import {BaseActiveAction} from "./BaseActiveAction";
import {BaseFight} from "./BaseFight";
import {BaseActiveFighter} from "./BaseActiveFighter";
import {Tier} from "./Constants";

export interface IActionFactory<Fight extends BaseFight, ActiveFighter extends BaseActiveFighter> {
    getAction(actionName: string, fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier):BaseActiveAction;
}