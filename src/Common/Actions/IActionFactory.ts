import {BaseActiveAction} from "./BaseActiveAction";
import {BaseFight} from "../Fight/BaseFight";
import {BaseActiveFighter} from "../Fight/BaseActiveFighter";

export interface IActionFactory<Fight extends BaseFight, ActiveFighter extends BaseActiveFighter> {
    getAction(actionName: string, fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:number):BaseActiveAction;
}