import { IAbstractState } from '../types/IAbstractState';
import { IHandlers } from '../types/IHandler';
import { IModulesTeam } from '../types/IModules';
import { IServer } from '../types/IServer';
import { ITeam } from '../types/ITeam';

export async function runHandler<TeamState extends IAbstractState, AppState extends IAbstractState>(
    message: string,
    team: ITeam,
    server: IServer,
    modulesPublic: IModulesTeam<TeamState, AppState>,
    handlers: IHandlers<TeamState, AppState>,
    fallbackToDefault?: boolean,
): Promise<string> {
    const keys = Object.keys(handlers);

    let teamState = JSON.parse(team.teamState) as TeamState;

    if (keys.includes(message)) {
        teamState = await handlers[message](teamState, modulesPublic, server);
    } else if (fallbackToDefault) {
        teamState = await handleDefault(team, server, modulesPublic, handlers);
    }

    const stringified = JSON.stringify(teamState);
    server.mysql.execute(`UPDATE \`teams\` SET teamState = ? WHERE id = ${team.id}`, [stringified]);
    return stringified;
}

export async function handleDefault<TeamState extends IAbstractState, AppState extends IAbstractState>(
    team: ITeam,
    server: IServer,
    modulesPublic: IModulesTeam<TeamState, AppState>,
    handlers: IHandlers<TeamState, AppState>,
) {
    const keys = Object.keys(handlers);

    let result = JSON.parse(team.teamState) as TeamState;

    if (keys.includes('_default')) {
        return await handlers['_default'](result, modulesPublic, server);
    } else {
        await modulesPublic.messenger.message('server', 'Zadaný kód nebyl přijat!');
        return result;
    }
}
