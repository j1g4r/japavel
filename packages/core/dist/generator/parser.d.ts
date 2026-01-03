import { z } from "zod";
/**
 * DSL Schema Definition
 * Defines the structure of YAML-based schema definitions
 */
export declare const FieldTypeSchema: z.ZodEnum<{
    string: "string";
    number: "number";
    boolean: "boolean";
    date: "date";
    uuid: "uuid";
    email: "email";
    url: "url";
    int: "int";
    json: "json";
    array: "array";
    enum: "enum";
}>;
export declare const FieldDefinitionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        date: "date";
        uuid: "uuid";
        email: "email";
        url: "url";
        int: "int";
        json: "json";
        array: "array";
        enum: "enum";
    }>;
    required: z.ZodDefault<z.ZodBoolean>;
    unique: z.ZodDefault<z.ZodBoolean>;
    default: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    minLength: z.ZodOptional<z.ZodNumber>;
    maxLength: z.ZodOptional<z.ZodNumber>;
    pattern: z.ZodOptional<z.ZodString>;
    enum: z.ZodOptional<z.ZodArray<z.ZodString>>;
    items: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FieldDefinition = z.infer<typeof FieldDefinitionSchema>;
export declare const ViewConfigSchema: z.ZodObject<{
    type: z.ZodEnum<{
        table: "table";
        form: "form";
        card: "card";
        list: "list";
        detail: "detail";
    }>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sortable: z.ZodOptional<z.ZodArray<z.ZodString>>;
    filterable: z.ZodOptional<z.ZodArray<z.ZodString>>;
    searchable: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type ViewConfig = z.infer<typeof ViewConfigSchema>;
export declare const ApiConfigSchema: z.ZodObject<{
    operations: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        list: "list";
        create: "create";
        read: "read";
        update: "update";
        delete: "delete";
        search: "search";
    }>>>;
    auth: z.ZodDefault<z.ZodEnum<{
        public: "public";
        authenticated: "authenticated";
        admin: "admin";
    }>>;
    rateLimit: z.ZodOptional<z.ZodNumber>;
    pagination: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export declare const RelationshipSchema: z.ZodObject<{
    type: z.ZodEnum<{
        hasOne: "hasOne";
        hasMany: "hasMany";
        belongsTo: "belongsTo";
        manyToMany: "manyToMany";
    }>;
    model: z.ZodString;
    foreignKey: z.ZodOptional<z.ZodString>;
    through: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export declare const JapavelSchemaSchema: z.ZodObject<{
    Model: z.ZodString;
    Fields: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        type: z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
            date: "date";
            uuid: "uuid";
            email: "email";
            url: "url";
            int: "int";
            json: "json";
            array: "array";
            enum: "enum";
        }>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        pattern: z.ZodOptional<z.ZodString>;
        enum: z.ZodOptional<z.ZodArray<z.ZodString>>;
        items: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>;
    View: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        type: z.ZodEnum<{
            table: "table";
            form: "form";
            card: "card";
            list: "list";
            detail: "detail";
        }>;
        fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString>>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>]>>;
    API: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        operations: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            list: "list";
            create: "create";
            read: "read";
            update: "update";
            delete: "delete";
            search: "search";
        }>>>;
        auth: z.ZodDefault<z.ZodEnum<{
            public: "public";
            authenticated: "authenticated";
            admin: "admin";
        }>>;
        rateLimit: z.ZodOptional<z.ZodNumber>;
        pagination: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>]>>;
    Relations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodEnum<{
            hasOne: "hasOne";
            hasMany: "hasMany";
            belongsTo: "belongsTo";
            manyToMany: "manyToMany";
        }>;
        model: z.ZodString;
        foreignKey: z.ZodOptional<z.ZodString>;
        through: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    Hooks: z.ZodOptional<z.ZodObject<{
        beforeCreate: z.ZodOptional<z.ZodString>;
        afterCreate: z.ZodOptional<z.ZodString>;
        beforeUpdate: z.ZodOptional<z.ZodString>;
        afterUpdate: z.ZodOptional<z.ZodString>;
        beforeDelete: z.ZodOptional<z.ZodString>;
        afterDelete: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
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