import * as Constants from "./Constants";
import {Fight} from "./Fight";
import {FeatureType, ModifierType} from "./Constants";
import {ActiveFighter} from "./ActiveFighter";
import {BaseFeature} from "../Common/BaseFeature";
import {Modifier} from "./Modifiers/Modifier";
import {ModifierFactory} from "./Modifiers/ModifierFactory";

export class Feature extends BaseFeature{

    getModifier(fight:Fight, attacker?:ActiveFighter, defender?:ActiveFighter):Modifier {
        let modifier:Modifier = null;
        if (!this.isExpired()) {
            switch (this.type) {
                case FeatureType.KickStart:
                    modifier = ModifierFactory.getModifier(ModifierType.ItemPickupBonus, fight, attacker, null);
                    fight.message.addHint(`${attacker.getStylizedName()} has the ${Constants.Feature.KickStart} feature!`);
                    fight.message.addHint(Constants.FeatureExplain.KickStart);
                    break;
                case FeatureType.SexyKickStart:
                    modifier = ModifierFactory.getModifier(ModifierType.SextoyPickupBonus, fight, attacker, null);
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
                    modifier = ModifierFactory.getModifier(ModifierType.Bondage, fight, attacker, null);
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