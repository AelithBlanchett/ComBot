import {GameSettings} from "../Configuration/GameSettings";


//TODO: use knex to create tables on the fly
export class SQL {
    public static fightTableName: string = GameSettings.pluginName + "_fights";
    public static fightFightersTableName: string = GameSettings.pluginName + "_fightfighters";
    public static fightersFeaturesTableName: string = GameSettings.pluginName + "_fighters_features";
    public static fightersAchievementsTableName: string = GameSettings.pluginName + "_fighters_achievements";
    public static fightersTransactionsTableName: string = GameSettings.pluginName + "_fighters_transactions";
    public static fightersTableName: string = GameSettings.pluginName + "_fighters";
    public static fightersViewName: string = GameSettings.pluginName + "_v_fighters";
    public static actionTableName: string = GameSettings.pluginName + "_actions";
    public static activeFightersTableName: string = GameSettings.pluginName + "_activefighters";
    public static constantsTableName: string = GameSettings.pluginName + "_constants";
    public static modifiersTableName: string = GameSettings.pluginName + "_modifiers";
    public static currentSeasonKeyName: string = "currentSeason";
}