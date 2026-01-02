import { z } from 'zod';
/**
 * RAG-Ready Documentation Format
 * Structured documentation optimized for Retrieval-Augmented Generation
 */
export declare const DocumentMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    type: z.ZodEnum<["api", "component", "schema", "guide", "pattern", "pitfall", "example", "architecture", "troubleshooting"]>;
    tags: z.ZodArray<z.ZodString, "many">;
    created: z.ZodString;
    updated: z.ZodString;
    version: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    relatedDocs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
    id: string;
    title: string;
    tags: string[];
    created: string;
    updated: string;
    version: string;
    relatedDocs: string[];
    source?: string | undefined;
}, {
    type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
    id: string;
    title: string;
    tags: string[];
    created: string;
    updated: string;
    version: string;
    source?: string | undefined;
    relatedDocs?: string[] | undefined;
}>;
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
export declare const DocumentSectionSchema: z.ZodObject<{
    id: z.ZodString;
    heading: z.ZodString;
    level: z.ZodNumber;
    content: z.ZodString;
    codeBlocks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        code: z.ZodString;
        filename: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        language: string;
        description?: string | undefined;
        filename?: string | undefined;
    }, {
        code: string;
        language: string;
        description?: string | undefined;
        filename?: string | undefined;
    }>, "many">>;
    keywords: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    heading: string;
    level: number;
    content: string;
    codeBlocks: {
        code: string;
        language: string;
        description?: string | undefined;
        filename?: string | undefined;
    }[];
    keywords: string[];
}, {
    id: string;
    heading: string;
    level: number;
    content: string;
    keywords: string[];
    codeBlocks?: {
        code: string;
        language: string;
        description?: string | undefined;
        filename?: string | undefined;
    }[] | undefined;
}>;
export type DocumentSection = z.infer<typeof DocumentSectionSchema>;
export declare const RAGDocumentSchema: z.ZodObject<{
    metadata: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        type: z.ZodEnum<["api", "component", "schema", "guide", "pattern", "pitfall", "example", "architecture", "troubleshooting"]>;
        tags: z.ZodArray<z.ZodString, "many">;
        created: z.ZodString;
        updated: z.ZodString;
        version: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        relatedDocs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
        id: string;
        title: string;
        tags: string[];
        created: string;
        updated: string;
        version: string;
        relatedDocs: string[];
        source?: string | undefined;
    }, {
        type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
        id: string;
        title: string;
        tags: string[];
        created: string;
        updated: string;
        version: string;
        source?: string | undefined;
        relatedDocs?: string[] | undefined;
    }>;
    summary: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        heading: z.ZodString;
        level: z.ZodNumber;
        content: z.ZodString;
        codeBlocks: z.ZodDefault<z.ZodArray<z.ZodObject<{
            language: z.ZodString;
            code: z.ZodString;
            filename: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            language: string;
            description?: string | undefined;
            filename?: string | undefined;
        }, {
            code: string;
            language: string;
            description?: string | undefined;
            filename?: string | undefined;
        }>, "many">>;
        keywords: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        heading: string;
        level: number;
        content: string;
        codeBlocks: {
            code: string;
            language: string;
            description?: string | undefined;
            filename?: string | undefined;
        }[];
        keywords: string[];
    }, {
        id: string;
        heading: string;
        level: number;
        content: string;
        keywords: string[];
        codeBlocks?: {
            code: string;
            language: string;
            description?: string | undefined;
            filename?: string | undefined;
        }[] | undefined;
    }>, "many">;
    embeddings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodNumber, "many">>>;
    searchIndex: z.ZodObject<{
        keywords: z.ZodArray<z.ZodString, "many">;
        concepts: z.ZodArray<z.ZodString, "many">;
        technologies: z.ZodArray<z.ZodString, "many">;
        problemsDomain: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        keywords: string[];
        concepts: string[];
        technologies: string[];
        problemsDomain: string[];
    }, {
        keywords: string[];
        concepts: string[];
        technologies: string[];
        problemsDomain: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    metadata: {
        type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
        id: string;
        title: string;
        tags: string[];
        created: string;
        updated: string;
        version: string;
        relatedDocs: string[];
        source?: string | undefined;
    };
    sections: {
        id: string;
        heading: string;
        level: number;
        content: string;
        codeBlocks: {
            code: string;
            language: string;
            description?: string | undefined;
            filename?: string | undefined;
        }[];
        keywords: string[];
    }[];
    searchIndex: {
        keywords: string[];
        concepts: string[];
        technologies: string[];
        problemsDomain: string[];
    };
    embeddings?: Record<string, number[]> | undefined;
}, {
    summary: string;
    metadata: {
        type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
        id: string;
        title: string;
        tags: string[];
        created: string;
        updated: string;
        version: string;
        source?: string | undefined;
        relatedDocs?: string[] | undefined;
    };
    sections: {
        id: string;
        heading: string;
        level: number;
        content: string;
        keywords: string[];
        codeBlocks?: {
            code: string;
            language: string;
            description?: string | undefined;
            filename?: string | undefined;
        }[] | undefined;
    }[];
    searchIndex: {
        keywords: string[];
        concepts: string[];
        technologies: string[];
        problemsDomain: string[];
    };
    embeddings?: Record<string, number[]> | undefined;
}>;
export type RAGDocument = z.infer<typeof RAGDocumentSchema>;
export declare const DocumentCollectionSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    lastUpdated: z.ZodString;
    documents: z.ZodArray<z.ZodObject<{
        metadata: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            type: z.ZodEnum<["api", "component", "schema", "guide", "pattern", "pitfall", "example", "architecture", "troubleshooting"]>;
            tags: z.ZodArray<z.ZodString, "many">;
            created: z.ZodString;
            updated: z.ZodString;
            version: z.ZodString;
            source: z.ZodOptional<z.ZodString>;
            relatedDocs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
            id: string;
            title: string;
            tags: string[];
            created: string;
            updated: string;
            version: string;
            relatedDocs: string[];
            source?: string | undefined;
        }, {
            type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
            id: string;
            title: string;
            tags: string[];
            created: string;
            updated: string;
            version: string;
            source?: string | undefined;
            relatedDocs?: string[] | undefined;
        }>;
        summary: z.ZodString;
        sections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            heading: z.ZodString;
            level: z.ZodNumber;
            content: z.ZodString;
            codeBlocks: z.ZodDefault<z.ZodArray<z.ZodObject<{
                language: z.ZodString;
                code: z.ZodString;
                filename: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }, {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }>, "many">>;
            keywords: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            heading: string;
            level: number;
            content: string;
            codeBlocks: {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }[];
            keywords: string[];
        }, {
            id: string;
            heading: string;
            level: number;
            content: string;
            keywords: string[];
            codeBlocks?: {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }[] | undefined;
        }>, "many">;
        embeddings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodNumber, "many">>>;
        searchIndex: z.ZodObject<{
            keywords: z.ZodArray<z.ZodString, "many">;
            concepts: z.ZodArray<z.ZodString, "many">;
            technologies: z.ZodArray<z.ZodString, "many">;
            problemsDomain: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            keywords: string[];
            concepts: string[];
            technologies: string[];
            problemsDomain: string[];
        }, {
            keywords: string[];
            concepts: string[];
            technologies: string[];
            problemsDomain: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        metadata: {
            type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
            id: string;
            title: string;
            tags: string[];
            created: string;
            updated: string;
            version: string;
            relatedDocs: string[];
            source?: string | undefined;
        };
        sections: {
            id: string;
            heading: string;
            level: number;
            content: string;
            codeBlocks: {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }[];
            keywords: string[];
        }[];
        searchIndex: {
            keywords: string[];
            concepts: string[];
            technologies: string[];
            problemsDomain: string[];
        };
        embeddings?: Record<string, number[]> | undefined;
    }, {
        summary: string;
        metadata: {
            type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
            id: string;
            title: string;
            tags: string[];
            created: string;
            updated: string;
            version: string;
            source?: string | undefined;
            relatedDocs?: string[] | undefined;
        };
        sections: {
            id: string;
            heading: string;
            level: number;
            content: string;
            keywords: string[];
            codeBlocks?: {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }[] | undefined;
        }[];
        searchIndex: {
            keywords: string[];
            concepts: string[];
            technologies: string[];
            problemsDomain: string[];
        };
        embeddings?: Record<string, number[]> | undefined;
    }>, "many">;
    index: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    lastUpdated: string;
    documents: {
        summary: string;
        metadata: {
            type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
            id: string;
            title: string;
            tags: string[];
            created: string;
            updated: string;
            version: string;
            relatedDocs: string[];
            source?: string | undefined;
        };
        sections: {
            id: string;
            heading: string;
            level: number;
            content: string;
            codeBlocks: {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }[];
            keywords: string[];
        }[];
        searchIndex: {
            keywords: string[];
            concepts: string[];
            technologies: string[];
            problemsDomain: string[];
        };
        embeddings?: Record<string, number[]> | undefined;
    }[];
    index: Record<string, string[]>;
}, {
    name: string;
    version: string;
    lastUpdated: string;
    documents: {
        summary: string;
        metadata: {
            type: "pattern" | "api" | "component" | "schema" | "guide" | "pitfall" | "example" | "architecture" | "troubleshooting";
            id: string;
            title: string;
            tags: string[];
            created: string;
            updated: string;
            version: string;
            source?: string | undefined;
            relatedDocs?: string[] | undefined;
        };
        sections: {
            id: string;
            heading: string;
            level: number;
            content: string;
            keywords: string[];
            codeBlocks?: {
                code: string;
                language: string;
                description?: string | undefined;
                filename?: string | undefined;
            }[] | undefined;
        }[];
        searchIndex: {
            keywords: string[];
            concepts: string[];
            technologies: string[];
            problemsDomain: string[];
        };
        embeddings?: Record<string, number[]> | undefined;
    }[];
    index: Record<string, string[]>;
}>;
export type DocumentCollection = z.infer<typeof DocumentCollectionSchema>;
/**
 * RAG Document Builder
 */
