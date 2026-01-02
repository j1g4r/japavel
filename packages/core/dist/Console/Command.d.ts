import { Command as CommanderCommand } from 'commander';
export declare abstract class Command {
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
    register(program: CommanderCommand): void;
}
//# sourceMappingURL=Command.d.ts.map