import { RowDataPacket } from 'mysql2/promise';

export interface IMessage extends RowDataPacket {
    id: number;
    teamId: number;
    timestamp: string;
    message: string;
}
