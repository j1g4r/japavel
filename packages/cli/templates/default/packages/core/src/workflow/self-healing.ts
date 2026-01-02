import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const execAsync = promisify(exec);

/**
 * Self-Healing Workflow Engine
 * Automatically detects and fixes common errors in the codebase
 */

// Schema for workflow configuration
export const WorkflowConfigSchema = z.object({
  maxAttempts: z.number().int().min(1).max(10).default(3),
  projectRoot: z.string(),
  logPath: z.string().optional(),
  dryRun: z.boolean().default(false),
  fixStrategies: z.array(z.string()).default(['typescript', 'eslint', 'prisma']),
});

export type WorkflowConfig = z.infer<typeof WorkflowConfigSchema>;

// Schema for error context
export const ErrorSchema = z.object({
  type: z.enum(['typescript', 'eslint', 'runtime', 'prisma', 'build', 'test']),
  message: z.string(),
  file: z.string().optional(),
  line: z.number().optional(),
  column: z.number().optional(),
  code: z.string().optional(),
  suggestion: z.string().optional(),
});

export type WorkflowError = z.infer<typeof ErrorSchema>;

// Schema for fix result
export const FixResultSchema = z.object({
  success: z.boolean(),
  error: ErrorSchema,
  fixApplied: z.string().optional(),
  newContent: z.string().optional(),
  requiresManualFix: z.boolean().default(false),
});

export type FixResult = z.infer<typeof FixResultSchema>;

// Schema for workflow result
export const WorkflowResultSchema = z.object({
  success: z.boolean(),
  totalErrors: z.number(),
  fixedErrors: z.number(),
  remainingErrors: z.number(),
  attempts: z.number(),
  errors: z.array(ErrorSchema),
  fixes: z.array(FixResultSchema),
  logs: z.array(z.string()),
});

export type WorkflowResult = z.infer<typeof WorkflowResultSchema>;

/**
 * Self-Healing Workflow Engine
 */
export class SelfHealingWorkflow {
  private config: WorkflowConfig;
  private logs: string[] = [];

  constructor(config: Partial<WorkflowConfig> & { projectRoot: string }) {
    this.config = WorkflowConfigSchema.parse(config);
  }

  /**
   * Run the self-healing workflow
   */
  async run(): Promise<WorkflowResult> {
    let attempt = 0;
    let allErrors: WorkflowError[] = [];
    let allFixes: FixResult[] = [];

    this.log(`Starting self-healing workflow (max ${this.config.maxAttempts} attempts)`);

    while (attempt < this.config.maxAttempts) {
      attempt++;
      this.log(`\n--- Attempt ${attempt} of ${this.config.maxAttempts} ---`);

      // Step 1: Detect errors
      const errors = await this.detectErrors();
      this.log(`Found ${errors.length} errors`);

      if (errors.length === 0) {
        this.log('No errors detected. Workflow complete!');
        return this.createResult(true, allErrors, allFixes, attempt);
      }

      // Step 2: Analyze and fix each error
      const fixes: FixResult[] = [];
      for (const error of errors) {
        const fix = await this.attemptFix(error);
        fixes.push(fix);
        if (fix.success) {
          this.log(`Fixed: ${error.message.substring(0, 80)}...`);
        } else {
          this.log(`Could not fix: ${error.message.substring(0, 80)}...`);
        }
      }

      allErrors = [...allErrors, ...errors];
      allFixes = [...allFixes, ...fixes];

      // Step 3: Verify fixes
      const remainingErrors = await this.detectErrors();
      if (remainingErrors.length === 0) {
        this.log('All errors fixed successfully!');
        return this.createResult(true, allErrors, allFixes, attempt);
      }

      // Check if we're making progress
      if (remainingErrors.length >= errors.length) {
        this.log('No progress made. Pivoting strategy...');
        // Could implement strategy rotation here
      }
    }

    this.log(`Max attempts (${this.config.maxAttempts}) reached. Manual intervention required.`);
    const finalErrors = await this.detectErrors();
    return this.createResult(false, allErrors, allFixes, attempt, finalErrors);
  }

