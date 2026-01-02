import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function newCommand(projectName: string) {
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
    process.exit(1);
  }

  console.log(chalk.blue(`\nCreating a new Japavel project in ${chalk.bold(targetDir)}...\n`));

  // In a real scenario, we might ask for template selection
  // const { template } = await inquirer.prompt([
  //   {
  //     type: 'list',
  //     name: 'template',
  //     message: 'Select a template:',
  //     choices: ['default'],
  //   },
  // ]);

  const templateDir = path.resolve(__dirname, '../templates/default');

  if (!fs.existsSync(templateDir)) {
      console.error(chalk.red(`Error: Template not found at ${templateDir}`));
      process.exit(1);
  }

  try {
    await fs.copy(templateDir, targetDir);

    // Update package.json name
    const packageJsonPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const pkg = await fs.readJson(packageJsonPath);
      pkg.name = projectName;
      await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
    }

    console.log(chalk.green(`\nSuccess! Created ${projectName} at ${targetDir}\n`));
    console.log('Inside that directory, you can run:\n');
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm install`));
    console.log(chalk.cyan(`  npm run dev`));
    console.log('\nHappy coding!\n');

  } catch (err) {
    console.error(chalk.red('Error creating project:'), err);
    process.exit(1);
  }
}
