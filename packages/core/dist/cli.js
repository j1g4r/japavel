#!/usr/bin/env node
import { Kernel } from './Console/Kernel.js';
import { MakeControllerCommand } from './Console/Commands/MakeControllerCommand.js';
import { MakeModelCommand } from './Console/Commands/MakeModelCommand.js';
import { MakeComponentCommand } from './Console/Commands/MakeComponentCommand.js';
const kernel = new Kernel();
// Register Commands
kernel.register(new MakeControllerCommand());
kernel.register(new MakeModelCommand());
kernel.register(new MakeComponentCommand());
// Handle Input
kernel.handle(process.argv);
