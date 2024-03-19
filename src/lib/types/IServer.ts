import { Express } from 'express';
import { Connection } from 'mysql2/promise';

export type IServer = {
    mysql: Connection;
    app: Express;
};
