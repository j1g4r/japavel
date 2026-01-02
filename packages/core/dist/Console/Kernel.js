import { Command as CommanderCommand } from 'commander';
export class Kernel {
    program;
    commands = [];
    constructor() {
        this.program = new CommanderCommand();
        this.program
            .name('japavel')
            .description('Japavel Framework CLI')
            .version('0.0.1');
    }
    register(command) {
        this.commands.push(command);
        command.register(this.program);
    }
    handle(argv) {
        this.program.parse(argv);
    }
}
