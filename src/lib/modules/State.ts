import { IAbstractState } from "../types/IAbstractState";
import { IServer } from "../types/IServer";
import { ITeam } from "../types/ITeam";
import { AbstractModule } from "./_AbstractModule";

export class State<AppState extends IAbstractState> extends AbstractModule {
    public constructor(server: IServer) {
        super(server);
    }

    public async get(team: ITeam) {
        const [teamUpdated] = await this.server.mysql.query<ITeam[]>(
            `SELECT appState FROM teams WHERE id = ?`,
            [team.id]
        );

        return JSON.parse(teamUpdated[0].appState);
    }

    public async set(team: ITeam, state: Partial<AppState>) {
        const oldState = await this.get(team);

        await this.server.mysql.execute(
            `UPDATE \`teams\` SET appState = ? WHERE id = ${team.id}`,
            [JSON.stringify({ ...oldState, ...state })]
        );
    }

    public async transform(
        team: ITeam,
        transformer: (oldState: AppState) => Partial<AppState>
    ) {
        const oldState = await this.get(team);

        await this.server.mysql.execute(
            `UPDATE \`teams\` SET appState = ? WHERE id = ${team.id}`,
            [JSON.stringify(transformer(oldState))]
        );
    }

    public team = (team: ITeam) => ({
        get: () => {
            return this.get(team);
        },
        set: async (state: Partial<AppState>) => {
            return this.set(team, state);
        },
        transform: async (
            transformer: (oldState: AppState) => Partial<AppState>
        ) => {
            return this.transform(team, transformer);
        },
    });
}