  /**
   * Detect all errors in the codebase
   */
  private async detectErrors(): Promise<WorkflowError[]> {
    const errors: WorkflowError[] = [];

    // Run TypeScript check
    if (this.config.fixStrategies.includes('typescript')) {
      const tsErrors = await this.runTypeScriptCheck();
      errors.push(...tsErrors);
    }

    // Run ESLint
    if (this.config.fixStrategies.includes('eslint')) {
      const lintErrors = await this.runEslintCheck();
      errors.push(...lintErrors);
    }

    // Run Prisma validation
    if (this.config.fixStrategies.includes('prisma')) {
      const prismaErrors = await this.runPrismaCheck();
      errors.push(...prismaErrors);
    }

    return errors;
  }

  /**
   * Run TypeScript compiler check
   */
  private async runTypeScriptCheck(): Promise<WorkflowError[]> {
    try {
      await execAsync('pnpm exec tsc --noEmit', { cwd: this.config.projectRoot });
      return [];
    } catch (error) {
      const output = (error as { stdout?: string; stderr?: string }).stdout || '';
      return this.parseTypeScriptErrors(output);
    }
  }

  /**
   * Parse TypeScript error output
   */
  private parseTypeScriptErrors(output: string): WorkflowError[] {
    const errors: WorkflowError[] = [];
    const errorPattern = /(.+)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)/g;

    let match;
    while ((match = errorPattern.exec(output)) !== null) {
      errors.push({
        type: 'typescript',
        file: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
        code: match[4],
        message: match[5],
        suggestion: this.getTypeScriptSuggestion(match[4], match[5]),
      });
    }

