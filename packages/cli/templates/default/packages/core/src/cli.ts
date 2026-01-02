#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { parseDSL } from './generator/parser';
import { generateAll } from './generator/transformer';

const program = new Command();

program
  .name('japavel')
  .description('Japavel Framework CLI')
  .version('0.0.1');

program
  .command('generate')
  .argument('<file>', 'Path to DSL definition file (.yaml, .yml, .japavel)')
  .description('Generate code from DSL definition')
  .action((file) => {
    try {
      const fullPath = path.resolve(process.cwd(), file);
      if (!fs.existsSync(fullPath)) {
        console.error(chalk.red(`Error: File not found at ${fullPath}`));
        process.exit(1);
      }

      console.log(chalk.blue(`Parsing ${file}...`));
      const schema = parseDSL(fullPath);
      const modelName = schema.Model;
      const kebabName = modelName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

      console.log(chalk.green(`✓ Validated schema for model: ${modelName}`));

      const code = generateAll(schema);

      // Define Paths
      const rootDir = process.cwd();
      const contractsDir = path.join(rootDir, 'packages/contracts/src/schemas');
      const backendDir = path.join(rootDir, 'packages/backend/src/routers');
      const frontendDir = path.join(rootDir, 'packages/frontend/src/features', kebabName);
      const prismaFile = path.join(rootDir, 'packages/backend/prisma/schema.prisma');
      const contractsIndexFile = path.join(rootDir, 'packages/contracts/src/index.ts');

      // 1. Write Zod Schema (Contracts)
      ensureDir(contractsDir);
      const contractPath = path.join(contractsDir, `${kebabName}.ts`);
      fs.writeFileSync(contractPath, code.zodSchema);
      console.log(chalk.cyan(`✓ Created contract: ${contractPath}`));

      // Update Contracts Index
      if (fs.existsSync(contractsIndexFile)) {
        const indexContent = fs.readFileSync(contractsIndexFile, 'utf8');
        const exportStatement = `export * from './schemas/${kebabName}';`;
        if (!indexContent.includes(exportStatement)) {
          fs.appendFileSync(contractsIndexFile, `\n${exportStatement}`);
          console.log(chalk.cyan(`✓ Updated contracts index`));
        }
      }

      // 2. Write tRPC Router (Backend)
      ensureDir(backendDir);
      const routerPath = path.join(backendDir, `${kebabName}.ts`);
      fs.writeFileSync(routerPath, code.trpcRouter);
      console.log(chalk.cyan(`✓ Created router: ${routerPath}`));

      // 3. Update Prisma Schema
      if (fs.existsSync(prismaFile)) {
        const prismaContent = fs.readFileSync(prismaFile, 'utf8');
        if (!prismaContent.includes(`model ${modelName}`)) {
          fs.appendFileSync(prismaFile, `\n${code.prismaModel}`);
          console.log(chalk.cyan(`✓ Appended to Prisma schema`));
        } else {
          console.log(chalk.yellow(`! Prisma model ${modelName} already exists, skipping append`));
        }
      } else {
        console.warn(chalk.yellow(`! Prisma schema not found at ${prismaFile}`));
      }

      // 4. Write Frontend Components
      ensureDir(frontendDir);
      const componentPath = path.join(frontendDir, `${modelName}.tsx`);
      fs.writeFileSync(componentPath, code.reactComponent);
      console.log(chalk.cyan(`✓ Created React components: ${componentPath}`));

      console.log(chalk.green(`\nSuccessfully generated resources for ${modelName}!`));
      console.log(chalk.gray(`Don't forget to register the router in packages/backend/src/routers/app.ts`));

    } catch (error) {
      console.error(chalk.red('Generation failed:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
