import * as Constants from "./Constants";
import {ItemPickupModifier, SextoyPickupModifier, BondageModifier} from "./Modifiers/CustomModifiers";
import {Fight} from "./Fight";
import {FeatureType} from "./Constants";
import {ActiveFighter} from "./ActiveFighter";
import {BaseFeature} from "../Common/BaseFeature";
import {Modifier} from "./Modifiers/Modifier";

export class Feature extends BaseFeature{

    getModifier(fight:Fight, attacker?:ActiveFighter, defender?:ActiveFighter):Modifier {
        let modifier:Modifier = null;
        if (!this.isExpired()) {
            switch (this.type) {
                case FeatureType.KickStart:
                    modifier = new ItemPickupModifier(attacker);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.KickStart} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.KickStart);
                    break;
                case FeatureType.SexyKickStart:
                    modifier = new SextoyPickupModifier(attacker);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.SexyKickStart} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.SexyKickStart);
                    break;
                case FeatureType.Sadist:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.Sadist} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.Sadist);
                    break;
                case FeatureType.CumSlut:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.CumSlut} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.CumSlut);
                    break;
                case FeatureType.RyonaEnthusiast:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.RyonaEnthusiast} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.RyonaEnthusiast);
                    break;
                case FeatureType.BondageHandicap:
                    modifier = new BondageModifier(attacker);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.BondageHandicap} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.BondageHandicap);
                    break;
                default:
                    modifier = null;
                    fight.message.addHint(`${attacker.getStylizedName()} has an unknown feature!`);
                    fight.message.addHint("Something got wrong during the detection of the feature type.");
                    break;
            }
            if (!this.permanent) {
                this.uses--;
                fight.message.addHint(`Uses left: ${this.uses}`);
            }
        }
        return modifier;
    }

}