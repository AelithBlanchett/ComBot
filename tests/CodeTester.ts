import {FighterRepository} from "../src/FightSystem/Repositories/FighterRepository";
import {GameSettings} from "../src/Common/Configuration/GameSettings";
import * as fs from "fs";

try{
    let stringified = JSON.stringify(GameSettings.getJsonOutput());
    console.log(stringified);
    // let js:GameSettings = JSON.parse(fs.readFileSync(__dirname + "/test.json.js", "utf8"));
    // console.log(JSON.stringify(js));
}
catch(ex){
    throw ex;
}
