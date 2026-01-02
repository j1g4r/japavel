import fs from 'fs';
import path from 'path';
import { z } from 'zod';
/**
 * AI Context Provider System
 * Provides rich contextual information about the project to AI agents
 */
// Schema for project context
export const ProjectContextSchema = z.object({
    projectRoot: z.string(),
    currentPhase: z.string(),
    packages: z.array(z.object({
        name: z.string(),
        path: z.string(),
        description: z.string(),
    })),
    schemas: z.array(z.object({
        name: z.string(),
        path: z.string(),
        fields: z.array(z.string()),
    })),
    recentChanges: z.array(z.string()),
    knownPitfalls: z.array(z.string()),
});
// Schema for file context
export const FileContextSchema = z.object({
    path: z.string(),
    content: z.string(),
    language: z.string(),
    imports: z.array(z.string()),
    exports: z.array(z.string()),
    dependencies: z.array(z.string()),
});
// Schema for error context
export const ErrorContextSchema = z.object({
    type: z.enum(['typescript', 'eslint', 'runtime', 'test']),
    message: z.string(),
    file: z.string().optional(),
    line: z.number().optional(),
    column: z.number().optional(),
    suggestion: z.string().optional(),
});
export class AIContextProvider {
    projectRoot;
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
    }
    /**
     * Get full project context for AI agent calibration
     */
    async getProjectContext() {
        const packages = await this.discoverPackages();
        const schemas = await this.discoverSchemas();
        const knownPitfalls = await this.loadKnownPitfalls();
        return {
            projectRoot: this.projectRoot,
            currentPhase: 'Phase 3: AI Interface Layer',
            packages,
            schemas,
            recentChanges: [],
            knownPitfalls,
        };
    }
    /**
     * Get context for a specific file
     */
    async getFileContext(filePath) {
        const absolutePath = path.isAbsolute(filePath)
            ? filePath
            : path.join(this.projectRoot, filePath);
        const content = fs.readFileSync(absolutePath, 'utf-8');
        const language = this.detectLanguage(filePath);
        const imports = this.extractImports(content, language);
        const exports = this.extractExports(content, language);
        const dependencies = this.extractDependencies(content);
        return {
            path: filePath,
            content,
            language,
            imports,
            exports,
            dependencies,
        };
    }
    /**
     * Get context for an error to aid in self-healing
     */
    parseErrorContext(errorOutput) {
        const errors = [];
        // Parse TypeScript errors
        const tsErrorPattern = /(.+)\((\d+),(\d+)\):\s*error\s+TS\d+:\s*(.+)/g;
        let match;
        while ((match = tsErrorPattern.exec(errorOutput)) !== null) {
            errors.push({
                type: 'typescript',
                file: match[1],
                line: parseInt(match[2], 10),
                column: parseInt(match[3], 10),
                message: match[4],
                suggestion: this.suggestFix('typescript', match[4]),
            });
        }
        // Parse ESLint errors
        const eslintPattern = /(.+):(\d+):(\d+):\s*(error|warning)\s+(.+)/g;
        while ((match = eslintPattern.exec(errorOutput)) !== null) {
            errors.push({
                type: 'eslint',
                file: match[1],
                line: parseInt(match[2], 10),
                column: parseInt(match[3], 10),
                message: match[5],
                suggestion: this.suggestFix('eslint', match[5]),
            });
        }
        // Parse runtime errors
        const runtimePattern = /Error:\s*(.+)\n\s+at\s+.+\((.+):(\d+):(\d+)\)/g;
        while ((match = runtimePattern.exec(errorOutput)) !== null) {
            errors.push({
                type: 'runtime',
                message: match[1],
                file: match[2],
                line: parseInt(match[3], 10),
                column: parseInt(match[4], 10),
                suggestion: this.suggestFix('runtime', match[1]),
            });
        }
        return errors;
    }
    /**
     * Get relevant context for a specific task
     */
    async getTaskContext(taskDescription) {
        const keywords = this.extractKeywords(taskDescription);
        const relevantFiles = await this.findRelevantFiles(keywords);
        const relevantSchemas = await this.findRelevantSchemas(keywords);
        const patterns = await this.findRelevantPatterns(keywords);
        const pitfalls = await this.findRelevantPitfalls(keywords);
        return {
            relevantFiles,
            relevantSchemas,
            patterns,
            pitfalls,
        };
    }
    // Private helper methods
    async discoverPackages() {
        const packagesDir = path.join(this.projectRoot, 'packages');
        if (!fs.existsSync(packagesDir))
            return [];
        const packages = [];
        const dirs = fs.readdirSync(packagesDir, { withFileTypes: true });
        for (const dir of dirs) {
            if (!dir.isDirectory())
                continue;
            const pkgJsonPath = path.join(packagesDir, dir.name, 'package.json');
            if (fs.existsSync(pkgJsonPath)) {
                const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
                packages.push({
                    name: pkgJson.name || dir.name,
                    path: path.join('packages', dir.name),
                    description: pkgJson.description || this.inferPackageDescription(dir.name),
                });
            }
        }
        return packages;
    }
    inferPackageDescription(name) {
        const descriptions = {
            contracts: 'Zod schemas and TypeScript types (source of truth)',
            backend: 'tRPC API server with Prisma ORM',
            frontend: 'React UI with Tailwind CSS',
            core: 'Framework CLI and DSL generators',
            'mcp-server': 'Model Context Protocol AI integration',
        };
        return descriptions[name] || 'Package description not available';
    }
    async discoverSchemas() {
        const schemasDir = path.join(this.projectRoot, 'packages', 'contracts', 'src', 'schemas');
        if (!fs.existsSync(schemasDir))
            return [];
        const schemas = [];
        const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts'));
        for (const file of files) {
            const content = fs.readFileSync(path.join(schemasDir, file), 'utf-8');
            const fields = this.extractSchemaFields(content);
            schemas.push({
                name: file.replace('.ts', ''),
                path: path.join('packages', 'contracts', 'src', 'schemas', file),
                fields,
            });
        }
        return schemas;
    }
    extractSchemaFields(content) {
        const fields = [];
        const fieldPattern = /(\w+):\s*z\.\w+/g;
        let match;
        while ((match = fieldPattern.exec(content)) !== null) {
            if (!fields.includes(match[1])) {
                fields.push(match[1]);
            }
        }
        return fields;
    }
    async loadKnownPitfalls() {
        const aiIndexPath = path.join(this.projectRoot, '.japavel', 'AI_INDEX.md');
        if (!fs.existsSync(aiIndexPath))
            return [];
        const content = fs.readFileSync(aiIndexPath, 'utf-8');
        const pitfalls = [];
        // Extract pitfalls from AI_INDEX.md
        const pitfallSection = content.match(/## ⚠️ Known Pitfalls([\s\S]*?)(?=##|$)/);
        if (pitfallSection) {
            const issuePattern = /\*\*Issue:\*\*\s*(.+)/g;
            let match;
            while ((match = issuePattern.exec(pitfallSection[1])) !== null) {
                pitfalls.push(match[1]);
            }
        }
        return pitfalls;
    }
    detectLanguage(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const langMap = {
            '.ts': 'typescript',
            '.tsx': 'typescript-react',
            '.js': 'javascript',
            '.jsx': 'javascript-react',
            '.json': 'json',
            '.md': 'markdown',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.prisma': 'prisma',
        };
        return langMap[ext] || 'unknown';
    }
    extractImports(content, language) {
        if (!language.includes('script'))
            return [];
        const imports = [];
        const importPattern = /import\s+(?:.*\s+from\s+)?['"]([^'"]+)['"]/g;
        let match;
        while ((match = importPattern.exec(content)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    }
    extractExports(content, language) {
        if (!language.includes('script'))
            return [];
        const exports = [];
        const exportPattern = /export\s+(?:const|function|class|type|interface)\s+(\w+)/g;
        let match;
        while ((match = exportPattern.exec(content)) !== null) {
            exports.push(match[1]);
        }
        return exports;
    }
    extractDependencies(content) {
        const deps = [];
        const importPattern = /from\s+['"]([^'"./][^'"]*)['"]/g;
        let match;
        while ((match = importPattern.exec(content)) !== null) {
            const pkg = match[1].split('/')[0];
            if (!deps.includes(pkg)) {
                deps.push(pkg);
            }
        }
        return deps;
    }
    extractKeywords(text) {
        // Extract meaningful keywords from task description
        const stopWords = ['the', 'a', 'an', 'is', 'are', 'to', 'for', 'and', 'or', 'in', 'on', 'at', 'with'];
        return text
            .toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));
    }
    async findRelevantFiles(keywords) {
        // Simplified implementation - in production, use proper file search
        const relevantDirs = ['packages/contracts', 'packages/core', 'packages/backend', 'packages/frontend'];
        const files = [];
        for (const dir of relevantDirs) {
            const fullPath = path.join(this.projectRoot, dir, 'src');
            if (fs.existsSync(fullPath)) {
                files.push(...this.walkDir(fullPath).slice(0, 10));
            }
        }
        return files;
    }
    walkDir(dir) {
        const files = [];
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    files.push(...this.walkDir(fullPath));
                }
                else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
                    files.push(fullPath);
                }
            }
        }
        catch {
            // Ignore permission errors
        }
        return files;
    }
    async findRelevantSchemas(keywords) {
        const schemasDir = path.join(this.projectRoot, 'packages', 'contracts', 'src', 'schemas');
        if (!fs.existsSync(schemasDir))
            return [];
        return fs.readdirSync(schemasDir)
            .filter(f => f.endsWith('.ts'))
            .map(f => path.join(schemasDir, f));
    }
    async findRelevantPatterns(keywords) {
        const aiIndexPath = path.join(this.projectRoot, '.japavel', 'AI_INDEX.md');
        if (!fs.existsSync(aiIndexPath))
            return [];
        const content = fs.readFileSync(aiIndexPath, 'utf-8');
        const patterns = [];
        const patternSection = content.match(/## 🧠 Solved Problems & Patterns([\s\S]*?)(?=## ⚠️|$)/);
        if (patternSection) {
            const patternMatch = /### \d+\.\s+(.+)/g;
            let match;
            while ((match = patternMatch.exec(patternSection[1])) !== null) {
                patterns.push(match[1]);
            }
        }
        return patterns;
    }
    async findRelevantPitfalls(keywords) {
        return this.loadKnownPitfalls();
    }
    suggestFix(errorType, message) {
        // Common fix suggestions based on error patterns
        const suggestions = {
            typescript: {
                'cannot find module': 'Check import path and ensure the module is installed',
                'is not assignable to type': 'Verify type compatibility or use type assertion',
                'property does not exist': 'Check property name spelling or add missing property to type',
                'expected': 'Check for missing brackets, parentheses, or semicolons',
            },
            eslint: {
                'no-unused-vars': 'Remove unused variable or prefix with underscore',
                'no-explicit-any': 'Replace any with specific type or unknown',
                'prefer-const': 'Change let to const for variables that are never reassigned',
            },
            runtime: {
                'undefined': 'Add null check or optional chaining',
                'cannot read property': 'Check if object exists before accessing property',
                'is not a function': 'Verify function is defined and exported correctly',
            },
        };
        const typeSuggestions = suggestions[errorType] || {};
        for (const [pattern, suggestion] of Object.entries(typeSuggestions)) {
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                return suggestion;
            }
        }
        return 'Review the error message and check related code';
    }
}
