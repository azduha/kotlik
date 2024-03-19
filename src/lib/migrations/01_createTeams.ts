import { Connection } from 'mysql2/promise';
import { Migration } from '../MigrationsManager';

export const createTeams: Migration = async (mysql: Connection) => {
    await mysql.execute(`
        CREATE TABLE \`teams\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`key\` INT NOT NULL,
            \`name\` VARCHAR(256) NOT NULL,
            \`teamState\` TEXT NULL,
            \`appState\` TEXT NULL,
        PRIMARY KEY (\`id\`));`);

    return true;
};
