import {BaseActiveAction} from "./BaseActiveAction";
import {BaseFight} from "../Fight/BaseFight";
import {BaseFighterState} from "../Fight/BaseFighterState";

export interface IActionFactory<Fight extends BaseFight, FighterState extends BaseFighterState> {
    getAction(actionName: string, fight:Fight, attacker:FighterState, defenders:FighterState[], tier:number):BaseActiveAction;
}