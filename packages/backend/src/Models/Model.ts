import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export abstract class Model {
  // Static prisma instance for easy access
  protected static db = prisma;

  // ActiveRecord style method stubs could go here
  // e.g., static find(id: number) { return this.db[modelName].findUnique(...) }
}
