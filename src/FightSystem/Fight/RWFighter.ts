import {BaseFighter} from "../../Common/Fight/BaseFighter";
import {IRWFighter} from "./IRWFighter";
import {TransactionType} from "../../Common/BaseConstants";
import {Stats} from "../Constants/Stats";

export class RWFighter extends BaseFighter implements IRWFighter {
    save(): Promise<void> {
        return undefined;
    }

    saveTokenTransaction(idFighter: string, amount: number, transactionType: TransactionType, fromFighter?: string): Promise<void> {
        return undefined;
    }

    dexterity:number = 1;
    power:number = 1;
    sensuality:number = 1;
    toughness:number = 1;
    endurance:number = 1;
    willpower:number = 1;

    //They are used in the FighterRepository file.
    //Date from the database is assigned to these variables thanks to the mergeFromTo function
    brawlAtksCount:number;
    sexstrikesCount:number;
    tagsCount:number;
    restCount:number;
    subholdCount:number;
    sexholdCount:number;
    bondageCount:number;
    humholdCount:number;
    itemPickups:number;
    sextoyPickups:number;
    degradationCount:number;
    forcedWorshipCount:number;
    highRiskCount:number;
    penetrationCount:number;
    stunCount:number;
    escapeCount:number;
    submitCount:number;
    straptoyCount:number;
    finishCount:number;
    masturbateCount:number;

    restat(statArray:Array<number>){
        for(let i = 0; i < statArray.length;  i++){
            this[Stats[i]] = statArray[i];
        }
    }

    outputStats():string{
        return "[b]" + this.name + "[/b]'s stats" + "\n" +
            "[b][color=red]Power[/color][/b]:  " + this.power + "      "+"\n" +
            "[b][color=purple]Sensuality[/color][/b]:  " + this.sensuality + "\n" +
            "[b][color=orange]Toughness[/color][/b]: " + this.toughness + "\n" +
            "[b][color=cyan]Endurance[/color][/b]: " + this.endurance + "      " + "[b][color=green]Win[/color]/[color=red]Loss[/color] record[/b]: " + this.wins + " - " + this.losses + "\n" +
            "[b][color=green]Dexterity[/color][/b]: " + this.dexterity + "\n" +
            "[b][color=brown]Willpower[/color][/b]: " + this.willpower +  "      " + "[b][color=orange]Tokens[/color][/b]: " + this.tokens + "         [b][color=orange]Total spent[/color][/b]: "+this.tokensSpent+"\n"  +
            "[b][color=red]Features[/color][/b]: [b]" + this.getFeaturesList() + "[/b]\n" +
            "[b][color=yellow]Common.Achievements[/color][/b]: [sub]" + this.getAchievementsList() + "[/sub]\n" +
            `[b][color=white]Fun stats[/color][/b]: [sub]Avg. roll: ${this.averageDiceRoll}, Fav. tag partner: ${(this.favoriteTagPartner != null && this.favoriteTagPartner != "" ? this.favoriteTagPartner : "None!")}, Moves done: ${this.actionsCount}, Nemesis: ${this.nemesis} [/sub]`;
    }


}