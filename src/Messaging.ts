import {IFChatLib} from "./interfaces/IFChatLib";
import {IMessage} from "./interfaces/IMessage";

export class Message implements IMessage {
    fChatLib:IFChatLib;
    channel:string;
    action:Array<string>;
    HPDamageAtk:number;
    LPDamageAtk:number;
    FPDamageAtk:number;
    HPHealAtk:number;
    LPHealAtk:number;
    FPHealAtk:number;
    HPDamageDef:number;
    LPDamageDef:number;
    FPDamageDef:number;
    HPHealDef:number;
    LPHealDef:number;
    FPHealDef:number;
    hit:Array<string>;
    status:Array<string>;
    hint:Array<string>;
    special:Array<string>;
    info:Array<string>;
    error:Array<string>;
    lastMessage:string;

    constructor(fChatLib:IFChatLib, channel:string) {
        this.clear();
        this.fChatLib = fChatLib;
        this.channel = channel;
        this.lastMessage = null;
    }

    clear(){
        this.action = [];
        this.HPDamageAtk = 0;
        this.LPDamageAtk = 0;
        this.FPDamageAtk = 0;
        this.HPHealAtk = 0;
        this.LPHealAtk = 0;
        this.FPHealAtk = 0;
        this.HPDamageDef = 0;
        this.LPDamageDef = 0;
        this.FPDamageDef = 0;
        this.HPHealDef = 0;
        this.LPHealDef = 0;
        this.FPHealDef = 0;
        this.hit = [];
        this.status = [];
        this.hint = [];
        this.special = [];
        this.info = [];
        this.error = [];
    }

    getAction() {
        return "Action: [color=yellow]" + this.action.join(" ") + "[/color]";
    }

    getHit() {
        return "[color=red][b]" + this.hit.join("\n") + "[/b][/color]\n";
    }

    getHint() {
        return "[color=cyan]" + this.hint.join("\n") + "[/color]\n";
    }

    getSpecial() {
        return "[color=red]" + this.special.join("\n") + "[/color]\n";
    }

    getStatus(){
        return this.status.join("\n");
    }

    getInfo(){
        return this.info.join("\n");
    }

    getError() {
        return "[color=red][b]" + this.error.join("\n") + "[/b][/color]";
    }

    addAction(line) {
        if (typeof line === "string") this.action.push(line);
    }

    addHit(line) {
        if (typeof line === "string") this.hit.push(line);
    }

    addHint(line) {
        if (typeof line === "string") this.hint.push(line);
    }

    addStatus(line) {
        if (typeof line === "string") this.status.push(line);
    }

    addInfo(line){
        if (typeof line === "string") this.info.push(line);
    }

    addError(line){
        if (typeof line === "string") this.error.push(line);
    }

    addSpecial(line){
        if (typeof line === "string") this.special.push(line);
    }


    getMessage() {
        let lines = [];

        if (this.info.length) lines.push(this.getInfo());
        if (this.action.length) lines.push(this.getAction());
        if (this.hit.length) lines.push(this.getHit());
        if (this.status.length) lines.push(this.getStatus());
        if (this.hint.length) lines.push(this.getHint());
        if (this.special.length) lines.push(this.getSpecial());
        if (this.error.length) lines.push(this.getError());

        return lines.join("\n");
    }

    send() {
        let message = this.getMessage();
        this.lastMessage = message;
        this.fChatLib.sendMessage(message, this.channel);
        this.clear();
    }

    resend() {
        this.fChatLib.sendMessage(this.lastMessage, this.channel);
    }
}
