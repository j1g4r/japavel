import { z } from 'zod';
/**
 * Self-Healing Workflow Engine
 * Automatically detects and fixes common errors in the codebase
 */
export declare const WorkflowConfigSchema: z.ZodObject<{
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    projectRoot: z.ZodString;
    logPath: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodDefault<z.ZodBoolean>;
    fixStrategies: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type WorkflowConfig = z.infer<typeof WorkflowConfigSchema>;
export declare const ErrorSchema: z.ZodObject<{
    type: z.ZodEnum<{
        typescript: "typescript";
        eslint: "eslint";
        prisma: "prisma";
        runtime: "runtime";
        build: "build";
        test: "test";
    }>;
    message: z.ZodString;
    file: z.ZodOptional<z.ZodString>;
    line: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
    code: z.ZodOptional<z.ZodString>;
    suggestion: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkflowError = z.infer<typeof ErrorSchema>;
export declare const FixResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodObject<{
        type: z.ZodEnum<{
            typescript: "typescript";
            eslint: "eslint";
            prisma: "prisma";
            runtime: "runtime";
            build: "build";
            test: "test";
        }>;
        message: z.ZodString;
        file: z.ZodOptional<z.ZodString>;
        line: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
        code: z.ZodOptional<z.ZodString>;
        suggestion: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    fixApplied: z.ZodOptional<z.ZodString>;
    newContent: z.ZodOptional<z.ZodString>;
    requiresManualFix: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type FixResult = z.infer<typeof FixResultSchema>;
export declare const WorkflowResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    totalErrors: z.ZodNumber;
    fixedErrors: z.ZodNumber;
    remainingErrors: z.ZodNumber;
    attempts: z.ZodNumber;
    errors: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            typescript: "typescript";
            eslint: "eslint";
            prisma: "prisma";
            runtime: "runtime";
            build: "build";
            test: "test";
        }>;
        message: z.ZodString;
        file: z.ZodOptional<z.ZodString>;
        line: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
        code: z.ZodOptional<z.ZodString>;
        suggestion: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    fixes: z.ZodArray<z.ZodObject<{
        success: z.ZodBoolean;
        error: z.ZodObject<{
            type: z.ZodEnum<{
                typescript: "typescript";
                eslint: "eslint";
                prisma: "prisma";
                runtime: "runtime";
                build: "build";
                test: "test";
            }>;
            message: z.ZodString;
            file: z.ZodOptional<z.ZodString>;
            line: z.ZodOptional<z.ZodNumber>;
            column: z.ZodOptional<z.ZodNumber>;
            code: z.ZodOptional<z.ZodString>;
            suggestion: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        fixApplied: z.ZodOptional<z.ZodString>;
        newContent: z.ZodOptional<z.ZodString>;
        requiresManualFix: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    logs: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type WorkflowResult = z.infer<typeof WorkflowResultSchema>;
/**
 * Self-Healing Workflow Engine
 */
export declare class SelfHealingWorkflow {
    private config;
    private logs;
    constructor(config: Partial<WorkflowConfig> & {
        projectRoot: string;
    });
    /**
     * Run the self-healing workflow
     */
    run(): Promise<WorkflowResult>;
    /**
     * Detect all errors in the codebase
     */
    private detectErrors;
    /**
     * Run TypeScript compiler check
     */
    private runTypeScriptCheck;
    /**
     * Parse TypeScript error output
     */
    private parseTypeScriptErrors;
    /**
     * Get suggestion for TypeScript error
     */
    private getTypeScriptSuggestion;
    /**
     * Run ESLint check
     */
    private runEslintCheck;
    /**
     * Parse ESLint JSON output
     */
    private parseEslintErrors;
    /**
     * Get suggestion for ESLint error
     */
    private getEslintSuggestion;
    /**
     * Run Prisma validation
     */
    private runPrismaCheck;
    /**
     * Parse Prisma error output
     */
    private parsePrismaErrors;
    /**
     * Attempt to fix an error
     */
    private attemptFix;
    /**
     * Fix TypeScript error
     */
    private fixTypeScriptError;
    /**
     * Fix ESLint error
     */
    private fixEslintError;
    /**
     * Check if ESLint rule is auto-fixable
     */
    private isAutoFixable;
    /**
     * Log a message
     */
    private log;
    /**
     * Create workflow result
     */
    private createResult;
}
/**
 * Factory function to create a self-healing workflow
 */
export declare const createSelfHealingWorkflow: (projectRoot: string, options?: Partial<Omit<WorkflowConfig, "projectRoot">>) => SelfHealingWorkflow;
/**
 * Run self-healing workflow and return result
 */
export declare const runSelfHealing: (projectRoot: string, options?: Partial<Omit<WorkflowConfig, "projectRoot">>) => Promise<WorkflowResult>;
//# sourceMappingURL=self-healing.d.ts.map