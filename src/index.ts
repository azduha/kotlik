import { createServer } from "./lib";
import * as _IAbstractState from "./lib/types/IAbstractState";
import * as _IHandler from "./lib/types/IHandler";
import * as _IModules from "./lib/types/IModules";
import * as _IServer from "./lib/types/IServer";
import * as _IServerConfiguration from "./lib/types/IServerConfiguration";

export default {
    createServer,
    ..._IAbstractState,
    ..._IHandler,
    ..._IModules,
    ..._IServer,
    ..._IServerConfiguration,
};
