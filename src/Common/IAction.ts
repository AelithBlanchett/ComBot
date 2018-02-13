import {BaseActiveFighter} from "./BaseActiveFighter";

export interface IAction<ActiveFighter extends BaseActiveFighter>{
    execute(attacker:ActiveFighter, defenders:ActiveFighter[]);

    requiredDiceScore:number;
    isNonTurnSkippingAction:boolean;
}