import { RowDataPacket } from 'mysql2/promise';

export interface ITeam extends RowDataPacket {
    id: number;
    key: number;
    name: string;
    teamState: string;
    appState: string;
}
