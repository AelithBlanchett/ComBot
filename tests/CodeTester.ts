import {createConnection} from "typeorm";
import {RWFighterState} from "../src/FightSystem/Fight/RWFighterState";
import {TestFeatureFactory} from "./Common/TestClasses/TestFeatureFactory";
import {RWFight} from "../src/FightSystem/Fight/RWFight";
import {RWUser} from "../src/FightSystem/Fight/RWUser";




try{
    createConnection().then(async connection => {

        let fighter = new RWFighterState(new RWFight(), new RWUser("", new TestFeatureFactory()));

        await connection.manager.save(fighter);
        console.log("user has been saved");

    }).catch(error => console.log(error));
}
catch(ex){
    throw ex;
}
