import { z } from 'zod';
/**
 * Verification Loop System
 * Runs comprehensive checks on the codebase before marking tasks as complete
 */
export declare const VerificationConfigSchema: z.ZodObject<{
    projectRoot: z.ZodString;
    checks: z.ZodDefault<z.ZodArray<z.ZodEnum<["typescript", "eslint", "prettier", "test", "build", "prisma", "atomic-rules", "security"]>, "many">>;
    timeout: z.ZodDefault<z.ZodNumber>;
    failFast: z.ZodDefault<z.ZodBoolean>;
    verbose: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    projectRoot: string;
    checks: ("typescript" | "eslint" | "prisma" | "build" | "test" | "prettier" | "atomic-rules" | "security")[];
    timeout: number;
    failFast: boolean;
    verbose: boolean;
}, {
    projectRoot: string;
    checks?: ("typescript" | "eslint" | "prisma" | "build" | "test" | "prettier" | "atomic-rules" | "security")[] | undefined;
    timeout?: number | undefined;
    failFast?: boolean | undefined;
    verbose?: boolean | undefined;
}>;
export type VerificationConfig = z.infer<typeof VerificationConfigSchema>;
export declare const CheckResultSchema: z.ZodObject<{
    name: z.ZodString;
    passed: z.ZodBoolean;
    duration: z.ZodNumber;
    output: z.ZodString;
    errors: z.ZodArray<z.ZodObject<{
        message: z.ZodString;
        file: z.ZodOptional<z.ZodString>;
        line: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        file?: string | undefined;
        line?: number | undefined;
    }, {
        message: string;
        file?: string | undefined;
        line?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    errors: {
        message: string;
        file?: string | undefined;
        line?: number | undefined;
    }[];
    passed: boolean;
    duration: number;
    output: string;
}, {
    name: string;
    errors: {
        message: string;
        file?: string | undefined;
        line?: number | undefined;
    }[];
    passed: boolean;
    duration: number;
    output: string;
}>;
export type CheckResult = z.infer<typeof CheckResultSchema>;
export declare const VerificationResultSchema: z.ZodObject<{
    passed: z.ZodBoolean;
    totalChecks: z.ZodNumber;
    passedChecks: z.ZodNumber;
    failedChecks: z.ZodNumber;
    totalDuration: z.ZodNumber;
    results: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        passed: z.ZodBoolean;
        duration: z.ZodNumber;
        output: z.ZodString;
        errors: z.ZodArray<z.ZodObject<{
            message: z.ZodString;
            file: z.ZodOptional<z.ZodString>;
            line: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            file?: string | undefined;
            line?: number | undefined;
        }, {
            message: string;
            file?: string | undefined;
            line?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        errors: {
            message: string;
            file?: string | undefined;
            line?: number | undefined;
        }[];
        passed: boolean;
        duration: number;
        output: string;
    }, {
        name: string;
        errors: {
            message: string;
            file?: string | undefined;
            line?: number | undefined;
        }[];
        passed: boolean;
        duration: number;
        output: string;
    }>, "many">;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    passed: boolean;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    totalDuration: number;
    results: {
        name: string;
        errors: {
            message: string;
            file?: string | undefined;
            line?: number | undefined;
        }[];
        passed: boolean;
        duration: number;
        output: string;
    }[];
    summary: string;
}, {
    passed: boolean;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    totalDuration: number;
    results: {
        name: string;
        errors: {
            message: string;
            file?: string | undefined;
            line?: number | undefined;
        }[];
        passed: boolean;
        duration: number;
        output: string;
    }[];
    summary: string;
}>;
export type VerificationResult = z.infer<typeof VerificationResultSchema>;
/**
 * Verification Loop System
 */
export declare class VerificationLoop {
    private config;
    constructor(config: Partial<VerificationConfig> & {
        projectRoot: string;
    });
    /**
     * Run all verification checks
     */
    verify(): Promise<VerificationResult>;
    /**
     * Run a specific check
     */
    private runCheck;
    /**
     * TypeScript check
     */
    private runTypeScriptCheck;
    /**
     * ESLint check
     */
    private runEslintCheck;
    /**
     * Prettier check
     */
    private runPrettierCheck;
    /**
     * Test check
     */
    private runTestCheck;
    /**
     * Build check
     */
    private runBuildCheck;
    /**
     * Prisma check
     */
    private runPrismaCheck;
    /**
     * Atomic rules check
     * Verifies that components follow atomic design principles
     */
    private runAtomicRulesCheck;
    /**
     * Security check
     * Basic security pattern checks
     */
    private runSecurityCheck;
    /**
     * Parse TypeScript errors
     */
    private parseTypeScriptErrors;
    /**
     * Parse ESLint errors
     */
    private parseEslintErrors;
    /**
     * Walk directory and find files
     */
    private walkDir;
    /**
     * Create check result
     */
    private createResult;
    /**
     * Generate summary
     */
    private generateSummary;
}
/**
 * Factory function to create verification loop
 */
export declare const createVerificationLoop: (projectRoot: string, options?: Partial<Omit<VerificationConfig, "projectRoot">>) => VerificationLoop;
/**
 * Run verification and return result
 */
export declare const runVerification: (projectRoot: string, options?: Partial<Omit<VerificationConfig, "projectRoot">>) => Promise<VerificationResult>;
/**
 * Quick verification check (TypeScript + ESLint only)
 */
export declare const quickVerify: (projectRoot: string) => Promise<boolean>;
/**
 * Full verification check (all checks)
 */
export declare const fullVerify: (projectRoot: string) => Promise<VerificationResult>;
//# sourceMappingURL=verification.d.ts.map