import { RowDataPacket } from 'mysql2/promise';

export interface IScheduled extends RowDataPacket {
    id: number;
    teamId: number;
    identifier: string;
    callback: string;
    executeAt: string;
    queued: number;
}
