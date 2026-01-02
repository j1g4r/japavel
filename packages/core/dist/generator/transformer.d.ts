import { JapavelSchema } from './parser';
/**
 * Code Generator - Transforms JapavelSchema DSL to TypeScript/Prisma code
 */
export interface GeneratedCode {
    zodSchema: string;
    trpcRouter: string;
    prismaModel: string;
    reactComponent: string;
    types: string;
}
/**
 * Generate all code artifacts from a JapavelSchema
 */
export declare const generateAll: (schema: JapavelSchema) => GeneratedCode;
/**
 * Generate Zod schema from DSL
 */
export declare const generateZodSchema: (schema: JapavelSchema) => string;
/**
 * Generate tRPC router from DSL
 */
export declare const generateTrpcRouter: (schema: JapavelSchema) => string;
/**
 * Generate Prisma model from DSL
 */
export declare const generatePrismaModel: (schema: JapavelSchema) => string;
/**
 * Generate React component from DSL
 */
export declare const generateReactComponent: (schema: JapavelSchema) => string;
/**
 * Generate TypeScript types from DSL
 */
export declare const generateTypes: (schema: JapavelSchema) => string;
//# sourceMappingURL=transformer.d.ts.map