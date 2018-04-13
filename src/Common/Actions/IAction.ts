import {BaseFighterState} from "../Fight/BaseFighterState";

export interface IAction<FighterState extends BaseFighterState>{
    execute(attacker:FighterState, defenders:FighterState[]);

    requiredDiceScore:number;
    isNonTurnSkippingAction:boolean;
}