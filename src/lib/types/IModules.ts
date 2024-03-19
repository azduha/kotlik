import { Events } from "../modules/Events";
import { Messenger } from "../modules/Messenger";
import { Scheduler } from "../modules/Scheduler";
import { State } from "../modules/State";
import { IAbstractState } from "./IAbstractState";

export type IModules<
    TeamState extends IAbstractState,
    AppState extends IAbstractState
> = {
    messenger: Messenger;
    scheduler: Scheduler<TeamState, AppState>;
    checkpoints: Events;
    state: State<AppState>;
};

export type IModulesTeam<
    TeamState extends IAbstractState,
    AppState extends IAbstractState
> = {
    [Property in keyof IModules<TeamState, AppState>]: ReturnType<
        IModules<TeamState, AppState>[Property]["team"]
    >;
};
