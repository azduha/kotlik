import dotenv from "dotenv";
import moment from "moment";
import "moment/locale/cs";
import { createServer } from "../src";
dotenv.config();

moment.locale("cs");

type TeamState = {};
type AppStateType = {};

const port = process.env.PORT as any as number;

createServer<TeamState, AppStateType>({
    port,
    sql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: (process.env.MYSQL_PORT as any) || 3306,
    },
    handlers: {},
    onCreated: async (server) => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    },
    dashboard: {
        password: process.env.ADMIN_PASSWORD!,
    },
    defaultTeamState: {},
    defaultAppState: {},
    additionalAdminInfo: {},
});
