import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * RAG-Ready Documentation Format
 * Structured documentation optimized for Retrieval-Augmented Generation
 */

// Document metadata schema
export const DocumentMetadataSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: z.enum([
    'api',
    'component',
    'schema',
    'guide',
    'pattern',
    'pitfall',
    'example',
    'architecture',
    'troubleshooting',
  ]),
  tags: z.array(z.string()),
  created: z.string().datetime(),
  updated: z.string().datetime(),
  version: z.string(),
  source: z.string().optional(),
  relatedDocs: z.array(z.string()).default([]),
});

export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;

// Document section schema
export const DocumentSectionSchema = z.object({
  id: z.string(),
  heading: z.string(),
  level: z.number().int().min(1).max(6),
  content: z.string(),
  codeBlocks: z.array(z.object({
    language: z.string(),
    code: z.string(),
    filename: z.string().optional(),
    description: z.string().optional(),
  })).default([]),
  keywords: z.array(z.string()),
});

export type DocumentSection = z.infer<typeof DocumentSectionSchema>;

// Full RAG document schema
export const RAGDocumentSchema = z.object({
  metadata: DocumentMetadataSchema,
  summary: z.string().max(500),
  sections: z.array(DocumentSectionSchema),
  embeddings: z.record(z.array(z.number())).optional(),
  searchIndex: z.object({
    keywords: z.array(z.string()),
    concepts: z.array(z.string()),
    technologies: z.array(z.string()),
    problemsDomain: z.array(z.string()),
  }),
});

export type RAGDocument = z.infer<typeof RAGDocumentSchema>;

// Document collection schema
export const DocumentCollectionSchema = z.object({
  name: z.string(),
  version: z.string(),
  lastUpdated: z.string().datetime(),
  documents: z.array(RAGDocumentSchema),
  index: z.record(z.array(z.string())),
});

export type DocumentCollection = z.infer<typeof DocumentCollectionSchema>;

/**
 * RAG Document Builder
 */
export class RAGDocumentBuilder {
  private metadata: Partial<DocumentMetadata> = {};
  private summary = '';
  private sections: DocumentSection[] = [];
  private searchIndex = {
    keywords: [] as string[],
    concepts: [] as string[],
    technologies: [] as string[],
    problemsDomain: [] as string[],
  };

