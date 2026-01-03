import { z } from "zod";
/**
 * RAG-Ready Documentation Format
 * Structured documentation optimized for Retrieval-Augmented Generation
 */
export declare const DocumentMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    type: z.ZodEnum<{
        api: "api";
        component: "component";
        schema: "schema";
        guide: "guide";
        pattern: "pattern";
        pitfall: "pitfall";
        example: "example";
        architecture: "architecture";
        troubleshooting: "troubleshooting";
    }>;
    tags: z.ZodArray<z.ZodString>;
    created: z.ZodString;
    updated: z.ZodString;
    version: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    relatedDocs: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
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
    }, z.core.$strip>>>;
    keywords: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type DocumentSection = z.infer<typeof DocumentSectionSchema>;
export declare const RAGDocumentSchema: z.ZodObject<{
    metadata: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        type: z.ZodEnum<{
            api: "api";
            component: "component";
            schema: "schema";
            guide: "guide";
            pattern: "pattern";
            pitfall: "pitfall";
            example: "example";
            architecture: "architecture";
            troubleshooting: "troubleshooting";
        }>;
        tags: z.ZodArray<z.ZodString>;
        created: z.ZodString;
        updated: z.ZodString;
        version: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        relatedDocs: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
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
        }, z.core.$strip>>>;
        keywords: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    embeddings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodNumber>>>;
    searchIndex: z.ZodObject<{
        keywords: z.ZodArray<z.ZodString>;
        concepts: z.ZodArray<z.ZodString>;
        technologies: z.ZodArray<z.ZodString>;
        problemsDomain: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RAGDocument = z.infer<typeof RAGDocumentSchema>;
export declare const DocumentCollectionSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    lastUpdated: z.ZodString;
    documents: z.ZodArray<z.ZodObject<{
        metadata: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            type: z.ZodEnum<{
                api: "api";
                component: "component";
                schema: "schema";
                guide: "guide";
                pattern: "pattern";
                pitfall: "pitfall";
                example: "example";
                architecture: "architecture";
                troubleshooting: "troubleshooting";
            }>;
            tags: z.ZodArray<z.ZodString>;
            created: z.ZodString;
            updated: z.ZodString;
            version: z.ZodString;
            source: z.ZodOptional<z.ZodString>;
            relatedDocs: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
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
            }, z.core.$strip>>>;
            keywords: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
        embeddings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodNumber>>>;
        searchIndex: z.ZodObject<{
            keywords: z.ZodArray<z.ZodString>;
            concepts: z.ZodArray<z.ZodString>;
            technologies: z.ZodArray<z.ZodString>;
            problemsDomain: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    index: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
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
    setMetadata(metadata: Partial<Omit<DocumentMetadata, "id" | "created" | "updated">>): this;
    /**
     * Set document summary
     */
    setSummary(summary: string): this;
    /**
     * Add a section
     */
    addSection(section: Omit<DocumentSection, "id">): this;
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
        type?: DocumentMetadata["type"];
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
    getByType(type: DocumentMetadata["type"]): RAGDocument[];
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