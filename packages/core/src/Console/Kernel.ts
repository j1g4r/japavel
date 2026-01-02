import { Command as CommanderCommand } from 'commander';
import { Command as BaseCommand } from './Command.js';

export class Kernel {
    private program: CommanderCommand;
    private commands: BaseCommand[] = [];

    constructor() {
        this.program = new CommanderCommand();
        this.program
            .name('japavel')
            .description('Japavel Framework CLI')
            .version('0.0.1'); 
    }

    public register(command: BaseCommand) {
        this.commands.push(command);
        command.register(this.program);
    }

    public handle(argv: string[]) {
        this.program.parse(argv);
    }
}
