import {Tier, Trigger} from "./BaseConstants";
import {Utils} from "./Utils";

export abstract class BaseAction{

    idAction: string;
    name:string;
    tier: Tier;
    isHold: boolean;
    requiresRoll: boolean;
    keepActorsTurn:boolean;
    explanation:string;

    singleTarget:boolean;
    maxTargets:number;

    requiresBeingAlive:boolean;
    requiresBeingDead:boolean;
    requiresBeingInRing:boolean;
    requiresBeingOffRing:boolean;

    targetMustBeAlive:boolean;
    targetMustBeDead:boolean;
    targetMustBeInRing:boolean;
    targetMustBeOffRing:boolean;

    targetMustBeInRange:boolean;
    targetMustBeOffRange:boolean;

    requiresBeingInHold:boolean;
    requiresNotBeingInHold:boolean;
    targetMustBeInHold:boolean;
    targetMustNotBeInHold:boolean;

    usableOnSelf:boolean;
    usableOnAllies:boolean;
    usableOnEnemies:boolean;

    createdAt:Date;
    updatedAt:Date;

    constructor(name:string,
                tier: Tier,
                isHold: boolean,
                requiresRoll:boolean,
                keepActorsTurn:boolean,
                singleTarget:boolean,
                requiresBeingAlive:boolean,
                requiresBeingDead:boolean,
                requiresBeingInRing:boolean,
                requiresBeingOffRing:boolean,
                targetMustBeAlive:boolean,
                targetMustBeDead:boolean,
                targetMustBeInRing:boolean,
                targetMustBeOffRing:boolean,
                targetMustBeInRange:boolean,
                targetMustBeOffRange:boolean,
                requiresBeingInHold:boolean,
                requiresNotBeingInHold:boolean,
                targetMustBeInHold:boolean,
                targetMustNotBeInHold:boolean,
                usableOnSelf:boolean,
                usableOnAllies:boolean,
                usableOnEnemies:boolean,
                explanation?:string,
                maxTargets?:number){
        this.idAction = Utils.generateUUID();
        this.name = name;
        this.tier = tier;
        this.isHold = isHold;
        this.requiresRoll = requiresRoll;
        this.keepActorsTurn = keepActorsTurn;
        this.singleTarget = singleTarget;
        this.requiresBeingAlive = requiresBeingAlive;
        this.requiresBeingDead = requiresBeingDead;
        this.targetMustBeAlive = targetMustBeAlive;
        this.targetMustBeDead = targetMustBeDead;
        this.requiresBeingInRing = requiresBeingInRing;
        this.targetMustBeInRing = targetMustBeInRing;
        this.targetMustBeInRange = targetMustBeInRange;
        this.targetMustBeOffRange = targetMustBeOffRange;
        this.requiresBeingOffRing = requiresBeingOffRing;
        this.targetMustBeOffRing = targetMustBeOffRing;
        this.requiresBeingInHold = requiresBeingInHold;
        this.requiresNotBeingInHold = requiresNotBeingInHold;
        this.targetMustBeInHold = targetMustBeInHold;
        this.targetMustNotBeInHold = targetMustNotBeInHold;
        this.usableOnSelf = usableOnSelf;
        this.usableOnAllies = usableOnAllies;
        this.usableOnEnemies = usableOnEnemies;
        this.explanation = explanation;
        this.maxTargets = maxTargets;
        this.createdAt = new Date();
    }

    abstract get requiredDiceScore():number;

}