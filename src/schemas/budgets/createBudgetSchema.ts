import * as z from "zod";

export const createBudgetSchema = z.object({
    name: z
        .string()
        .min(1, { message: "El nombre del proyecto es obligatorio" }),
    ubication: z
        .string()
        .min(1, { message: "La ubicación del proyecto es obligatorio" }),
    clientId: z
        .string({ message: "El cliente es obligatorio" })
        .uuid({ message: "El cliente es obligatorio" }),
    dateProject: z
        .string()
        .min(1, { message: "La fecha del proyecto es obligatoria" }),
});

export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>;