    return errors;
  }

  /**
   * Get suggestion for TypeScript error
   */
  private getTypeScriptSuggestion(code: string, message: string): string {
    const suggestions: Record<string, string> = {
      TS2304: 'Import the missing identifier or check spelling',
      TS2339: 'Add the missing property to the type or check property name',
      TS2345: 'Ensure argument types match parameter types',
      TS2322: 'Check type assignment compatibility',
      TS2307: 'Verify module path and installation',
      TS7006: 'Add explicit type annotation to parameter',
      TS2532: 'Add null check or use optional chaining',
      TS2531: 'Object might be null, add null check',
    };

    return suggestions[code] || 'Review the error and update the code accordingly';
  }

  /**
   * Run ESLint check
   */
  private async runEslintCheck(): Promise<WorkflowError[]> {
    try {
      await execAsync('pnpm exec eslint . --format json', { cwd: this.config.projectRoot });
      return [];
    } catch (error) {
      const output = (error as { stdout?: string }).stdout || '';
      try {
        return this.parseEslintErrors(output);
      } catch {
        return [];
      }
    }
  }

  /**
   * Parse ESLint JSON output
   */
  private parseEslintErrors(output: string): WorkflowError[] {
    const errors: WorkflowError[] = [];

    try {
      const results = JSON.parse(output);
      for (const file of results) {
        for (const msg of file.messages || []) {
          if (msg.severity === 2) { // Only errors, not warnings
            errors.push({
              type: 'eslint',
              file: file.filePath,
              line: msg.line,
              column: msg.column,
              code: msg.ruleId,
              message: msg.message,
              suggestion: this.getEslintSuggestion(msg.ruleId),
            });
          }
        }
      }
    } catch {
      // Fallback to text parsing
      const textPattern = /(.+):(\d+):(\d+):\s*(error)\s+(.+?)\s+(\S+)/g;
      let match;
      while ((match = textPattern.exec(output)) !== null) {
        errors.push({
          type: 'eslint',
          file: match[1],
          line: parseInt(match[2], 10),
          column: parseInt(match[3], 10),
          message: match[5],
          code: match[6],
          suggestion: this.getEslintSuggestion(match[6]),
        });
      }
    }

    return errors;
  }

  /**
   * Get suggestion for ESLint error
   */
  private getEslintSuggestion(ruleId: string): string {
    const suggestions: Record<string, string> = {
      '@typescript-eslint/no-explicit-any': 'Replace any with specific type or unknown',
      '@typescript-eslint/no-unused-vars': 'Remove unused variable or prefix with underscore',
      'prefer-const': 'Change let to const for variables never reassigned',
      'no-console': 'Use structured logger instead of console',
      '@typescript-eslint/explicit-function-return-type': 'Add explicit return type to function',
      'import/no-unresolved': 'Check import path or install missing package',
    };

    return suggestions[ruleId] || 'Follow ESLint rule guidelines';
  }

  /**
   * Run Prisma validation
   */
  private async runPrismaCheck(): Promise<WorkflowError[]> {
    try {
      await execAsync('pnpm exec prisma validate', { cwd: this.config.projectRoot });
      return [];
    } catch (error) {
      const output = (error as { stderr?: string }).stderr || '';
      return this.parsePrismaErrors(output);
    }
  }

  /**
   * Parse Prisma error output
   */
  private parsePrismaErrors(output: string): WorkflowError[] {
    const errors: WorkflowError[] = [];

    // Basic pattern for Prisma errors
    const errorPattern = /Error:.+?at\s+(.+?):(\d+)/g;
    let match;
    while ((match = errorPattern.exec(output)) !== null) {
      errors.push({
        type: 'prisma',
        file: match[1],
        line: parseInt(match[2], 10),
        message: output.split('\n').find(l => l.includes('Error:')) || 'Prisma validation error',
        suggestion: 'Review Prisma schema syntax and model definitions',
      });
    }

    return errors;
  }

  /**
   * Attempt to fix an error
   */
  private async attemptFix(error: WorkflowError): Promise<FixResult> {
    if (this.config.dryRun) {
      return {
        success: false,
        error,
        requiresManualFix: true,
        fixApplied: 'Dry run - no changes made',
      };
    }

    if (!error.file) {
      return {
        success: false,
        error,
        requiresManualFix: true,
      };
    }

    const filePath = path.isAbsolute(error.file)
      ? error.file
      : path.join(this.config.projectRoot, error.file);

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error,
        requiresManualFix: true,
      };
    }

    try {
      switch (error.type) {
        case 'typescript':
          return await this.fixTypeScriptError(error, filePath);
        case 'eslint':
          return await this.fixEslintError(error, filePath);
        default:
          return {
            success: false,
            error,
            requiresManualFix: true,
          };
      }
    } catch (e) {
      return {
        success: false,
        error,
        requiresManualFix: true,
      };
    }
  }

  /**
   * Fix TypeScript error
   */
  private async fixTypeScriptError(error: WorkflowError, filePath: string): Promise<FixResult> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    if (!error.line || error.line > lines.length) {
      return { success: false, error, requiresManualFix: true };
    }

    const lineIndex = error.line - 1;
    let newContent = content;
    let fixApplied = '';

    switch (error.code) {
      case 'TS7006': // Parameter implicitly has any type
        // Add `: unknown` to the parameter
        const paramMatch = lines[lineIndex].match(/(\w+)\s*[,)]/);
        if (paramMatch) {
          lines[lineIndex] = lines[lineIndex].replace(
            new RegExp(`(${paramMatch[1]})\\s*([,)])`),
            '$1: unknown$2'
          );
          fixApplied = `Added type annotation to parameter ${paramMatch[1]}`;
        }
        break;

      case 'TS2532': // Object is possibly undefined
      case 'TS2531': // Object is possibly null
        // Add optional chaining
        const propMatch = error.message.match(/property '(\w+)'/);
        if (propMatch) {
          lines[lineIndex] = lines[lineIndex].replace(
            new RegExp(`\\.${propMatch[1]}`),
            `?.${propMatch[1]}`
          );
          fixApplied = `Added optional chaining for ${propMatch[1]}`;
        }
        break;

      case 'TS2339': // Property does not exist
        // This usually requires more complex fixes
        return { success: false, error, requiresManualFix: true };

      default:
        return { success: false, error, requiresManualFix: true };
    }

    if (fixApplied) {
      newContent = lines.join('\n');
      fs.writeFileSync(filePath, newContent);
      return { success: true, error, fixApplied, newContent, requiresManualFix: false };
    }

    return { success: false, error, requiresManualFix: true };
  }

  /**
   * Fix ESLint error
   */
  private async fixEslintError(error: WorkflowError, filePath: string): Promise<FixResult> {
    // Try ESLint's auto-fix first
    if (error.code && this.isAutoFixable(error.code)) {
      try {
        await execAsync(`pnpm exec eslint --fix "${filePath}"`, {
          cwd: this.config.projectRoot,
        });
        return {
          success: true,
          error,
          fixApplied: `ESLint auto-fixed ${error.code}`,
          requiresManualFix: false,
        };
      } catch {
        // Auto-fix failed, try manual
      }
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    if (!error.line || error.line > lines.length) {
      return { success: false, error, requiresManualFix: true };
    }

    const lineIndex = error.line - 1;
    let fixApplied = '';

    switch (error.code) {
      case '@typescript-eslint/no-unused-vars':
        // Prefix with underscore
        const varMatch = lines[lineIndex].match(/(?:const|let|var)\s+(\w+)/);
        if (varMatch && !varMatch[1].startsWith('_')) {
          lines[lineIndex] = lines[lineIndex].replace(
            new RegExp(`\\b${varMatch[1]}\\b`),
            `_${varMatch[1]}`
          );
          fixApplied = `Prefixed unused variable ${varMatch[1]} with underscore`;
        }
        break;

      case 'prefer-const':
        lines[lineIndex] = lines[lineIndex].replace(/\blet\b/, 'const');
        fixApplied = 'Changed let to const';
        break;

      default:
        return { success: false, error, requiresManualFix: true };
    }

    if (fixApplied) {
      const newContent = lines.join('\n');
      fs.writeFileSync(filePath, newContent);
      return { success: true, error, fixApplied, newContent, requiresManualFix: false };
    }

    return { success: false, error, requiresManualFix: true };
  }

  /**
   * Check if ESLint rule is auto-fixable
   */
  private isAutoFixable(ruleId: string): boolean {
    const autoFixable = [
      'prefer-const',
      'no-extra-semi',
      'semi',
      'quotes',
      'indent',
      'comma-dangle',
      'object-curly-spacing',
      'array-bracket-spacing',
      '@typescript-eslint/semi',
      '@typescript-eslint/quotes',
    ];
    return autoFixable.includes(ruleId);
  }

  /**
   * Log a message
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);

    if (this.config.logPath) {
      fs.appendFileSync(this.config.logPath, logEntry + '\n');
    }
  }

  /**
   * Create workflow result
   */
  private createResult(
    success: boolean,
    allErrors: WorkflowError[],
    allFixes: FixResult[],
    attempts: number,
    remainingErrors?: WorkflowError[]
  ): WorkflowResult {
    const fixedCount = allFixes.filter(f => f.success).length;
    const remaining = remainingErrors || [];

    return {
      success,
      totalErrors: allErrors.length,
      fixedErrors: fixedCount,
      remainingErrors: remaining.length,
      attempts,
      errors: remaining,
      fixes: allFixes,
      logs: this.logs,
    };
  }
}

/**
 * Factory function to create a self-healing workflow
 */
export const createSelfHealingWorkflow = (
  projectRoot: string,
  options?: Partial<Omit<WorkflowConfig, 'projectRoot'>>
): SelfHealingWorkflow => {
  return new SelfHealingWorkflow({ projectRoot, ...options });
};

/**
 * Run self-healing workflow and return result
 */
export const runSelfHealing = async (
  projectRoot: string,
  options?: Partial<Omit<WorkflowConfig, 'projectRoot'>>
): Promise<WorkflowResult> => {
  const workflow = createSelfHealingWorkflow(projectRoot, options);
  return workflow.run();
};
