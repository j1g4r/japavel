import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import path from "path";
import { AIContextProvider } from "./context/project-context.js";
// Initialize context provider with project root
const projectRoot = path.resolve(process.cwd(), "..");
const contextProvider = new AIContextProvider(projectRoot);
const server = new Server({
    name: "japavel-mcp-server",
    version: "0.1.0",
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
// ============================================================================
// Resources - Expose project information as readable resources
// ============================================================================
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "japavel://project/context",
                name: "Project Context",
                description: "Full project context including packages, schemas, and known pitfalls",
                mimeType: "application/json",
            },
            {
                uri: "japavel://project/guidelines",
                name: "AI Guidelines",
                description: "Operational rules and coding standards for AI agents",
                mimeType: "text/markdown",
            },
            {
                uri: "japavel://project/ai-index",
                name: "AI Knowledge Index",
                description: "Persistent knowledge base with solved patterns and pitfalls",
                mimeType: "text/markdown",
            },
        ],
    };
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    try {
        if (uri === "japavel://project/context") {
            const context = await contextProvider.getProjectContext();
            return {
                contents: [
                    {
                        uri,
                        mimeType: "application/json",
                        text: JSON.stringify(context, null, 2),
                    },
                ],
            };
        }
        if (uri === "japavel://project/guidelines") {
            const fileContext = await contextProvider.getFileContext("docs/state/GUIDELINES.md");
            return {
                contents: [
                    {
                        uri,
                        mimeType: "text/markdown",
                        text: fileContext.content,
                    },
                ],
            };
        }
        if (uri === "japavel://project/ai-index") {
            const fileContext = await contextProvider.getFileContext(".japavel/AI_INDEX.md");
            return {
                contents: [
                    {
                        uri,
                        mimeType: "text/markdown",
                        text: fileContext.content,
                    },
                ],
            };
        }
        throw new Error(`Unknown resource: ${uri}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to read resource ${uri}: ${message}`);
    }
});
// ============================================================================
// Tools - AI-callable functions for context retrieval and code generation
// ============================================================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_project_context",
                description: "Get full project context including packages, schemas, and known pitfalls. Use this at the start of any task for calibration.",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: [],
                },
            },
            {
                name: "get_file_context",
                description: "Get detailed context for a specific file including imports, exports, and dependencies.",
                inputSchema: {
                    type: "object",
                    properties: {
                        filePath: {
                            type: "string",
                            description: "Path to the file (relative to project root)",
                        },
                    },
                    required: ["filePath"],
                },
            },
            {
                name: "get_task_context",
                description: "Get relevant context for a specific task including related files, schemas, patterns, and pitfalls to avoid.",
                inputSchema: {
                    type: "object",
                    properties: {
                        taskDescription: {
                            type: "string",
                            description: "Description of the task to perform",
                        },
                    },
                    required: ["taskDescription"],
                },
            },
            {
                name: "parse_errors",
                description: "Parse error output and get structured error context with fix suggestions. Use this in the self-healing loop.",
                inputSchema: {
                    type: "object",
                    properties: {
                        errorOutput: {
                            type: "string",
                            description: "Raw error output from build, lint, or test commands",
                        },
                    },
                    required: ["errorOutput"],
                },
            },
            {
                name: "generate_schema",
                description: "Generate a Zod schema from a DSL definition. Returns TypeScript code.",
                inputSchema: {
                    type: "object",
                    properties: {
                        model: {
                            type: "string",
                            description: "Name of the model (e.g., 'User', 'Product')",
                        },
                        fields: {
                            type: "object",
                            description: "Field definitions as key-value pairs (e.g., { name: 'string', age: 'number' })",
                            additionalProperties: { type: "string" },
                        },
                    },
                    required: ["model", "fields"],
                },
            },
            {
                name: "generate_trpc_router",
                description: "Generate a tRPC router for a given schema. Returns TypeScript code.",
                inputSchema: {
                    type: "object",
                    properties: {
                        model: {
                            type: "string",
                            description: "Name of the model (e.g., 'User', 'Product')",
                        },
                        operations: {
                            type: "array",
                            items: { type: "string" },
                            description: "CRUD operations to generate (e.g., ['create', 'read', 'update', 'delete', 'list'])",
                        },
                    },
                    required: ["model"],
                },
            },
            {
                name: "verify_code",
                description: "Run verification checks on the codebase. Returns pass/fail status with details.",
                inputSchema: {
                    type: "object",
                    properties: {
                        checks: {
                            type: "array",
                            items: { type: "string" },
                            description: "Checks to run: 'typescript', 'eslint', 'test', 'build'",
                        },
                        package: {
                            type: "string",
                            description: "Specific package to verify (optional, defaults to all)",
                        },
                    },
                    required: [],
                },
            },
        ],
    };
});
// Tool input schemas
const GetFileContextInput = z.object({
    filePath: z.string(),
});
const GetTaskContextInput = z.object({
    taskDescription: z.string(),
});
const ParseErrorsInput = z.object({
    errorOutput: z.string(),
});
const GenerateSchemaInput = z.object({
    model: z.string(),
    fields: z.record(z.string()),
});
const GenerateTrpcRouterInput = z.object({
    model: z.string(),
    operations: z.array(z.string()).default(["create", "read", "update", "delete", "list"]),
});
const VerifyCodeInput = z.object({
    checks: z.array(z.string()).default(["typescript"]),
    package: z.string().optional(),
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "get_project_context": {
                const context = await contextProvider.getProjectContext();
                return {
                    content: [{ type: "text", text: JSON.stringify(context, null, 2) }],
                };
            }
            case "get_file_context": {
                const input = GetFileContextInput.parse(args);
                const context = await contextProvider.getFileContext(input.filePath);
                return {
                    content: [{ type: "text", text: JSON.stringify(context, null, 2) }],
                };
            }
            case "get_task_context": {
                const input = GetTaskContextInput.parse(args);
                const context = await contextProvider.getTaskContext(input.taskDescription);
                return {
                    content: [{ type: "text", text: JSON.stringify(context, null, 2) }],
                };
            }
            case "parse_errors": {
                const input = ParseErrorsInput.parse(args);
                const errors = contextProvider.parseErrorContext(input.errorOutput);
                return {
                    content: [{ type: "text", text: JSON.stringify(errors, null, 2) }],
                };
            }
            case "generate_schema": {
                const input = GenerateSchemaInput.parse(args);
                const code = generateZodSchemaCode(input.model, input.fields);
                return {
                    content: [{ type: "text", text: code }],
                };
            }
            case "generate_trpc_router": {
                const input = GenerateTrpcRouterInput.parse(args);
                const code = generateTrpcRouterCode(input.model, input.operations);
                return {
                    content: [{ type: "text", text: code }],
                };
            }
            case "verify_code": {
                const input = VerifyCodeInput.parse(args);
                const result = await runVerification(input.checks, input.package);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// ============================================================================
// Code Generation Functions
// ============================================================================
function generateZodSchemaCode(model, fields) {
    const zodTypeMap = {
        string: "z.string()",
        number: "z.number()",
        boolean: "z.boolean()",
        date: "z.date()",
        uuid: "z.string().uuid()",
        email: "z.string().email()",
        url: "z.string().url()",
        int: "z.number().int()",
        positive: "z.number().positive()",
        optional_string: "z.string().optional()",
        optional_number: "z.number().optional()",
    };
    const fieldLines = Object.entries(fields)
        .map(([fieldName, fieldType]) => {
        const zodType = zodTypeMap[fieldType] || `z.${fieldType}()`;
        return `  ${fieldName}: ${zodType},`;
    })
        .join("\n");
    return `import { z } from 'zod';

export const ${model}Schema = z.object({
${fieldLines}
});

export type ${model} = z.infer<typeof ${model}Schema>;

// Input schema for creation (without auto-generated fields)
export const Create${model}InputSchema = ${model}Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Create${model}Input = z.infer<typeof Create${model}InputSchema>;

// Input schema for updates (all fields optional except id)
export const Update${model}InputSchema = ${model}Schema.partial().required({ id: true });

export type Update${model}Input = z.infer<typeof Update${model}InputSchema>;
`;
}
function generateTrpcRouterCode(model, operations) {
    const modelLower = model.toLowerCase();
    const hasCreate = operations.includes("create");
    const hasRead = operations.includes("read");
    const hasUpdate = operations.includes("update");
    const hasDelete = operations.includes("delete");
    const hasList = operations.includes("list");
    let procedures = "";
    if (hasCreate) {
        procedures += `
    create: publicProcedure
      .input(Create${model}InputSchema)
      .mutation(async ({ input, ctx }) => {
        const ${modelLower} = await ctx.prisma.${modelLower}.create({
          data: input,
        });
        return ${modelLower};
      }),
`;
    }
    if (hasRead) {
        procedures += `
    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input, ctx }) => {
        const ${modelLower} = await ctx.prisma.${modelLower}.findUnique({
          where: { id: input.id },
        });
        if (!${modelLower}) {
          throw new TRPCError({ code: 'NOT_FOUND', message: '${model} not found' });
        }
        return ${modelLower};
      }),
`;
    }
    if (hasUpdate) {
        procedures += `
    update: publicProcedure
      .input(Update${model}InputSchema)
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const ${modelLower} = await ctx.prisma.${modelLower}.update({
          where: { id },
          data,
        });
        return ${modelLower};
      }),
`;
    }
    if (hasDelete) {
        procedures += `
    delete: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input, ctx }) => {
        await ctx.prisma.${modelLower}.delete({
          where: { id: input.id },
        });
        return { success: true };
      }),
`;
    }
    if (hasList) {
        procedures += `
    list: publicProcedure
      .input(PaginationSchema.optional())
      .query(async ({ input, ctx }) => {
        const { page = 1, limit = 20 } = input || {};
        const [items, total] = await Promise.all([
          ctx.prisma.${modelLower}.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
          ctx.prisma.${modelLower}.count(),
        ]);
        return {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      }),
`;
    }
    return `import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { ${model}Schema, Create${model}InputSchema, Update${model}InputSchema } from '@japavel/contracts';
import { PaginationSchema } from '@japavel/contracts';

export const ${modelLower}Router = router({${procedures}});
`;
}
async function runVerification(checks, pkg) {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);
    const results = {};
    let allPassed = true;
    for (const check of checks) {
        try {
            let command;
            switch (check) {
                case "typescript":
                    command = pkg ? `pnpm --filter ${pkg} exec tsc --noEmit` : "pnpm exec tsc --noEmit";
                    break;
                case "eslint":
                    command = pkg ? `pnpm --filter ${pkg} exec eslint .` : "pnpm exec eslint .";
                    break;
                case "test":
                    command = pkg ? `pnpm --filter ${pkg} test` : "pnpm test";
                    break;
                case "build":
                    command = pkg ? `pnpm --filter ${pkg} build` : "pnpm build";
                    break;
                default:
                    continue;
            }
            const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });
            results[check] = { passed: true, output: stdout || "OK" };
        }
        catch (error) {
            allPassed = false;
            const err = error;
            results[check] = {
                passed: false,
                output: err.stderr || err.stdout || err.message || "Unknown error",
            };
        }
    }
    return { passed: allPassed, results };
}
// ============================================================================
// Start Server
// ============================================================================
const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
    console.error("Failed to connect to MCP transport:", err);
    process.exit(1);
});
