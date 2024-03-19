import moment from "moment";
import { IMessage } from "../types/IMessage";
import { IServer } from "../types/IServer";
import { ITeam } from "../types/ITeam";
import { AbstractModule } from "./_AbstractModule";

export class Messenger extends AbstractModule {
    public constructor(server: IServer) {
        super(server);
    }

    private async send(team: ITeam, type: string, ...message: string[]) {
        const response = {
            date: moment().toISOString(),
            content: message.join("\n"),
        };
        await this.server.mysql.execute<IMessage[]>(
            `INSERT INTO \`messages\`(teamId, timestamp, message, type) VALUES (?, ?, ?, ?)`,
            [team.id, response.date, response.content, type]
        );
    }

    public async broadcast(type: string, ...message: string[]) {
        const teams = (
            await this.server.mysql.execute<ITeam[]>(`SELECT * FROM teams`)
        )[0];

        for (let i = 0; i < teams.length; i++) {
            this.send(teams[i], type, ...message);
        }
    }

    public async getAll(team: ITeam) {
        return (
            await this.server.mysql.execute<IMessage[]>(
                `SELECT * FROM \`messages\` WHERE teamId = '${team.id}'`
            )
        )[0];
    }

    public async getAllFromEvery() {
        return (
            await this.server.mysql.execute<IMessage[]>(
                `SELECT * FROM \`messages\``
            )
        )[0];
    }

    public team = (team: ITeam) => ({
        message: async (type: string, ...message: string[]) =>
            await this.send(team, type, ...message),
    });
}
