import dotenv from "dotenv";
import moment from "moment";
import "moment/locale/cs";
import { createServer } from "../src/lib";
dotenv.config();

moment.locale("cs");

type TeamState = {
    pings: number;
};
type AppStateType = {};

createServer<TeamState, AppStateType>({
    port: (process.env.PORT as any) || 3000,
    sql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: (process.env.MYSQL_PORT as any) || 3306,
    },
    handlers: {
        ping: async (state, modules, server) => {
            await modules.messenger.message("server", "pong");

            return { ...state, pings: state.pings + 1 };
        },
    },
    onCreated: async (server) => {
        console.log(
            `[server]: Server is running at http://localhost:${
                (process.env.PORT as any) || 3000
            }`
        );
    },
    dashboard: {
        password: process.env.ADMIN_PASSWORD!,
    },
    defaultTeamState: {
        pings: 0,
    },
    defaultAppState: {},
    additionalAdminInfo: {},
});
