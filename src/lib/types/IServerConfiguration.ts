import { ConnectionOptions } from 'mysql2/promise';
import { IAbstractState } from './IAbstractState';
import { IHandlers } from './IHandler';
import { IServer } from './IServer';

export interface IServerConfiguration<TeamState extends IAbstractState, AppState extends IAbstractState> {
    port: number;
    sql: ConnectionOptions;
    handlers: IHandlers<TeamState, AppState>;
    dashboard: {
        password: string;
    };
    onCreated?: (server: IServer) => any;
    defaultTeamState: TeamState;
    defaultAppState: AppState;
    additionalAdminInfo?: any;
}