export declare class RAGDocumentBuilder {
    private metadata;
    private summary;
    private sections;
    private searchIndex;
    /**
     * Set document metadata
     */
    setMetadata(metadata: Partial<Omit<DocumentMetadata, 'id' | 'created' | 'updated'>>): this;
    /**
     * Set document summary
     */
    setSummary(summary: string): this;
    /**
     * Add a section
     */
    addSection(section: Omit<DocumentSection, 'id'>): this;
    /**
     * Add search keywords
     */
    addKeywords(keywords: string[]): this;
    /**
     * Add concepts (high-level ideas)
     */
    addConcepts(concepts: string[]): this;
    /**
     * Add technologies
     */
    addTechnologies(technologies: string[]): this;
    /**
     * Add problem domains
     */
    addProblemDomains(domains: string[]): this;
    /**
     * Build the document
     */
    build(): RAGDocument;
}
/**
 * Parse Markdown to RAG Document
 */
export declare const parseMarkdownToRAG: (content: string, metadata: Partial<Omit<DocumentMetadata, "id" | "created" | "updated">>) => RAGDocument;
/**
 * Document Collection Manager
 */
export declare class DocumentCollectionManager {
    private collection;
    private basePath;
    constructor(name: string, basePath: string);
    /**
     * Load collection from disk
     */
    load(): Promise<void>;
    /**
     * Save collection to disk
     */
    save(): Promise<void>;
    /**
     * Add document to collection
     */
    addDocument(doc: RAGDocument): void;
    /**
     * Search documents
     */
    search(query: string, options?: {
        type?: DocumentMetadata['type'];
        tags?: string[];
        limit?: number;
    }): RAGDocument[];
    /**
     * Get document by ID
     */
    getById(id: string): RAGDocument | undefined;
    /**
     * Get documents by type
     */
    getByType(type: DocumentMetadata['type']): RAGDocument[];
    /**
     * Get related documents
     */
    getRelated(docId: string, limit?: number): RAGDocument[];
    /**
     * Export collection for embedding generation
     */
    exportForEmbedding(): Array<{
        id: string;
        text: string;
    }>;
    /**
     * Calculate relevance score
     */
    private calculateRelevance;
    /**
     * Calculate similarity between documents
     */
    private calculateSimilarity;
    /**
     * Update search index
     */
    private updateIndex;
}
/**
 * Create document builder
 */
export declare const createDocumentBuilder: () => RAGDocumentBuilder;
/**
 * Create collection manager
 */
export declare const createCollectionManager: (name: string, basePath: string) => DocumentCollectionManager;
//# sourceMappingURL=rag-format.d.ts.map