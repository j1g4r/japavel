import { z } from 'zod';
/**
 * DSL Schema Definition
 * Defines the structure of YAML-based schema definitions
 */
export declare const FieldTypeSchema: z.ZodEnum<["string", "number", "boolean", "date", "uuid", "email", "url", "int", "json", "array", "enum"]>;
export declare const FieldDefinitionSchema: z.ZodObject<{
    type: z.ZodEnum<["string", "number", "boolean", "date", "uuid", "email", "url", "int", "json", "array", "enum"]>;
    required: z.ZodDefault<z.ZodBoolean>;
    unique: z.ZodDefault<z.ZodBoolean>;
    default: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    minLength: z.ZodOptional<z.ZodNumber>;
    maxLength: z.ZodOptional<z.ZodNumber>;
    pattern: z.ZodOptional<z.ZodString>;
    enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    items: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "string" | "number" | "boolean" | "date" | "uuid" | "email" | "url" | "int" | "json" | "array" | "enum";
    required: boolean;
    unique: boolean;
    enum?: string[] | undefined;
    default?: string | number | boolean | undefined;
    min?: number | undefined;
    max?: number | undefined;
    minLength?: number | undefined;
    maxLength?: number | undefined;
    pattern?: string | undefined;
    items?: string | undefined;
    description?: string | undefined;
}, {
    type: "string" | "number" | "boolean" | "date" | "uuid" | "email" | "url" | "int" | "json" | "array" | "enum";
    enum?: string[] | undefined;
    required?: boolean | undefined;
    unique?: boolean | undefined;
    default?: string | number | boolean | undefined;
    min?: number | undefined;
    max?: number | undefined;
    minLength?: number | undefined;
    maxLength?: number | undefined;
    pattern?: string | undefined;
    items?: string | undefined;
    description?: string | undefined;
}>;
export type FieldDefinition = z.infer<typeof FieldDefinitionSchema>;
export declare const ViewConfigSchema: z.ZodObject<{
    type: z.ZodEnum<["table", "form", "card", "list", "detail"]>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "table" | "form" | "card" | "list" | "detail";
    fields?: string[] | undefined;
    sortable?: string[] | undefined;
    filterable?: string[] | undefined;
    searchable?: string[] | undefined;
}, {
    type: "table" | "form" | "card" | "list" | "detail";
    fields?: string[] | undefined;
    sortable?: string[] | undefined;
    filterable?: string[] | undefined;
    searchable?: string[] | undefined;
}>;
export type ViewConfig = z.infer<typeof ViewConfigSchema>;
export declare const ApiConfigSchema: z.ZodObject<{
    operations: z.ZodDefault<z.ZodArray<z.ZodEnum<["create", "read", "update", "delete", "list", "search"]>, "many">>;
    auth: z.ZodDefault<z.ZodEnum<["public", "authenticated", "admin"]>>;
    rateLimit: z.ZodOptional<z.ZodNumber>;
    pagination: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    operations: ("list" | "create" | "read" | "update" | "delete" | "search")[];
    auth: "public" | "authenticated" | "admin";
    pagination: boolean;
    rateLimit?: number | undefined;
}, {
    operations?: ("list" | "create" | "read" | "update" | "delete" | "search")[] | undefined;
    auth?: "public" | "authenticated" | "admin" | undefined;
    rateLimit?: number | undefined;
    pagination?: boolean | undefined;
}>;
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export declare const RelationshipSchema: z.ZodObject<{
    type: z.ZodEnum<["hasOne", "hasMany", "belongsTo", "manyToMany"]>;
    model: z.ZodString;
    foreignKey: z.ZodOptional<z.ZodString>;
    through: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "hasOne" | "hasMany" | "belongsTo" | "manyToMany";
    model: string;
    foreignKey?: string | undefined;
    through?: string | undefined;
}, {
    type: "hasOne" | "hasMany" | "belongsTo" | "manyToMany";
    model: string;
    foreignKey?: string | undefined;
    through?: string | undefined;
}>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export declare const JapavelSchemaSchema: z.ZodObject<{
    Model: z.ZodString;
    Fields: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodObject<{
        type: z.ZodEnum<["string", "number", "boolean", "date", "uuid", "email", "url", "int", "json", "array", "enum"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        default: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        pattern: z.ZodOptional<z.ZodString>;
        enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        items: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "number" | "boolean" | "date" | "uuid" | "email" | "url" | "int" | "json" | "array" | "enum";
        required: boolean;
        unique: boolean;
        enum?: string[] | undefined;
        default?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
        minLength?: number | undefined;
        maxLength?: number | undefined;
        pattern?: string | undefined;
        items?: string | undefined;
        description?: string | undefined;
    }, {
        type: "string" | "number" | "boolean" | "date" | "uuid" | "email" | "url" | "int" | "json" | "array" | "enum";
        enum?: string[] | undefined;
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
        minLength?: number | undefined;
        maxLength?: number | undefined;
        pattern?: string | undefined;
        items?: string | undefined;
        description?: string | undefined;
    }>]>>;
    View: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodObject<{
        type: z.ZodEnum<["table", "form", "card", "list", "detail"]>;
        fields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "table" | "form" | "card" | "list" | "detail";
        fields?: string[] | undefined;
        sortable?: string[] | undefined;
        filterable?: string[] | undefined;
        searchable?: string[] | undefined;
    }, {
        type: "table" | "form" | "card" | "list" | "detail";
        fields?: string[] | undefined;
        sortable?: string[] | undefined;
        filterable?: string[] | undefined;
        searchable?: string[] | undefined;
    }>]>>;
    API: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodObject<{
        operations: z.ZodDefault<z.ZodArray<z.ZodEnum<["create", "read", "update", "delete", "list", "search"]>, "many">>;
        auth: z.ZodDefault<z.ZodEnum<["public", "authenticated", "admin"]>>;
        rateLimit: z.ZodOptional<z.ZodNumber>;
        pagination: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        operations: ("list" | "create" | "read" | "update" | "delete" | "search")[];
        auth: "public" | "authenticated" | "admin";
        pagination: boolean;
        rateLimit?: number | undefined;
    }, {
        operations?: ("list" | "create" | "read" | "update" | "delete" | "search")[] | undefined;
        auth?: "public" | "authenticated" | "admin" | undefined;
        rateLimit?: number | undefined;
        pagination?: boolean | undefined;
    }>]>>;
    Relations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodEnum<["hasOne", "hasMany", "belongsTo", "manyToMany"]>;
        model: z.ZodString;
        foreignKey: z.ZodOptional<z.ZodString>;
        through: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "hasOne" | "hasMany" | "belongsTo" | "manyToMany";
        model: string;
        foreignKey?: string | undefined;
        through?: string | undefined;
    }, {
        type: "hasOne" | "hasMany" | "belongsTo" | "manyToMany";
        model: string;
        foreignKey?: string | undefined;
        through?: string | undefined;
    }>>>;
    Hooks: z.ZodOptional<z.ZodObject<{
        beforeCreate: z.ZodOptional<z.ZodString>;
        afterCreate: z.ZodOptional<z.ZodString>;
        beforeUpdate: z.ZodOptional<z.ZodString>;
        afterUpdate: z.ZodOptional<z.ZodString>;
        beforeDelete: z.ZodOptional<z.ZodString>;
        afterDelete: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    Model: string;
    Fields: Record<string, string | {
        type: "string" | "number" | "boolean" | "date" | "uuid" | "email" | "url" | "int" | "json" | "array" | "enum";
        required: boolean;
        unique: boolean;
        enum?: string[] | undefined;
        default?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
        minLength?: number | undefined;
        maxLength?: number | undefined;
        pattern?: string | undefined;
        items?: string | undefined;
        description?: string | undefined;
    }>;
    View?: string | {
        type: "table" | "form" | "card" | "list" | "detail";
        fields?: string[] | undefined;
        sortable?: string[] | undefined;
        filterable?: string[] | undefined;
        searchable?: string[] | undefined;
    } | undefined;
    API?: string | {
        operations: ("list" | "create" | "read" | "update" | "delete" | "search")[];
        auth: "public" | "authenticated" | "admin";
        pagination: boolean;
        rateLimit?: number | undefined;
    } | undefined;
    Relations?: Record<string, {
        type: "hasOne" | "hasMany" | "belongsTo" | "manyToMany";
        model: string;
        foreignKey?: string | undefined;
        through?: string | undefined;
    }> | undefined;
    Hooks?: {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    } | undefined;
}, {
    Model: string;
    Fields: Record<string, string | {
        type: "string" | "number" | "boolean" | "date" | "uuid" | "email" | "url" | "int" | "json" | "array" | "enum";
        enum?: string[] | undefined;
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
        minLength?: number | undefined;
        maxLength?: number | undefined;
        pattern?: string | undefined;
        items?: string | undefined;
        description?: string | undefined;
    }>;
    View?: string | {
        type: "table" | "form" | "card" | "list" | "detail";
        fields?: string[] | undefined;
        sortable?: string[] | undefined;
        filterable?: string[] | undefined;
        searchable?: string[] | undefined;
    } | undefined;
    API?: string | {
        operations?: ("list" | "create" | "read" | "update" | "delete" | "search")[] | undefined;
        auth?: "public" | "authenticated" | "admin" | undefined;
        rateLimit?: number | undefined;
        pagination?: boolean | undefined;
    } | undefined;
    Relations?: Record<string, {
        type: "hasOne" | "hasMany" | "belongsTo" | "manyToMany";
        model: string;
        foreignKey?: string | undefined;
        through?: string | undefined;
    }> | undefined;
    Hooks?: {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    } | undefined;
}>;
export type JapavelSchema = z.infer<typeof JapavelSchemaSchema>;
export interface JapavelSchemaLegacy {
    Model: string;
    Fields: Record<string, string>;
    View?: string;
    API?: string;
}
/**
 * Parse a DSL file and return a validated JapavelSchema
 */
export declare const parseDSL: (filePath: string) => JapavelSchema;
/**
 * Parse DSL content directly (for testing or inline definitions)
 */
export declare const parseDSLContent: (content: string) => JapavelSchema;
/**
 * Parse a directory of DSL files
 */
export declare const parseDSLDirectory: (dirPath: string) => JapavelSchema[];
/**
 * Normalize field definition to full form
 */
export declare const normalizeField: (field: string | FieldDefinition) => FieldDefinition;
/**
 * Get normalized fields from a schema
 */
export declare const getNormalizedFields: (schema: JapavelSchema) => Record<string, FieldDefinition>;
/**
 * Validate schema relationships
 */
export declare const validateRelationships: (schemas: JapavelSchema[]) => string[];
//# sourceMappingURL=parser.d.ts.map