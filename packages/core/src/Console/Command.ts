import { Command as CommanderCommand } from 'commander';

export abstract class Command {
    /**
     * The name and signature of the console command.
     */
    abstract signature: string;

    /**
     * The console command description.
     */
    abstract description: string;

    /**
     * Execute the console command.
     */
    abstract handle(args: any, options: any): Promise<void>;

    /**
     * Register the command with the Commander program.
     */
    public register(program: CommanderCommand) {
        program
            .command(this.signature)
            .description(this.description)
            .action(async (...args: any[]) => {
                // Commander passes arguments then options then command object
                // We simplify this for the handle method
                const commandObj = args.pop();
                const options = args.pop();
                const inputArgs = args; 
                
                await this.handle(inputArgs, options);
            });
    }
}
