import {BaseFighter} from "./BaseFighter";
import {TransactionType} from "./Constants";
import {IAchievement} from "../Achievements/IAchievement";
import {BaseFeature} from "./BaseFeature";

export interface IFighterRepository{

    persist(fighter:BaseFighter):Promise<void>;

    persistFeatures(fighter:BaseFighter):Promise<void>;

    persistAchievements(fighter:BaseFighter):Promise<void>;

    logTransaction(idFighter:string, amount:number, transactionType:TransactionType, fromFighter?:string):Promise<void>;

    exists(name:string):Promise<boolean>;

    load(name:string):Promise<BaseFighter>;

    loadAllAchievements(fighterName:string):Promise<IAchievement[]>;

    loadAllFeatures(fighterName:string, season:number):Promise<BaseFeature[]>;

    GiveTokensToPlayersRegisteredBeforeNow(amount:number):Promise<void>;

    delete(name:string):Promise<void>;

}