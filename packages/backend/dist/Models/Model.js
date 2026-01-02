import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export class Model {
    // Static prisma instance for easy access
    static db = prisma;
}
