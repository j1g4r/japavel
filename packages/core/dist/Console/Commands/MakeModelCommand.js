import { Command } from '../Command.js';
import * as fs from 'fs';
import * as path from 'path';
export class MakeModelCommand extends Command {
    signature = 'make:model <name>';
    description = 'Create a new model class using Prisma wrapper';
    async handle(args, options) {
        const [name] = args;
        console.log(`Creating model: ${name}`);
        const className = name;
        const content = `import { Model } from './Model';

export class ${className} extends Model {
    // Implement model specific logic wrappers
    static async all() {
        // Example: return this.db.${className.toLowerCase()}.findMany();
        // Note: Prisma client property names are usually lowercase/camelCase.
        // You might need to adjust this depending on usage.
        return []; 
    }
}
`;
        const targetDir = path.resolve(process.cwd(), 'packages/backend/src/Models');
        const targetFile = path.join(targetDir, `${className}.ts`);
        if (!fs.existsSync(targetDir)) {
            console.error(`Target directory does not exist: ${targetDir}`);
            return;
        }
        if (fs.existsSync(targetFile)) {
            console.error(`Model already exists: ${targetFile}`);
            return;
        }
        fs.writeFileSync(targetFile, content);
        console.log(`Model created successfully at ${targetFile}`);
    }
}
