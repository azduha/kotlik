import { RowDataPacket } from 'mysql2/promise';

export interface IEvent extends RowDataPacket {
    id: number;
    checkpoint: string;
    teamId: number;
    timestamp: string;
}
