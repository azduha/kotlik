import { Connection } from 'mysql2/promise';
import { Migration } from '../MigrationsManager';

export const createMessages: Migration = async (mysql: Connection) => {
    await mysql.execute(`
        CREATE TABLE \`messages\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`teamId\` INT NOT NULL,
            \`timestamp\` VARCHAR(256) NOT NULL,
            \`message\` TEXT NOT NULL,
            \`type\` VARCHAR(256) NOT NULL,
        PRIMARY KEY (\`id\`));`);

    await mysql.execute(`
        CREATE TABLE \`prompts\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`teamId\` INT NOT NULL,
            \`timestamp\` VARCHAR(256) NOT NULL,
            \`prompt\` TEXT NOT NULL,
        PRIMARY KEY (\`id\`));`);

    return true;
};
