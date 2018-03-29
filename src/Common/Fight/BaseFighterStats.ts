import {Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationOptions} from "typeorm";
import {Team} from "../Constants/Team";

export abstract class BaseFighterStats{

    @PrimaryGeneratedColumn()
    statsId:string;
    @Column()
    fightsCount:number;
    @Column()
    fightsCountCS:number;
    @Column()
    losses:number;
    @Column()
    lossesSeason:number;
    @Column()
    wins:number;
    @Column()
    winsSeason:number;
    @Column()
    currentlyPlaying:number;
    @Column()
    currentlyPlayingSeason:number;
    @Column()
    fightsPendingReady:number;
    @Column()
    fightsPendingReadySeason:number;
    @Column()
    fightsPendingStart:number;
    @Column()
    fightsPendingStartSeason:number;
    @Column()
    fightsPendingDraw:number;
    @Column()
    fightsPendingDrawSeason:number;
    @Column()
    favoriteTeam:Team;
    @Column()
    favoriteTagPartner:string;
    @Column()
    timesFoughtWithFavoriteTagPartner:number;
    @Column()
    nemesis:string;
    @Column()
    lossesAgainstNemesis:number;
    @Column()
    averageDiceRoll:number;
    @Column()
    missedAttacks:number;
    @Column()
    actionsCount:number;
    @Column()
    actionsDefended:number;

    @Column()
    matchesInLast24Hours:number;
    @Column()
    matchesInLast48Hours:number;

    @Column()
    eloRating:number = 2000;
    @Column()
    globalRank:number;

    @Column()
    forfeits:number;
    @Column()
    quits:number;

    get winrate():number{
        let winRate = 0.00;
        if(this.fightsCount > 0 && this.wins > 0){
            winRate = this.fightsCount/this.wins;
        }
        else if(this.fightsCount > 0 && this.losses > 0){
            winRate = 1 - this.fightsCount/this.losses;
        }
        return winRate;
    }
}