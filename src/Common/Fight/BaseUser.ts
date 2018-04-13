import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import {BaseAchievement} from "../Achievements/BaseAchievement";
import {BaseFighterStats} from "./BaseFighterStats";
import {BaseFeature} from "../Features/BaseFeature";
import {TransactionType} from "../Constants/TransactionType";
import {Messages} from "../Constants/Messages";
import {FightTier} from "../Constants/FightTier";
import {FightTierWinRequirements} from "../Constants/FightTierWinRequirements";
import {IFeatureFactory} from "../Features/IFeatureFactory";
import {BaseFight} from "./BaseFight";
import {BaseFighterState} from "./BaseFighterState";

@Entity("Users")
export abstract class BaseUser extends BaseEntity{
    @PrimaryColumn()
    name:string = "";
    @Column()
    areStatsPrivate:boolean = true;
    @Column()
    tokens: number = 50;
    @Column()
    tokensSpent: number = 0;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
    @Column()
    deleted:boolean = false;

    @OneToMany(type => BaseAchievement, achievement => achievement.user)
    @JoinColumn()
    achievements:BaseAchievement[];
    @OneToOne(type => BaseFighterStats)
    @JoinColumn()
    statistics:BaseFighterStats;
    @OneToMany(type => BaseFeature, feature => feature.receiver)
    @JoinColumn()
    features:BaseFeature[];
    @OneToMany(type => BaseFighterState, fighterState => fighterState.fight)
    @JoinColumn()
    fightStates:BaseFighterState[];

    featureFactory:IFeatureFactory;

    constructor(name:string, featureFactory:IFeatureFactory){
        super();
        this.name = name;
        this.featureFactory = featureFactory;
    }

    getFeaturesList(){
        let strResult = [];
        for(let feature of this.features){
            let usesLeft = "";
            if(feature.uses > 0){
                usesLeft = ` - ${feature.uses} uses left`;
            }
            else{
                usesLeft = ` - permanent`;
            }
            strResult.push(`${feature.type}${usesLeft}`);
        }
        return strResult.join(", ");
    }

    getAchievementsList(){
        let strResult = [];
        for(let achievement of this.achievements){
            strResult.push(`${achievement.getDetailedDescription()}`);
        }
        return strResult.join(", ");
    }

    removeFeature(type:string):void{
        let index = this.features.findIndex(x => x.type == type);
        if(index != -1){
            this.features.splice(index, 1);
        }
        else{
            throw new Error("You don't have this feature, you can't remove it.");
        }
    }

    addFeature(type:string, matches:number):number{
        let feature:any = this.featureFactory.getFeature(type, this, matches);

        if(feature == null){
            throw new Error(`Feature not found. These are the existing features: ${this.featureFactory.getExistingFeatures().join(',')}`);
        }

        if(feature.getCost() > 0 && matches == 0){
            throw new Error(`A paid feature requires a specific number of matches.`);
        }

        let amountToRemove:number = feature.getCost() * matches;

        if(this.tokens - amountToRemove >= 0){
            let index = this.features.findIndex(x => x.type == type);
            if(index == -1){
                this.features.push(feature);
                return amountToRemove;
            }
            else{
                throw new Error(Messages.cantAddFeatureAlreadyHaveIt);
            }
        }
        else{
            throw new Error(`Not enough tokens. Required: ${amountToRemove}.`);
        }
    }

    clearFeatures(){
        this.features = [];
    }

    hasFeature(featureType:string):boolean{
        return this.features.findIndex(x => x.type == featureType) != -1;
    }

    async giveTokens(amount:number, transactionType:TransactionType, fromFighter:string = ""):Promise<void>{
        this.tokens += amount;
        await this.saveTokenTransaction(this.name, amount, transactionType, fromFighter);
    }

    async removeTokens(amount:number, transactionType:TransactionType, fromFighter:string = ""):Promise<void>{
        this.tokens -= amount;
        this.tokensSpent += amount;
        if(this.tokens < 0){
            this.tokens = 0;
        }
        await this.saveTokenTransaction(this.name, amount, transactionType, fromFighter);
    }

    canPayAmount(amount):boolean{
        return (this.tokens - amount >= 0);
    }

    fightTier():FightTier{
        if(this.statistics == null){
            return FightTier.Bronze;
        }
        if(this.statistics.wins < FightTierWinRequirements.Silver){
            return FightTier.Bronze;
        }
        else if(this.statistics.wins < FightTierWinRequirements.Gold){
            return FightTier.Silver
        }
        else if(this.statistics.wins >= FightTierWinRequirements.Gold){
            return FightTier.Gold;
        }
        else{
            return FightTier.Bronze;
        }
    }

    abstract outputStats():string;
    abstract restat(statArray:Array<number>);
    abstract async saveTokenTransaction(idFighter:string, amount:number, transactionType:TransactionType, fromFighter?:string):Promise<void>;

}