import moment, { Moment } from "moment";
import { runHandler } from "../mechanics/runHandler";
import { IAbstractState } from "../types/IAbstractState";
import { IHandlers } from "../types/IHandler";
import { IModules } from "../types/IModules";
import { IScheduled } from "../types/IScheduled";
import { IServer } from "../types/IServer";
import { ITeam } from "../types/ITeam";
import { AbstractModule, getTeamModules } from "./_AbstractModule";

export class Scheduler<
    TeamState extends IAbstractState,
    AppState extends IAbstractState
> extends AbstractModule {
    public constructor(server: IServer) {
        super(server);
    }

    public async scheduleAtForEveryone(
        callback: string,
        moment: Moment,
        identifier: string
    ) {
        this.server.mysql.execute(
            `INSERT INTO \`scheduled\`(teamId, identifier, callback, executeAt, queued) VALUES (?, ?, ?, ?, 1)`,
            [-1, identifier, callback, moment.toISOString()]
        );
    }

    public async execute(
        handlers: IHandlers<TeamState, AppState>,
        modules: IModules<TeamState, AppState>
    ) {
        const scheduled = (
            await this.server.mysql.execute<IScheduled[]>(
                `SELECT * FROM scheduled WHERE queued = 1`
            )
        )[0];
        const filtered = scheduled.filter((event) =>
            moment(event.executeAt).isBefore()
        );
        for (let i = 0; i < filtered.length; i++) {
            const event = filtered[i];
            let rows: ITeam[];
            if (event.teamId === -1) {
                rows = (
                    await this.server.mysql.query<ITeam[]>(
                        `SELECT * FROM teams`
                    )
                )[0];
            } else {
                rows = (
                    await this.server.mysql.query<ITeam[]>(
                        `SELECT * FROM teams WHERE \`id\` = ?`,
                        [event.teamId]
                    )
                )[0];
            }
            for (let j = 0; j < rows.length; j++) {
                const team = rows[j];
                team.state = await runHandler(
                    event.callback,
                    team,
                    this.server,
                    getTeamModules(team, modules),
                    handlers,
                    false
                );
                await this.server.mysql.execute(
                    `UPDATE scheduled SET queued = 0 WHERE id = ?`,
                    [event.id]
                );
            }
        }
    }

    public team = (team: ITeam) => ({
        scheduleIn: async (
            callback: string,
            ms: number,
            identifier: string
        ) => {
            await this.team(team).schedule(
                callback,
                moment().add(ms, "milliseconds"),
                identifier
            );
        },
        schedule: async (
            callback: string,
            moment: Moment,
            identifier: string
        ) => {
            await this.server.mysql.execute(
                `INSERT INTO \`scheduled\`(teamId, identifier, callback, executeAt, queued) VALUES (?, ?, ?, ?, 1)`,
                [team.id, identifier, callback, moment.toISOString()]
            );
        },
        scheduleForEveryone: async (
            callback: string,
            moment: Moment,
            identifier: string
        ) => {
            await this.scheduleAtForEveryone(callback, moment, identifier);
        },
        cancel: async (identifier?: string) => {
            if (identifier) {
                this.server.mysql.execute(
                    `UPDATE \`scheduled\` SET queued = 0 WHERE teamId = ? AND identifier = ?`,
                    [team.id, identifier]
                );
            } else {
                this.server.mysql.execute(
                    `UPDATE \`scheduled\` SET queued = 0 WHERE teamId = ?`,
                    [team.id]
                );
            }
        },
    });
}
