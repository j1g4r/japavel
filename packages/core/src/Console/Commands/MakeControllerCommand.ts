import { Command } from '../Command.js';
import * as fs from 'fs';
import * as path from 'path';

export class MakeControllerCommand extends Command {
    signature = 'make:controller <name>';
    description = 'Create a new controller class';

    async handle(args: any[], options: any): Promise<void> {
        const [name] = args;
        console.log(`Creating controller: ${name}`);

        const className = name;
        const content = `import { Request, Response } from 'express';
import { Controller } from './Controller';

export class ${className} extends Controller {
    static async index(req: Request, res: Response) {
        return res.json({ message: '${className} index' });
    }
}
`;

        // Assuming running from project root
        const targetDir = path.resolve(process.cwd(), 'packages/backend/src/Http/Controllers');
        const targetFile = path.join(targetDir, `${className}.ts`);

        if (!fs.existsSync(targetDir)) {
            console.error(`Target directory does not exist: ${targetDir}`);
            return;
        }

        if (fs.existsSync(targetFile)) {
            console.error(`Controller already exists: ${targetFile}`);
            return;
        }

        fs.writeFileSync(targetFile, content);
        console.log(`Controller created successfully at ${targetFile}`);
    }
}
