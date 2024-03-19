import { RequestHandler, Response } from "express";
import { IAbstractState } from "../types/IAbstractState";
import { IModules } from "../types/IModules";
import { IServer } from "../types/IServer";
import { IServerConfiguration } from "../types/IServerConfiguration";
import { ITeam } from "../types/ITeam";
import {
    IAdminRequest,
    IServerResponse,
    ISocketMessages,
} from "../types/SocketTypes";

export const adminHandler = async <
    TeamState extends IAbstractState,
    AppState extends IAbstractState
>(
    server: IServer,
    modules: IModules<TeamState, AppState>,
    configuration: IServerConfiguration<TeamState, AppState>
) => {
    const sendError = (res: Response, type: string) => {
        res.send({
            type,
            content: null,
        } as IServerResponse<null>);
    };

    const statusHandler: RequestHandler = async (req, res) => {
        try {
            const body = req.body as IAdminRequest<{}>;

            if (body.code !== configuration.dashboard.password) {
                sendError(res, "login_failure");
                return;
            }

            const teams = (
                await server.mysql.query<ITeam[]>(`SELECT * FROM teams`)
            )[0];
            const events = (
                await server.mysql.query<any[]>(`SELECT * FROM events`)
            )[0];
            const messages = (
                await server.mysql.query<any[]>(`SELECT * FROM messages`)
            )[0];

            res.send({
                type: "admin_status",
                content: {
                    teams: teams as any,
                    events,
                    messages,
                    info: configuration.additionalAdminInfo,
                },
            } as IServerResponse<ISocketMessages<AppState>["admin_status"]>);
        } catch (e) {
            sendError(res, "invalid_request");
        }
    };
    server.app.post("/api/admin/status", statusHandler);

    const messageHandler: RequestHandler = async (req, res) => {
        try {
            const body = req.body as IAdminRequest<{
                message: string;
                type: string;
            }>;

            if (body.code !== configuration.dashboard.password) {
                sendError(res, "login_failure");
                return;
            }

            const message = body.content.message;
            const type = body.content.type;

            modules.messenger.broadcast(type, message);
        } catch (e) {
            sendError(res, "invalid_request");
        }
    };
    server.app.post("/api/admin/message", messageHandler);
};
