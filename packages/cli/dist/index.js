#!/usr/bin/env node

// src/index.ts
import { cac } from "cac";

// src/commands/new.ts
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function newCommand(projectName) {
  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
    process.exit(1);
  }
  console.log(chalk.blue(`
Creating a new Japavel project in ${chalk.bold(targetDir)}...
`));
  const templateDir = path.resolve(__dirname, "../templates/default");
  if (!fs.existsSync(templateDir)) {
    console.error(chalk.red(`Error: Template not found at ${templateDir}`));
    process.exit(1);
  }
  try {
    await fs.copy(templateDir, targetDir);
    const packageJsonPath = path.join(targetDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkg = await fs.readJson(packageJsonPath);
      pkg.name = projectName;
      await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
    }
    console.log(chalk.green(`
Success! Created ${projectName} at ${targetDir}
`));
    console.log("Inside that directory, you can run:\n");
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm install`));
    console.log(chalk.cyan(`  npm run dev`));
    console.log("\nHappy coding!\n");
  } catch (err) {
    console.error(chalk.red("Error creating project:"), err);
    process.exit(1);
  }
}

// package.json
var version = "0.0.1";

// src/index.ts
var cli = cac("japavel");
cli.command("new <project-name>", "Create a new Japavel project").action((projectName) => {
  newCommand(projectName);
});
cli.help();
cli.version(version);
cli.parse();
//# sourceMappingURL=index.js.map