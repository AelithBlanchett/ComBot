import {BaseFighter} from "../../Common/Fight/BaseFighter";
import {IRWFighter} from "./IRWFighter";
import {Stats} from "../Constants/Stats";
import {FighterRepository} from "../Repositories/FighterRepository";
import {TransactionType} from "../../Common/Constants/TransactionType";
import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {RWFighterStats} from "./RWFighterStats";

@Entity()
export class RWFighter extends BaseFighter implements IRWFighter {

    @Column()
    dexterity:number = 1;
    @Column()
    power:number = 1;
    @Column()
    sensuality:number = 1;
    @Column()
    toughness:number = 1;
    @Column()
    endurance:number = 1;
    @Column()
    willpower:number = 1;

    @OneToOne(type => RWFighterStats)
    @JoinColumn()
    stats:RWFighterStats;

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
            "[b][color=cyan]Endurance[/color][/b]: " + this.endurance + "      " + "[b][color=green]Win[/color]/[color=red]Loss[/color] record[/b]: " + this.stats.wins + " - " + this.stats.losses + "\n" +
            "[b][color=green]Dexterity[/color][/b]: " + this.dexterity + "\n" +
            "[b][color=brown]Willpower[/color][/b]: " + this.willpower +  "      " + "[b][color=orange]Tokens[/color][/b]: " + this.tokens + "         [b][color=orange]Total spent[/color][/b]: "+this.tokensSpent+"\n"  +
            "[b][color=red]Features[/color][/b]: [b]" + this.getFeaturesList() + "[/b]\n" +
            "[b][color=yellow]Common.Achievements[/color][/b]: [sub]" + this.getAchievementsList() + "[/sub]\n" +
            `[b][color=white]Fun stats[/color][/b]: [sub]Avg. roll: ${this.stats.averageDiceRoll}, Fav. tag partner: ${(this.stats.favoriteTagPartner != null && this.stats.favoriteTagPartner != "" ? this.stats.favoriteTagPartner : "None!")}, Moves done: ${this.stats.actionsCount}, Nemesis: ${this.stats.nemesis} [/sub]`;
    }

    async save(): Promise<void> {
        await FighterRepository.persist(this);
    }

    async saveTokenTransaction(idFighter: string, amount: number, transactionType: TransactionType, fromFighter?: string): Promise<void> {
        await FighterRepository.logTransaction(idFighter, amount, transactionType, fromFighter);
    }

    async exists(name: string): Promise<boolean> {
        return await FighterRepository.exists(name);
    }

    async load(name: string): Promise<void> {
        await FighterRepository.load(name, this);
    }
}