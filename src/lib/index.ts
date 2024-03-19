import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { createConnection } from "mysql2/promise";
import { MigrationsManager } from "./MigrationsManager";
import { adminHandler } from "./mechanics/adminHandler";
import { playerHandler } from "./mechanics/playerHandler";
import { createTeams } from "./migrations/01_createTeams";
import { createMessages } from "./migrations/02_createMessages";
import { createEvents } from "./migrations/03_createEvents";
import { createScheduled } from "./migrations/04_createScheduled";
import { Events } from "./modules/Events";
import { Messenger } from "./modules/Messenger";
import { Scheduler } from "./modules/Scheduler";
import { State } from "./modules/State";
import { IAbstractState } from "./types/IAbstractState";
import { IModules } from "./types/IModules";
import { IServer } from "./types/IServer";
import { IServerConfiguration } from "./types/IServerConfiguration";

export async function createServer<
    TeamState extends IAbstractState,
    AppState extends IAbstractState
>(configuration: IServerConfiguration<TeamState, AppState>) {
    // Create the Express app
    const app: Express = express();
    app.setMaxListeners(0);
    var jsonParser = bodyParser.json();
    app.use(cors());
    app.use(jsonParser);

    // Connect the Mysql
    const mysql = await createConnection(configuration.sql);

    // Migrate the database
    const mm = new MigrationsManager(mysql, {
        1: createTeams,
        2: createMessages,
        3: createEvents,
        4: createScheduled,
    });
    await mm.migrate();

    const server: IServer = {
        app,
        mysql,
    };

    // Setup the modules
    const modules: IModules<TeamState, AppState> = {
        messenger: new Messenger(server),
        scheduler: new Scheduler(server),
        checkpoints: new Events(server),
        state: new State(server),
    };

    // Setup the handlers
    playerHandler(server, modules, configuration.handlers);
    adminHandler(server, modules, configuration);

    // Serve the static files
    app.use("/", express.static("web"));
    app.use("/admin", express.static("dashboard"));
    app.get("/api", (_, res) => res.send("Server UP!"));

    // Start the Express app
    app.listen(configuration.port, async () => {
        configuration.onCreated && (await configuration.onCreated(server));

        // Set default states to all teams, that have no state
        await mysql.execute(
            "UPDATE `teams` SET appState = ? WHERE appState is NULL",
            [JSON.stringify(configuration.defaultAppState)]
        );
        await mysql.execute(
            "UPDATE `teams` SET teamState = ? WHERE teamState is NULL",
            [JSON.stringify(configuration.defaultTeamState)]
        );
    });
}
