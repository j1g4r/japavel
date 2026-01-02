#!/usr/bin/env node

import { cac } from 'cac';
import { newCommand } from './commands/new';
import { version } from '../package.json';

const cli = cac('japavel');

cli
  .command('new <project-name>', 'Create a new Japavel project')
  .action((projectName) => {
    newCommand(projectName);
  });

cli.help();
cli.version(version);

cli.parse();