  /**
   * Set document metadata
   */
  setMetadata(metadata: Partial<Omit<DocumentMetadata, 'id' | 'created' | 'updated'>>): this {
    this.metadata = {
      ...this.metadata,
      ...metadata,
      id: crypto.randomUUID(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    return this;
  }

  /**
   * Set document summary
   */
  setSummary(summary: string): this {
    this.summary = summary.slice(0, 500);
    return this;
  }

  /**
   * Add a section
   */
  addSection(section: Omit<DocumentSection, 'id'>): this {
    this.sections.push({
      ...section,
      id: `section-${this.sections.length + 1}`,
    });

    // Auto-extract keywords
    this.searchIndex.keywords.push(...section.keywords);

    return this;
  }

  /**
   * Add search keywords
   */
  addKeywords(keywords: string[]): this {
    this.searchIndex.keywords.push(...keywords);
    return this;
  }

  /**
   * Add concepts (high-level ideas)
   */
  addConcepts(concepts: string[]): this {
    this.searchIndex.concepts.push(...concepts);
    return this;
  }

  /**
   * Add technologies
   */
  addTechnologies(technologies: string[]): this {
    this.searchIndex.technologies.push(...technologies);
    return this;
  }

  /**
   * Add problem domains
   */
  addProblemDomains(domains: string[]): this {
    this.searchIndex.problemsDomain.push(...domains);
    return this;
  }

  /**
   * Build the document
   */
  build(): RAGDocument {
    // Deduplicate search index
    this.searchIndex.keywords = [...new Set(this.searchIndex.keywords)];
    this.searchIndex.concepts = [...new Set(this.searchIndex.concepts)];
    this.searchIndex.technologies = [...new Set(this.searchIndex.technologies)];
    this.searchIndex.problemsDomain = [...new Set(this.searchIndex.problemsDomain)];

    return RAGDocumentSchema.parse({
      metadata: {
        id: this.metadata.id || crypto.randomUUID(),
        title: this.metadata.title || 'Untitled',
        type: this.metadata.type || 'guide',
        tags: this.metadata.tags || [],
        created: this.metadata.created || new Date().toISOString(),
        updated: this.metadata.updated || new Date().toISOString(),
        version: this.metadata.version || '1.0.0',
        source: this.metadata.source,
        relatedDocs: this.metadata.relatedDocs || [],
      },
      summary: this.summary,
      sections: this.sections,
      searchIndex: this.searchIndex,
    });
  }
}

/**
 * Parse Markdown to RAG Document
 */
export const parseMarkdownToRAG = (
  content: string,
  metadata: Partial<Omit<DocumentMetadata, 'id' | 'created' | 'updated'>>
): RAGDocument => {
  const builder = new RAGDocumentBuilder();
  builder.setMetadata(metadata);

  // Extract front matter if present
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    content = content.slice(frontMatterMatch[0].length);
    // Parse YAML front matter for additional metadata
  }

  // Extract summary (first paragraph)
  const firstParagraph = content.match(/^[^#\n]+/);
  if (firstParagraph) {
    builder.setSummary(firstParagraph[0].trim());
  }

  // Parse sections
  const sectionPattern = /^(#{1,6})\s+(.+?)$([\s\S]*?)(?=^#{1,6}\s|\z)/gm;
  let match;

  while ((match = sectionPattern.exec(content)) !== null) {
    const level = match[1].length;
    const heading = match[2].trim();
    const sectionContent = match[3].trim();

    // Extract code blocks
    const codeBlocks: DocumentSection['codeBlocks'] = [];
    const codePattern = /```(\w+)?\n([\s\S]*?)```/g;
    let codeMatch;

    while ((codeMatch = codePattern.exec(sectionContent)) !== null) {
      codeBlocks.push({
        language: codeMatch[1] || 'text',
        code: codeMatch[2].trim(),
      });
    }

    // Extract keywords (bold text, inline code)
    const keywords: string[] = [];
    const boldPattern = /\*\*(.+?)\*\*/g;
    const codeInlinePattern = /`([^`]+)`/g;

    let kwMatch;
    while ((kwMatch = boldPattern.exec(sectionContent)) !== null) {
      keywords.push(kwMatch[1].toLowerCase());
    }
    while ((kwMatch = codeInlinePattern.exec(sectionContent)) !== null) {
      keywords.push(kwMatch[1].toLowerCase());
    }

    builder.addSection({
      heading,
      level,
      content: sectionContent.replace(/```[\s\S]*?```/g, '').trim(),
      codeBlocks,
      keywords: [...new Set(keywords)],
    });
  }

  // Auto-detect technologies from content
  const techPatterns = [
    'react', 'typescript', 'javascript', 'node', 'prisma', 'trpc', 'zod',
    'tailwind', 'css', 'html', 'sql', 'graphql', 'rest', 'api',
  ];

  const detectedTech = techPatterns.filter(tech =>
    content.toLowerCase().includes(tech)
  );
  builder.addTechnologies(detectedTech);

  return builder.build();
};

/**
 * Document Collection Manager
 */
export class DocumentCollectionManager {
  private collection: DocumentCollection;
  private basePath: string;

  constructor(name: string, basePath: string) {
    this.basePath = basePath;
    this.collection = {
      name,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      documents: [],
      index: {},
    };
  }

  /**
   * Load collection from disk
   */
  async load(): Promise<void> {
    const filePath = path.join(this.basePath, 'rag-collection.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      this.collection = DocumentCollectionSchema.parse(JSON.parse(content));
    }
  }

  /**
   * Save collection to disk
   */
  async save(): Promise<void> {
    const filePath = path.join(this.basePath, 'rag-collection.json');
    fs.mkdirSync(this.basePath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(this.collection, null, 2));
  }

  /**
   * Add document to collection
   */
  addDocument(doc: RAGDocument): void {
    // Remove existing document with same ID
    this.collection.documents = this.collection.documents.filter(
      d => d.metadata.id !== doc.metadata.id
    );

    // Add new document
    this.collection.documents.push(doc);

    // Update index
    this.updateIndex(doc);

    // Update collection timestamp
    this.collection.lastUpdated = new Date().toISOString();
  }

  /**
   * Search documents
   */
  search(query: string, options?: {
    type?: DocumentMetadata['type'];
    tags?: string[];
    limit?: number;
  }): RAGDocument[] {
    const queryLower = query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/);

    let results = this.collection.documents.filter(doc => {
      // Type filter
      if (options?.type && doc.metadata.type !== options.type) {
        return false;
      }

      // Tags filter
      if (options?.tags?.length) {
        const hasTag = options.tags.some(tag =>
          doc.metadata.tags.includes(tag)
        );
        if (!hasTag) return false;
      }

      // Text search
      const searchText = [
        doc.metadata.title,
        doc.summary,
        ...doc.searchIndex.keywords,
        ...doc.searchIndex.concepts,
        ...doc.searchIndex.technologies,
        ...doc.sections.map(s => s.heading + ' ' + s.content),
      ].join(' ').toLowerCase();

      return queryTokens.every(token => searchText.includes(token));
    });

    // Sort by relevance (simple scoring)
    results.sort((a, b) => {
      const scoreA = this.calculateRelevance(a, queryTokens);
      const scoreB = this.calculateRelevance(b, queryTokens);
      return scoreB - scoreA;
    });

    // Apply limit
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get document by ID
   */
  getById(id: string): RAGDocument | undefined {
    return this.collection.documents.find(d => d.metadata.id === id);
  }

  /**
   * Get documents by type
   */
  getByType(type: DocumentMetadata['type']): RAGDocument[] {
    return this.collection.documents.filter(d => d.metadata.type === type);
  }

  /**
   * Get related documents
   */
  getRelated(docId: string, limit = 5): RAGDocument[] {
    const doc = this.getById(docId);
    if (!doc) return [];

    // Find documents with overlapping keywords/technologies
    const otherDocs = this.collection.documents.filter(d => d.metadata.id !== docId);

    return otherDocs
      .map(d => ({
        doc: d,
        score: this.calculateSimilarity(doc, d),
      }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.doc);
  }

  /**
   * Export collection for embedding generation
   */
  exportForEmbedding(): Array<{ id: string; text: string }> {
    return this.collection.documents.map(doc => ({
      id: doc.metadata.id,
      text: [
        doc.metadata.title,
        doc.summary,
        ...doc.sections.map(s => `${s.heading}: ${s.content}`),
        doc.searchIndex.keywords.join(', '),
      ].join('\n\n'),
    }));
  }

  /**
   * Calculate relevance score
   */
  private calculateRelevance(doc: RAGDocument, queryTokens: string[]): number {
    let score = 0;

    for (const token of queryTokens) {
      // Title match (high weight)
      if (doc.metadata.title.toLowerCase().includes(token)) {
        score += 10;
      }

      // Summary match
      if (doc.summary.toLowerCase().includes(token)) {
        score += 5;
      }

      // Keyword match
      if (doc.searchIndex.keywords.some(k => k.includes(token))) {
        score += 8;
      }

      // Technology match
      if (doc.searchIndex.technologies.some(t => t.includes(token))) {
        score += 6;
      }

      // Section heading match
      if (doc.sections.some(s => s.heading.toLowerCase().includes(token))) {
        score += 4;
      }

      // Content match
      if (doc.sections.some(s => s.content.toLowerCase().includes(token))) {
        score += 2;
      }
    }

    return score;
  }

  /**
   * Calculate similarity between documents
   */
  private calculateSimilarity(docA: RAGDocument, docB: RAGDocument): number {
    let score = 0;

    // Same type
    if (docA.metadata.type === docB.metadata.type) {
      score += 2;
    }

    // Overlapping tags
    const commonTags = docA.metadata.tags.filter(t =>
      docB.metadata.tags.includes(t)
    );
    score += commonTags.length * 3;

    // Overlapping keywords
    const commonKeywords = docA.searchIndex.keywords.filter(k =>
      docB.searchIndex.keywords.includes(k)
    );
    score += commonKeywords.length;

    // Overlapping technologies
    const commonTech = docA.searchIndex.technologies.filter(t =>
      docB.searchIndex.technologies.includes(t)
    );
    score += commonTech.length * 2;

    return score;
  }

  /**
   * Update search index
   */
  private updateIndex(doc: RAGDocument): void {
    // Index by type
    const typeKey = `type:${doc.metadata.type}`;
    if (!this.collection.index[typeKey]) {
      this.collection.index[typeKey] = [];
    }
    if (!this.collection.index[typeKey].includes(doc.metadata.id)) {
      this.collection.index[typeKey].push(doc.metadata.id);
    }

    // Index by tags
    for (const tag of doc.metadata.tags) {
      const tagKey = `tag:${tag}`;
      if (!this.collection.index[tagKey]) {
        this.collection.index[tagKey] = [];
      }
      if (!this.collection.index[tagKey].includes(doc.metadata.id)) {
        this.collection.index[tagKey].push(doc.metadata.id);
      }
    }

    // Index by technologies
    for (const tech of doc.searchIndex.technologies) {
      const techKey = `tech:${tech}`;
      if (!this.collection.index[techKey]) {
        this.collection.index[techKey] = [];
      }
      if (!this.collection.index[techKey].includes(doc.metadata.id)) {
        this.collection.index[techKey].push(doc.metadata.id);
      }
    }
  }
}

/**
 * Create document builder
 */
export const createDocumentBuilder = (): RAGDocumentBuilder => {
  return new RAGDocumentBuilder();
};

/**
 * Create collection manager
 */
export const createCollectionManager = (
  name: string,
  basePath: string
): DocumentCollectionManager => {
  return new DocumentCollectionManager(name, basePath);
};
