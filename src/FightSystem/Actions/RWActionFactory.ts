import {IActionFactory} from "../../Common/IActionFactory";
import {ActionType, RWAction} from "../RWAction";
import {ActionTag} from "./ActionTag";
import {Fight} from "../Fight";
import {ActiveFighter} from "../ActiveFighter";
import {Tier} from "../../Common/BaseConstants";
import {ActionBrawl} from "./ActionBrawl";
import {ActionTease} from "./ActionTease";
import {ActionHighRisk} from "./ActionHighRisk";
import {ActionRiskyLewd} from "./ActionRiskyLewd";
import {ActionRest} from "./ActionRest";
import {ActionSubHold} from "./ActionSubHold";
import {ActionEscape} from "./ActionEscape";
import {ActionSexHold} from "./ActionSexHold";
import {ActionHumHold} from "./ActionHumHold";
import {ActionItemPickup} from "./ActionItemPickup";
import {ActionSextoyPickup} from "./ActionSextoyPickup";
import {ActionBondage} from "./ActionBondage";
import {ActionStun} from "./ActionStun";
import {ActionForcedWorship} from "./ActionForcedWorship";

export class RWActionFactory implements IActionFactory<Fight, ActiveFighter> {
    getAction(actionName: string, fight:Fight, attacker:ActiveFighter, defenders:ActiveFighter[], tier:Tier): RWAction {
        let action:RWAction;
        switch(actionName){
            case ActionType.Brawl:
                action = new ActionBrawl(fight, attacker, defenders, tier);
                break;
            case ActionType.Tease:
                action = new ActionTease(fight, attacker, defenders, tier);
                break;
            case ActionType.HighRisk:
                action = new ActionHighRisk(fight, attacker, defenders, tier);
                break;
            case ActionType.RiskyLewd:
                action = new ActionRiskyLewd(fight, attacker, defenders, tier);
                break;
            case ActionType.SubHold:
                action = new ActionSubHold(fight, attacker, defenders, tier);
                break;
            case ActionType.SexHold:
                action = new ActionSexHold(fight, attacker, defenders, tier);
                break;
            case ActionType.HumHold:
                action = new ActionHumHold(fight, attacker, defenders, tier);
                break;
            case ActionType.Stun:
                action = new ActionStun(fight, attacker, defenders, tier);
                break;
            case ActionType.ForcedWorship:
                action = new ActionForcedWorship(fight, attacker, defenders, tier);
                break;
            case ActionType.ItemPickup:
                action = new ActionItemPickup(fight, attacker, defenders);
                break;
            case ActionType.SextoyPickup:
                action = new ActionSextoyPickup(fight, attacker, defenders);
                break;
            case ActionType.Escape:
                action = new ActionEscape(fight, attacker, defenders);
                break;
            case ActionType.Rest:
                action = new ActionRest(fight, attacker, defenders);
                break;
            case ActionType.Tag:
                action = new ActionTag(fight, attacker, defenders);
                break;
            case ActionType.Bondage:
                action = new ActionBondage(fight, attacker, defenders);
                break;
            default:
                throw new Error(`The ${actionName} action doesn't exist!`);
        }

        return action;
    }
}