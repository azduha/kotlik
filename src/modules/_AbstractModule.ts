import { IAbstractState } from "../types/IAbstractState";
import { IModules, IModulesTeam } from "../types/IModules";
import { IServer } from "../types/IServer";
import { ITeam } from "../types/ITeam";

export abstract class AbstractModule {
    protected server: IServer;

    public constructor(server: IServer) {
        this.server = server;
    }

    public abstract team: (team: ITeam) => {
        [key: string]: (...params: any) => any;
    };
}

export function getTeamModules<
    TeamState extends IAbstractState,
    AppState extends IAbstractState
>(team: ITeam, modules: IModules<TeamState, AppState>) {
    return Object.entries(modules).reduce(
        (prev, [key, value]) => ({ ...prev, [key]: value.team(team) }),
        {}
    ) as IModulesTeam<TeamState, AppState>;
}
