import {BaseFighterStats} from "../../Common/Fight/BaseFighterStats";
import {Column, Entity, OneToOne} from "typeorm";
import {RWFighter} from "./RWFighter";

@Entity()
export class RWFighterStats extends BaseFighterStats{
    @Column()
    brawlAtksCount:number;
    @Column()
    sexstrikesCount:number;
    @Column()
    tagsCount:number;
    @Column()
    restCount:number;
    @Column()
    subholdCount:number;
    @Column()
    sexholdCount:number;
    @Column()
    bondageCount:number;
    @Column()
    humholdCount:number;
    @Column()
    itemPickups:number;
    @Column()
    sextoyPickups:number;
    @Column()
    degradationCount:number;
    @Column()
    forcedWorshipCount:number;
    @Column()
    highRiskCount:number;
    @Column()
    penetrationCount:number;
    @Column()
    stunCount:number;
    @Column()
    escapeCount:number;
    @Column()
    submitCount:number;
    @Column()
    straptoyCount:number;
    @Column()
    finishCount:number;
    @Column()
    masturbateCount:number;
}