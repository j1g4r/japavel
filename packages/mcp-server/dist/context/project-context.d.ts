import { z } from 'zod';
/**
 * AI Context Provider System
 * Provides rich contextual information about the project to AI agents
 */
export declare const ProjectContextSchema: z.ZodObject<{
    projectRoot: z.ZodString;
    currentPhase: z.ZodString;
    packages: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        name: string;
        description: string;
    }, {
        path: string;
        name: string;
        description: string;
    }>, "many">;
    schemas: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        fields: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        name: string;
        fields: string[];
    }, {
        path: string;
        name: string;
        fields: string[];
    }>, "many">;
    recentChanges: z.ZodArray<z.ZodString, "many">;
    knownPitfalls: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    projectRoot: string;
    currentPhase: string;
    packages: {
        path: string;
        name: string;
        description: string;
    }[];
    schemas: {
        path: string;
        name: string;
        fields: string[];
    }[];
    recentChanges: string[];
    knownPitfalls: string[];
}, {
    projectRoot: string;
    currentPhase: string;
    packages: {
        path: string;
        name: string;
        description: string;
    }[];
    schemas: {
        path: string;
        name: string;
        fields: string[];
    }[];
    recentChanges: string[];
    knownPitfalls: string[];
}>;
export type ProjectContext = z.infer<typeof ProjectContextSchema>;
export declare const FileContextSchema: z.ZodObject<{
    path: z.ZodString;
    content: z.ZodString;
    language: z.ZodString;
    imports: z.ZodArray<z.ZodString, "many">;
    exports: z.ZodArray<z.ZodString, "many">;
    dependencies: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    content: string;
    language: string;
    imports: string[];
    exports: string[];
    dependencies: string[];
}, {
    path: string;
    content: string;
    language: string;
    imports: string[];
    exports: string[];
    dependencies: string[];
}>;
export type FileContext = z.infer<typeof FileContextSchema>;
export declare const ErrorContextSchema: z.ZodObject<{
    type: z.ZodEnum<["typescript", "eslint", "runtime", "test"]>;
    message: z.ZodString;
    file: z.ZodOptional<z.ZodString>;
    line: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
    suggestion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "typescript" | "eslint" | "runtime" | "test";
    file?: string | undefined;
    line?: number | undefined;
    column?: number | undefined;
    suggestion?: string | undefined;
}, {
    message: string;
    type: "typescript" | "eslint" | "runtime" | "test";
    file?: string | undefined;
    line?: number | undefined;
    column?: number | undefined;
    suggestion?: string | undefined;
}>;
export type ErrorContext = z.infer<typeof ErrorContextSchema>;
export declare class AIContextProvider {
    private projectRoot;
    constructor(projectRoot: string);
    /**
     * Get full project context for AI agent calibration
     */
    getProjectContext(): Promise<ProjectContext>;
    /**
     * Get context for a specific file
     */
    getFileContext(filePath: string): Promise<FileContext>;
    /**
     * Get context for an error to aid in self-healing
     */
    parseErrorContext(errorOutput: string): ErrorContext[];
    /**
     * Get relevant context for a specific task
     */
    getTaskContext(taskDescription: string): Promise<{
        relevantFiles: string[];
        relevantSchemas: string[];
        patterns: string[];
        pitfalls: string[];
    }>;
    private discoverPackages;
    private inferPackageDescription;
    private discoverSchemas;
    private extractSchemaFields;
    private loadKnownPitfalls;
    private detectLanguage;
    private extractImports;
    private extractExports;
    private extractDependencies;
    private extractKeywords;
    private findRelevantFiles;
    private walkDir;
    private findRelevantSchemas;
    private findRelevantPatterns;
    private findRelevantPitfalls;
    private suggestFix;
}
//# sourceMappingURL=project-context.d.ts.map