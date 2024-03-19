import { RequestHandler, Response } from "express";
import moment from "moment";
import removeAccents from "remove-accents";
import { getTeamModules } from "../modules/_AbstractModule";
import { IAbstractState } from "../types/IAbstractState";
import { IHandlers } from "../types/IHandler";
import { IModules } from "../types/IModules";
import { IServer } from "../types/IServer";
import { ITeam } from "../types/ITeam";
import {
    IClientRequest,
    IServerResponse,
    ISocketMessages,
} from "../types/SocketTypes";
import { handleDefault, runHandler } from "./runHandler";

export const playerHandler = async <
    TeamState extends IAbstractState,
    AppState extends IAbstractState
>(
    server: IServer,
    modules: IModules<TeamState, AppState>,
    handlers: IHandlers<TeamState, AppState>
) => {
    // Schedule the scheduler
    setInterval(
        async () => await modules.scheduler.execute(handlers, modules),
        10000
    );

    // Utility functions
    const sendError = (res: Response, type: string) => {
        res.send({
            type,
            content: null,
        } as IServerResponse<null>);
    };

    const sendStatus = async (team: ITeam, res: Response) => {
        // Get the messages
        const messages = await modules.messenger.getAll(team);

        // Get the appState
        const state = await modules.state.get(team);

        res.send({
            type: "status",
            content: {
                messages: messages.map((message) => ({
                    message: message.message,
                    timestamp: message.timestamp,
                    type: message.type,
                    id: message.id,
                })),
                state,
                teamName: team.name,
            },
        } as IServerResponse<ISocketMessages<AppState>["status"]>);
    };

    const getTeamLogin = async (code: number, res: Response) => {
        if (!code) {
            sendError(res, "login_failure");
            return null;
        }

        const [rows] = await server.mysql.query<ITeam[]>(
            `SELECT * FROM teams WHERE \`key\` = ?`,
            [code]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            sendError(res, "login_failure");
            return null;
        }
    };

    // Set the handlers
    const messageHandler: RequestHandler = async (req, res) => {
        try {
            const body = req.body as IClientRequest<
                ISocketMessages<AppState>["message"]
            >;
            const team = await getTeamLogin(body?.code, res);

            if (!team) {
                return;
            }

            const teamModules = getTeamModules(team, modules);

            // Save the prompt
            await server.mysql.execute(
                "INSERT INTO `prompts`(teamId, timestamp, prompt) VALUES (?, ?, ?)",
                [team.id, moment().toISOString(), body.content]
            );

            if (!body.content.startsWith("$")) {
                teamModules.messenger.message("client", body.content);
            }

            if (body.content.startsWith("_")) {
                await handleDefault(team, server, teamModules, handlers);
            } else {
                const stripped = removeAccents(body.content)
                    .toLowerCase()
                    .replaceAll(" ", "");
                team!.state = await runHandler(
                    stripped,
                    team,
                    server,
                    teamModules,
                    handlers,
                    true
                );
            }

            sendStatus(team, res);
        } catch (e) {
            sendError(res, "invalid_request");
        }
    };
    server.app.post("/api/message", messageHandler);

    const statusHandler: RequestHandler = async (req, res) => {
        try {
            const body = req.body as IClientRequest<{}>;
            const team = await getTeamLogin(body?.code, res);

            if (!team) {
                return;
            }

            sendStatus(team, res);
        } catch (e) {
            sendError(res, "invalid_request");
        }
    };
    server.app.post("/api/status", statusHandler);
};
