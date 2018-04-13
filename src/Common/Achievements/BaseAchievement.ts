import {CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IAchievement} from "./IAchievement";
import {BaseFighterState} from "../Fight/BaseFighterState";
import {BaseFight} from "../Fight/BaseFight";
import {BaseUser} from "../Fight/BaseUser";

@Entity("Achievements")
export abstract class BaseAchievement implements IAchievement{

    @PrimaryGeneratedColumn()
    achievementId:string;

    @CreateDateColumn()
    createdAt:Date;

    @ManyToOne(type => BaseUser, user => user.achievements)
    user:BaseUser;

    abstract getDetailedDescription(): string;

    abstract getName(): string;

    abstract getReward(): number;

    abstract getUniqueShortName(): string;

    abstract meetsRequirements(user: BaseUser, activeFighter: BaseFighterState, fight: BaseFight): boolean;

}