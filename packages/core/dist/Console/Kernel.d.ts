import { Command as BaseCommand } from './Command.js';
export declare class Kernel {
    private program;
    private commands;
    constructor();
    register(command: BaseCommand): void;
    handle(argv: string[]): void;
}
//# sourceMappingURL=Kernel.d.ts.map