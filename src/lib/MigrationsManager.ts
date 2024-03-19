import { Connection } from "mysql2/promise";

export class MigrationsManager {
    private migrations: Migrations;
    private mysql: Connection;

    constructor(mysql: Connection, migrations: Migrations) {
        this.mysql = mysql;
        this.migrations = migrations;
    }

    public async migrate() {
        let currentVersion = 0;
        try {
            const [rows] = await this.mysql.execute(
                "SELECT version FROM _migrations"
            );
            currentVersion = (rows as any)[0].version;
        } catch {
            await this.mysql.execute("CREATE TABLE _migrations (version int)");
            await this.mysql.execute(
                "INSERT INTO _migrations(version) VALUES (0)"
            );
        }

        const migrations = (
            Object.entries(this.migrations) as any as [number, Migration][]
        ).sort(([a], [b]) => a - b);

        for (let i = 0; i < migrations.length; i++) {
            const [version, migration] = migrations[i];

            if (currentVersion >= version) {
                continue;
            }

            let result;
            try {
                result = await migration(this.mysql);
            } catch (e) {
                console.error(e);
                result = false;
            }

            if (!result) {
                console.error(`Migration to version ${version} failed!`);
                return false;
            }

            currentVersion = version;
            await this.mysql.execute(
                `UPDATE _migrations SET version = ${currentVersion}`
            );
            console.log(`Successfully migrated to version ${currentVersion}`);
        }

        return true;
    }
}

export type Migration = (mysql: Connection) => Promise<boolean>;
export type Migrations = { [key: number]: Migration };
