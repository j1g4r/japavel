import { z } from 'zod';
export declare const UserRoleSchema: z.ZodEnum<["admin", "user", "guest"]>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["admin", "user", "guest"]>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "guest";
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    role?: "admin" | "user" | "guest" | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
//# sourceMappingURL=user.d.ts.map