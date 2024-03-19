import { Connection } from 'mysql2/promise';
import { Migration } from '../MigrationsManager';

export const createEvents: Migration = async (mysql: Connection) => {
    await mysql.execute(`
        CREATE TABLE \`events\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`teamId\` INT NOT NULL,
            \`checkpoint\` VARCHAR(256) NOT NULL,
            \`eventType\` VARCHAR(256) NOT NULL,
            \`timestamp\` VARCHAR(256) NOT NULL,
        PRIMARY KEY (\`id\`));`);

    return true;
};
