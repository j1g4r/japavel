import { Command } from '../Command.js';
import * as fs from 'fs';
import * as path from 'path';

export class MakeComponentCommand extends Command {
    signature = 'make:component <name>';
    description = 'Create a new Vue 3 component';

    async handle(args: any[], options: any): Promise<void> {
        const [name] = args;
        console.log(`Creating component: ${name}`);

        const componentName = name;
        const content = `<script setup lang="ts">
// ${componentName} Logic
</script>

<template>
    <div>
        <!-- ${componentName} Template -->
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
            ${componentName}
        </h2>
    </div>
</template>
`;

        const targetDir = path.resolve(process.cwd(), 'packages/frontend/src/components');
        const targetFile = path.join(targetDir, `${componentName}.vue`);

        if (!fs.existsSync(targetDir)) {
            // Try to create it if strict check not passed, or just fail
            fs.mkdirSync(targetDir, { recursive: true });
        }

        if (fs.existsSync(targetFile)) {
            console.error(`Component already exists: ${targetFile}`);
            return;
        }

        fs.writeFileSync(targetFile, content);
        console.log(`Component created successfully at ${targetFile}`);
    }
}
