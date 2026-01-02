export class Command {
    /**
     * Register the command with the Commander program.
     */
    register(program) {
        program
            .command(this.signature)
            .description(this.description)
            .action(async (...args) => {
            // Commander passes arguments then options then command object
            // We simplify this for the handle method
            const commandObj = args.pop();
            const options = args.pop();
            const inputArgs = args;
            await this.handle(inputArgs, options);
        });
    }
}
