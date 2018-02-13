import {BaseFighter} from "../Common/BaseFighter";

export interface IRWFighter extends BaseFighter{
    dexterity:number;
    power:number;
    sensuality:number;
    toughness:number;
    endurance:number;
    willpower:number;

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

}