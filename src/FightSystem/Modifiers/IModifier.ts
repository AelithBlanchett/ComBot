import {IBaseModifier} from "../../Common/Modifiers/IBaseModifier";

export interface IModifier extends IBaseModifier{
    hpDamage: number;
    lustDamage: number;
    focusDamage: number;
    hpHeal: number;
    lustHeal: number;
    focusHeal: number;

    sEvent?: string;
    sTimeToTrigger?: string;
}