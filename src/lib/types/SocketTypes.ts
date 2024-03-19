export type ISocketMessages<AppState> = {
    login_failure: {};

    message: string;
    status: IAppState<AppState>;

    admin_status: IAdminAppState;
};

export interface IEvent {
    id: number;
    checkpoint: string;
    teamId: number;
    eventType: string;
    timestamp: string;
}

export interface ITeam {
    id: number;
    name: string;
    appState: string;
    teamState: string;
}

export interface IMessage {
    timestamp: string;
    message: string;
    type: string;
    id: number;
}

export type IAppState<AppState> = {
    teamName: string;
    messages: IMessage[];
    state: AppState;
};

export type IAdminAppState = {
    events: IEvent[];
    teams: ITeam[];
    messages: IMessage[];
    info: any;
};

export type IServerResponse<T> = {
    type: string;
    content: T;
};

export type IClientRequest<T> = {
    code: number;
    content: T;
};

export type IAdminRequest<T> = {
    code: string;
    content: T;
};
