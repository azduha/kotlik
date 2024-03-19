import { Connection } from 'mysql2/promise';
import { Migration } from '../MigrationsManager';

export const createScheduled: Migration = async (mysql: Connection) => {
    await mysql.execute(`
        CREATE TABLE \`scheduled\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`teamId\` INT NOT NULL,
            \`identifier\` VARCHAR(256) NOT NULL,
            \`callback\` VARCHAR(256) NOT NULL,
            \`executeAt\` VARCHAR(256) NOT NULL,
            \`queued\` TINYINT(1) NOT NULL,
        PRIMARY KEY (\`id\`));`);

    return true;
};
