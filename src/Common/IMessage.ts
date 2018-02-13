import {IFChatLib} from "./IFChatLib";

export interface IMessage {
    fChatLib:IFChatLib;
    channel:string;
    action: Array<string>;
    hit: Array<string>;
    status: Array<string>;
    hint: Array<string>;
    special: Array<string>;
    info: Array<string>;
    error: Array<string>;
    lastMessage: string;
}