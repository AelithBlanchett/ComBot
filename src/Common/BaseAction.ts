import {Tier, Trigger} from "./Constants";
import {Utils} from "./Utils";

export abstract class BaseAction{

    id: string;
    name:string;
    tier: Tier;
    isHold: boolean;
    requiresRoll: boolean;
    isTurnSkippingAction:boolean;
    explanation:string;

    singleTarget:boolean;

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

    usableOnAllies:boolean;
    usableOnEnemies:boolean;

    createdAt:Date;
    updatedAt:Date;

    constructor(name:string,
                tier: Tier,
                isHold: boolean,
                requiresRoll:boolean,
                isTurnSkippingAction:boolean,
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
                usableOnAllies:boolean,
                usableOnEnemies:boolean,
                explanation?:string){
        this.id = Utils.generateUUID();
        this.name = name;
        this.tier = tier;
        this.isHold = isHold;
        this.requiresRoll = requiresRoll;
        this.isTurnSkippingAction = isTurnSkippingAction;
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
        this.usableOnAllies = usableOnAllies;
        this.usableOnEnemies = usableOnEnemies;
        this.explanation = explanation;
        this.createdAt = new Date();
    }

    abstract get requiredDiceScore():number;

}