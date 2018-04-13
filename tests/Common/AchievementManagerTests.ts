import {AchievementManager} from "../../src/Common/Achievements/AchievementManager";
import {BaseFighterState} from "../../src/Common/Fight/BaseFighterState";
import {BaseFight} from "../../src/Common/Fight/BaseFight";
import {TestFighter} from "./TestClasses/TestFighter";
import {TestFeatureFactory} from "./TestClasses/TestFeatureFactory";
import {BaseAchievement} from "../../src/Common/Achievements/BaseAchievement";
import {BaseUser} from "../../src/Common/Fight/BaseUser";
import {TestUser} from "./TestClasses/TestUser";

let Jasmine = require('jasmine');
let jasmine = new Jasmine();

let testFighterName = "TestFighter #1";
let testDescription = "Example Achievement Granted";
let achievementShortName = "Example";
let achievementName = "Example Achievement";
let reward = 10;

class ExampleAchievement extends BaseAchievement{

    meetsRequirements(fighter: BaseUser, BaseActiveFighter?: BaseFighterState, fight?: BaseFight<BaseFighterState>): boolean {
        let flag = false;
        if(fighter != null){
            flag = (fighter.name == testFighterName);
        }
        return flag;
    }

    getDetailedDescription(): string {
        return testDescription;
    }

    getReward(): number {
        return reward;
    }

    getUniqueShortName(): string {
        return achievementShortName;
    }

    getName():string{
        return achievementName;
    }
}

describe("The AchievementManager", () => {
    beforeEach(function () {
        AchievementManager.EnabledAchievements = [];
    });

    it("'s EnabledAchievements list should be empty", function () {
        expect(AchievementManager.getAll().length).toBe(0);
    });

    it("'s EnabledAchievements list should contain one null achievement", function () {
        AchievementManager.EnabledAchievements.push(null);
        expect(AchievementManager.getAll().length).toBe(1);
    });

    it("'s EnabledAchievements list should be empty again, to make sure it resets correctly", function () {
        expect(AchievementManager.getAll().length).toBe(0);
    });

    it("should grant the ExampleAchievement to the test user", async function () {
        AchievementManager.EnabledAchievements.push(new ExampleAchievement());
        let fighter = new TestUser(testFighterName, new TestFeatureFactory());
        await AchievementManager.checkAll(fighter, null);
        expect(fighter.achievements.length).toBe(1);
    });

    it("should say that it granted the ExampleAchievement", async function () {
        AchievementManager.EnabledAchievements.push(new ExampleAchievement());
        let fighter = new TestUser(testFighterName, new TestFeatureFactory());
        let result = await AchievementManager.checkAll(fighter, null);
        expect(result.length).toBe(1);
        expect(result[0]).toContain(testDescription);
    });
});

jasmine.execute();