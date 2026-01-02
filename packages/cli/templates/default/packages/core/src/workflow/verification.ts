import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const execAsync = promisify(exec);

/**
 * Verification Loop System
 * Runs comprehensive checks on the codebase before marking tasks as complete
 */

// Schema for verification configuration
export const VerificationConfigSchema = z.object({
  projectRoot: z.string(),
  checks: z.array(z.enum([
    'typescript',
    'eslint',
    'prettier',
    'test',
    'build',
    'prisma',
    'atomic-rules',
    'security',
  ])).default(['typescript', 'eslint', 'test']),
  timeout: z.number().default(120000), // 2 minutes default
  failFast: z.boolean().default(false),
  verbose: z.boolean().default(false),
});

export type VerificationConfig = z.infer<typeof VerificationConfigSchema>;

// Schema for check result
export const CheckResultSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  duration: z.number(),
  output: z.string(),
  errors: z.array(z.object({
    message: z.string(),
    file: z.string().optional(),
    line: z.number().optional(),
  })),
});

export type CheckResult = z.infer<typeof CheckResultSchema>;

// Schema for verification result
export const VerificationResultSchema = z.object({
  passed: z.boolean(),
  totalChecks: z.number(),
  passedChecks: z.number(),
  failedChecks: z.number(),
  totalDuration: z.number(),
  results: z.array(CheckResultSchema),
  summary: z.string(),
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;

/**
 * Verification Loop System
 */
export class VerificationLoop {
  private config: VerificationConfig;

  constructor(config: Partial<VerificationConfig> & { projectRoot: string }) {
    this.config = VerificationConfigSchema.parse(config);
  }

  /**
   * Run all verification checks
   */
  async verify(): Promise<VerificationResult> {
    const startTime = Date.now();
    const results: CheckResult[] = [];

    for (const check of this.config.checks) {
      const result = await this.runCheck(check);
      results.push(result);

      if (!result.passed && this.config.failFast) {
        break;
      }
    }

    const totalDuration = Date.now() - startTime;
    const passedChecks = results.filter(r => r.passed).length;
    const failedChecks = results.filter(r => !r.passed).length;

    return {
      passed: failedChecks === 0,
      totalChecks: results.length,
      passedChecks,
      failedChecks,
      totalDuration,
      results,
      summary: this.generateSummary(results),
    };
  }

  /**
   * Run a specific check
   */
  private async runCheck(checkName: string): Promise<CheckResult> {
    const startTime = Date.now();

    try {
      switch (checkName) {
        case 'typescript':
          return await this.runTypeScriptCheck(startTime);
        case 'eslint':
          return await this.runEslintCheck(startTime);
        case 'prettier':
          return await this.runPrettierCheck(startTime);
        case 'test':
          return await this.runTestCheck(startTime);
        case 'build':
          return await this.runBuildCheck(startTime);
        case 'prisma':
          return await this.runPrismaCheck(startTime);
        case 'atomic-rules':
          return await this.runAtomicRulesCheck(startTime);
        case 'security':
          return await this.runSecurityCheck(startTime);
        default:
          return this.createResult(checkName, false, startTime, `Unknown check: ${checkName}`, []);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return this.createResult(checkName, false, startTime, message, [{ message }]);
    }
  }

  /**
   * TypeScript check
   */
  private async runTypeScriptCheck(startTime: number): Promise<CheckResult> {
    try {
      const { stdout } = await execAsync('pnpm exec tsc --noEmit', {
        cwd: this.config.projectRoot,
        timeout: this.config.timeout,
      });
      return this.createResult('typescript', true, startTime, stdout || 'OK', []);
    } catch (error) {
      const output = (error as { stdout?: string; stderr?: string }).stdout || '';
      const errors = this.parseTypeScriptErrors(output);
      return this.createResult('typescript', false, startTime, output, errors);
    }
  }

  /**
   * ESLint check
   */
  private async runEslintCheck(startTime: number): Promise<CheckResult> {
    try {
      const { stdout } = await execAsync('pnpm exec eslint . --max-warnings 0', {
        cwd: this.config.projectRoot,
        timeout: this.config.timeout,
      });
      return this.createResult('eslint', true, startTime, stdout || 'OK', []);
    } catch (error) {
      const output = (error as { stdout?: string; stderr?: string }).stdout || '';
      const errors = this.parseEslintErrors(output);
      return this.createResult('eslint', false, startTime, output, errors);
    }
  }

  /**
   * Prettier check
   */
  private async runPrettierCheck(startTime: number): Promise<CheckResult> {
    try {
      const { stdout } = await execAsync('pnpm exec prettier --check .', {
        cwd: this.config.projectRoot,
        timeout: this.config.timeout,
      });
      return this.createResult('prettier', true, startTime, stdout || 'OK', []);
    } catch (error) {
      const output = (error as { stdout?: string }).stdout || '';
      return this.createResult('prettier', false, startTime, output, [{ message: 'Files need formatting' }]);
    }
  }

  /**
   * Test check
   */
  private async runTestCheck(startTime: number): Promise<CheckResult> {
    try {
      const { stdout } = await execAsync('pnpm test', {
        cwd: this.config.projectRoot,
        timeout: this.config.timeout,
      });
      return this.createResult('test', true, startTime, stdout || 'OK', []);
    } catch (error) {
      const output = (error as { stdout?: string; stderr?: string }).stdout || '';
      return this.createResult('test', false, startTime, output, [{ message: 'Tests failed' }]);
    }
  }

  /**
   * Build check
   */
  private async runBuildCheck(startTime: number): Promise<CheckResult> {
    try {
      const { stdout } = await execAsync('pnpm build', {
        cwd: this.config.projectRoot,
        timeout: this.config.timeout,
      });
      return this.createResult('build', true, startTime, stdout || 'OK', []);
    } catch (error) {
      const output = (error as { stdout?: string; stderr?: string }).stderr || '';
      return this.createResult('build', false, startTime, output, [{ message: 'Build failed' }]);
    }
  }

  /**
   * Prisma check
   */
  private async runPrismaCheck(startTime: number): Promise<CheckResult> {
    try {
      const { stdout } = await execAsync('pnpm exec prisma validate', {
        cwd: this.config.projectRoot,
        timeout: this.config.timeout,
      });
      return this.createResult('prisma', true, startTime, stdout || 'OK', []);
    } catch (error) {
      const output = (error as { stderr?: string }).stderr || '';
      return this.createResult('prisma', false, startTime, output, [{ message: 'Prisma validation failed' }]);
    }
  }

  /**
   * Atomic rules check
   * Verifies that components follow atomic design principles
   */
  private async runAtomicRulesCheck(startTime: number): Promise<CheckResult> {
    const errors: Array<{ message: string; file?: string; line?: number }> = [];
    const srcDirs = [
      path.join(this.config.projectRoot, 'packages', 'frontend', 'src'),
      path.join(this.config.projectRoot, 'packages', 'backend', 'src'),
    ];

    for (const srcDir of srcDirs) {
      if (!fs.existsSync(srcDir)) continue;

      const files = this.walkDir(srcDir, ['.ts', '.tsx']);
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        // Check file length (max 200 lines rule)
        if (lines.length > 200) {
          errors.push({
            message: `File exceeds 200 line limit (${lines.length} lines)`,
            file: path.relative(this.config.projectRoot, file),
            line: 1,
          });
        }

        // Check for explicit any
        lines.forEach((line, index) => {
          if (line.includes(': any') || line.includes('<any>') || line.includes('as any')) {
            errors.push({
              message: 'Explicit any type detected',
              file: path.relative(this.config.projectRoot, file),
              line: index + 1,
            });
          }
        });

        // Check for console.log in non-dev files
        if (!file.includes('.test.') && !file.includes('.spec.')) {
          lines.forEach((line, index) => {
            if (line.includes('console.log') && !line.trim().startsWith('//')) {
              errors.push({
                message: 'console.log detected (use structured logger)',
                file: path.relative(this.config.projectRoot, file),
                line: index + 1,
              });
            }
          });
        }
      }
    }

    return this.createResult(
      'atomic-rules',
      errors.length === 0,
      startTime,
      errors.length === 0 ? 'All atomic rules pass' : `Found ${errors.length} violations`,
      errors
    );
  }

  /**
   * Security check
   * Basic security pattern checks
   */
  private async runSecurityCheck(startTime: number): Promise<CheckResult> {
    const errors: Array<{ message: string; file?: string; line?: number }> = [];
    const srcDirs = [
      path.join(this.config.projectRoot, 'packages'),
    ];

    const dangerousPatterns = [
      { pattern: /eval\s*\(/g, message: 'eval() usage detected - potential code injection' },
      { pattern: /dangerouslySetInnerHTML/g, message: 'dangerouslySetInnerHTML usage - potential XSS' },
      { pattern: /innerHTML\s*=/g, message: 'innerHTML assignment - potential XSS' },
      { pattern: /process\.env\.\w+/g, message: 'Direct env access - consider using config' },
      { pattern: /\$\{.*\}/g, message: 'Template literal in SQL - potential injection (verify parameterized)' },
    ];

    for (const srcDir of srcDirs) {
      if (!fs.existsSync(srcDir)) continue;

      const files = this.walkDir(srcDir, ['.ts', '.tsx', '.js', '.jsx']);
      for (const file of files) {
        // Skip test files and node_modules
        if (file.includes('node_modules') || file.includes('.test.') || file.includes('.spec.')) {
          continue;
        }

        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          for (const { pattern, message } of dangerousPatterns) {
            if (pattern.test(line)) {
              errors.push({
                message,
                file: path.relative(this.config.projectRoot, file),
                line: index + 1,
              });
            }
            pattern.lastIndex = 0; // Reset regex
          }
        });
      }
    }

    return this.createResult(
      'security',
      errors.length === 0,
      startTime,
      errors.length === 0 ? 'No security issues found' : `Found ${errors.length} potential issues`,
      errors
    );
  }

  /**
   * Parse TypeScript errors
   */
  private parseTypeScriptErrors(output: string): Array<{ message: string; file?: string; line?: number }> {
    const errors: Array<{ message: string; file?: string; line?: number }> = [];
    const pattern = /(.+)\((\d+),\d+\):\s*error\s+TS\d+:\s*(.+)/g;

    let match;
    while ((match = pattern.exec(output)) !== null) {
      errors.push({
        message: match[3],
        file: match[1],
        line: parseInt(match[2], 10),
      });
    }

    return errors;
  }

  /**
   * Parse ESLint errors
   */
  private parseEslintErrors(output: string): Array<{ message: string; file?: string; line?: number }> {
    const errors: Array<{ message: string; file?: string; line?: number }> = [];
    const pattern = /(.+):(\d+):\d+:\s*error\s+(.+)/g;

    let match;
    while ((match = pattern.exec(output)) !== null) {
      errors.push({
        message: match[3],
        file: match[1],
        line: parseInt(match[2], 10),
      });
    }

    return errors;
  }

  /**
   * Walk directory and find files
   */
  private walkDir(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          files.push(...this.walkDir(fullPath, extensions));
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignore permission errors
    }

    return files;
  }

  /**
   * Create check result
   */
  private createResult(
    name: string,
    passed: boolean,
    startTime: number,
    output: string,
    errors: Array<{ message: string; file?: string; line?: number }>
  ): CheckResult {
    return {
      name,
      passed,
      duration: Date.now() - startTime,
      output: output.slice(0, 2000), // Limit output length
      errors,
    };
  }

  /**
   * Generate summary
   */
  private generateSummary(results: CheckResult[]): string {
    const lines: string[] = ['Verification Summary:', ''];

    for (const result of results) {
      const status = result.passed ? '✓' : '✗';
      const duration = `${result.duration}ms`;
      lines.push(`  ${status} ${result.name} (${duration})`);

      if (!result.passed && result.errors.length > 0) {
        const errorCount = Math.min(result.errors.length, 3);
        for (let i = 0; i < errorCount; i++) {
          const err = result.errors[i];
          const location = err.file ? ` (${err.file}:${err.line || 1})` : '';
          lines.push(`      - ${err.message}${location}`);
        }
        if (result.errors.length > 3) {
          lines.push(`      ... and ${result.errors.length - 3} more`);
        }
      }
    }

    lines.push('');
    const passed = results.filter(r => r.passed).length;
    lines.push(`Total: ${passed}/${results.length} checks passed`);

    return lines.join('\n');
  }
}

/**
 * Factory function to create verification loop
 */
export const createVerificationLoop = (
  projectRoot: string,
  options?: Partial<Omit<VerificationConfig, 'projectRoot'>>
): VerificationLoop => {
  return new VerificationLoop({ projectRoot, ...options });
};

/**
 * Run verification and return result
 */
export const runVerification = async (
  projectRoot: string,
  options?: Partial<Omit<VerificationConfig, 'projectRoot'>>
): Promise<VerificationResult> => {
  const loop = createVerificationLoop(projectRoot, options);
  return loop.verify();
};

/**
 * Quick verification check (TypeScript + ESLint only)
 */
export const quickVerify = async (projectRoot: string): Promise<boolean> => {
  const result = await runVerification(projectRoot, {
    checks: ['typescript', 'eslint'],
    failFast: true,
  });
  return result.passed;
};

/**
 * Full verification check (all checks)
 */
export const fullVerify = async (projectRoot: string): Promise<VerificationResult> => {
  return runVerification(projectRoot, {
    checks: ['typescript', 'eslint', 'test', 'build', 'atomic-rules', 'security'],
  });
};
