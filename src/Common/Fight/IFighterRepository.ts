import {BaseFighterState} from "./BaseFighterState";
import {IAchievement} from "../Achievements/IAchievement";
import {BaseFeature} from "../Features/BaseFeature";
import {TransactionType} from "../Constants/TransactionType";

export interface IFighterRepository{

    persist(fighter:BaseFighterState):Promise<void>;

    persistFeatures(fighter:BaseFighterState):Promise<void>;

    persistAchievements(fighter:BaseFighterState):Promise<void>;

    logTransaction(idFighter:string, amount:number, transactionType:TransactionType, fromFighter?:string):Promise<void>;

    exists(name:string):Promise<boolean>;

    load(name:string):Promise<BaseFighterState>;

    loadAllAchievements(fighterName:string):Promise<IAchievement[]>;

    loadAllFeatures(fighterName:string, season:number):Promise<BaseFeature[]>;

    GiveTokensToPlayersRegisteredBeforeNow(amount:number):Promise<void>;

    delete(name:string):Promise<void>;

}