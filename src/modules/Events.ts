import moment from "moment";
import { IEvent } from "../types/IEvent";
import { IMessage } from "../types/IMessage";
import { IServer } from "../types/IServer";
import { ITeam } from "../types/ITeam";
import { AbstractModule } from "./_AbstractModule";

export class Events extends AbstractModule {
    public constructor(server: IServer) {
        super(server);
    }

    public async getAll(team: ITeam) {
        return (
            await this.server.mysql.execute<IEvent[]>(
                `SELECT * FROM \`events\` WHERE teamId = '${team.id}'`
            )
        )[0];
    }

    public async getAllFromEvery() {
        return (
            await this.server.mysql.execute<IEvent[]>(
                `SELECT * FROM \`events\``
            )
        )[0];
    }

    public team = (team: ITeam) => ({
        log: async (checkpoint: string, eventType: string) => {
            this.server.mysql.execute<IMessage[]>(
                `INSERT INTO \`events\`(teamId, timestamp, checkpoint, eventType) VALUES (?, ?, ?, ?)`,
                [team.id, moment().toISOString(), checkpoint, eventType]
            );
        },
    });
}
