import fs from "fs";
import yaml from "yaml";
import { z } from "zod";

/**
 * DSL Schema Definition
 * Defines the structure of YAML-based schema definitions
 */

// Field type definitions
export const FieldTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "date",
  "uuid",
  "email",
  "url",
  "int",
  "json",
  "array",
  "enum",
]);

// Field definition with modifiers
export const FieldDefinitionSchema = z.object({
  type: FieldTypeSchema,
  required: z.boolean().default(true),
  unique: z.boolean().default(false),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  enum: z.array(z.string()).optional(),
  items: z.string().optional(), // For array types
  description: z.string().optional(),
});

export type FieldDefinition = z.infer<typeof FieldDefinitionSchema>;

// View configuration
export const ViewConfigSchema = z.object({
  type: z.enum(["table", "form", "card", "list", "detail"]),
  fields: z.array(z.string()).optional(),
  sortable: z.array(z.string()).optional(),
  filterable: z.array(z.string()).optional(),
  searchable: z.array(z.string()).optional(),
});

export type ViewConfig = z.infer<typeof ViewConfigSchema>;

// API configuration
export const ApiConfigSchema = z.object({
  operations: z
    .array(z.enum(["create", "read", "update", "delete", "list", "search"]))
    .default(["create", "read", "update", "delete", "list"]),
  auth: z.enum(["public", "authenticated", "admin"]).default("authenticated"),
  rateLimit: z.number().optional(),
  pagination: z.boolean().default(true),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;

// Relationship configuration
export const RelationshipSchema = z.object({
  type: z.enum(["hasOne", "hasMany", "belongsTo", "manyToMany"]),
  model: z.string(),
  foreignKey: z.string().optional(),
  through: z.string().optional(), // For manyToMany
});

export type Relationship = z.infer<typeof RelationshipSchema>;

// Full Japavel Schema definition
export const JapavelSchemaSchema = z.object({
  Model: z.string(),
  Fields: z.record(z.string(), z.union([z.string(), FieldDefinitionSchema])),
  View: z.union([z.string(), ViewConfigSchema]).optional(),
  API: z.union([z.string(), ApiConfigSchema]).optional(),
  Relations: z.record(z.string(), RelationshipSchema).optional(),
  Hooks: z
    .object({
      beforeCreate: z.string().optional(),
      afterCreate: z.string().optional(),
      beforeUpdate: z.string().optional(),
      afterUpdate: z.string().optional(),
      beforeDelete: z.string().optional(),
      afterDelete: z.string().optional(),
    })
    .optional(),
});

export type JapavelSchema = z.infer<typeof JapavelSchemaSchema>;

// Legacy interface for backwards compatibility
export interface JapavelSchemaLegacy {
  Model: string;
  Fields: Record<string, string>;
  View?: string;
  API?: string;
}

/**
 * Parse a DSL file and return a validated JapavelSchema
 */
export const parseDSL = (filePath: string): JapavelSchema => {
  const content = fs.readFileSync(filePath, "utf8");
  return parseDSLContent(content);
};

/**
 * Parse DSL content directly (for testing or inline definitions)
 */
export const parseDSLContent = (content: string): JapavelSchema => {
  const parsed = yaml.parse(content);
  return JapavelSchemaSchema.parse(parsed);
};

/**
 * Parse a directory of DSL files
 */
export const parseDSLDirectory = (dirPath: string): JapavelSchema[] => {
  const files = fs
    .readdirSync(dirPath)
    .filter(
      (f) =>
        f.endsWith(".yaml") || f.endsWith(".yml") || f.endsWith(".japavel"),
    );

  return files.map((file) => parseDSL(`${dirPath}/${file}`));
};

/**
 * Normalize field definition to full form
 */
export const normalizeField = (
  field: string | FieldDefinition,
): FieldDefinition => {
  if (typeof field === "string") {
    // Parse shorthand: "string", "string!", "email?", "enum(admin,user)"
    const isRequired = !field.endsWith("?");
    const cleanType = field.replace("?", "").replace("!", "");

    // Check for enum shorthand
    const enumMatch = cleanType.match(/^enum\((.+)\)$/);
    if (enumMatch) {
      return {
        type: "enum",
        required: isRequired,
        enum: enumMatch[1].split(",").map((s) => s.trim()),
        unique: false,
      };
    }

    // Check for array shorthand
    const arrayMatch = cleanType.match(/^array<(.+)>$/);
    if (arrayMatch) {
      return {
        type: "array",
        required: isRequired,
        items: arrayMatch[1],
        unique: false,
      };
    }

    return {
      type: FieldTypeSchema.parse(cleanType),
      required: isRequired,
      unique: false,
    };
  }

  return field;
};

/**
 * Get normalized fields from a schema
 */
export const getNormalizedFields = (
  schema: JapavelSchema,
): Record<string, FieldDefinition> => {
  const normalized: Record<string, FieldDefinition> = {};

  for (const [name, field] of Object.entries(schema.Fields)) {
    normalized[name] = normalizeField(field);
  }

  return normalized;
};

/**
 * Validate schema relationships
 */
export const validateRelationships = (schemas: JapavelSchema[]): string[] => {
  const errors: string[] = [];
  const modelNames = new Set(schemas.map((s) => s.Model));

  for (const schema of schemas) {
    if (!schema.Relations) continue;

    for (const [name, relation] of Object.entries(schema.Relations)) {
      if (!modelNames.has(relation.model)) {
        errors.push(
          `${schema.Model}.${name}: References unknown model "${relation.model}"`,
        );
      }

      if (relation.type === "manyToMany" && !relation.through) {
        errors.push(
          `${schema.Model}.${name}: manyToMany relation requires "through" junction table`,
        );
      }
    }
  }

  return errors;
};
