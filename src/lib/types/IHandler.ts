import { IAbstractState } from './IAbstractState';
import { IModulesTeam } from './IModules';
import { IServer } from './IServer';

export type IHandler<TeamState extends IAbstractState, AppState extends IAbstractState> = (
    state: TeamState,
    modules: IModulesTeam<TeamState, AppState>,
    server: IServer,
) => TeamState | Promise<TeamState>;

export type IHandlers<TeamState extends IAbstractState, AppState extends IAbstractState> = {
    [key: string]: IHandler<TeamState, AppState>;
};
