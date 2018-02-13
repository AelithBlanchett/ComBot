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
    targetMustBeAlive:boolean;
    requiresBeingInRing:boolean;
    targetMustBeInRing:boolean;
    targetMustBeInRange:boolean;
    usableOnAllies:boolean;
    usableOnEnemies:boolean;

    createdAt:Date;
    updatedAt:Date;

    constructor(name:string, tier: Tier, isHold: boolean, requiresRoll:boolean, isTurnSkippingAction:boolean, singleTarget:boolean, requiresBeingAlive:boolean, targetMustBeAlive:boolean, requiresBeingInRing:boolean, targetMustBeInRing:boolean, targetMustBeInRange:boolean, usableOnAllies:boolean, usableOnEnemies:boolean, explanation?:string){
        this.id = Utils.generateUUID();
        this.name = name ? name : "Unknown Action!";
        this.tier = tier ? tier : Tier.None;
        this.isHold = isHold ? isHold : false;
        this.requiresRoll = requiresRoll ? requiresRoll : true;
        this.isTurnSkippingAction = isTurnSkippingAction ? isTurnSkippingAction : false;
        this.singleTarget = singleTarget ? singleTarget : true;
        this.requiresBeingAlive = requiresBeingAlive ? requiresBeingAlive : true;
        this.targetMustBeAlive = targetMustBeAlive ? targetMustBeAlive : true;
        this.requiresBeingInRing = requiresBeingInRing ? requiresBeingInRing : true;
        this.targetMustBeInRing = targetMustBeInRing ? targetMustBeInRing : true;
        this.targetMustBeInRange = targetMustBeInRange ? targetMustBeInRange : true;
        this.usableOnAllies = usableOnAllies ? usableOnAllies : false;
        this.usableOnEnemies = usableOnEnemies ? usableOnEnemies : true;
        this.explanation = explanation ? explanation : "";
        this.createdAt = new Date();
    }

    abstract get requiredDiceScore():number;

}