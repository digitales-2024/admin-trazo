import * as z from "zod";

export const createBudgetSchema = z
    .object({
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
        isExistingDesignProject: z.boolean().optional(),
        designProjectId: z.string().optional(),
    })
    .refine(
        (data) => {
            // Si isExistingDesignProject es true, entonces designProjectId debe ser un string no vacío
            if (data.isExistingDesignProject) {
                return (
                    data.designProjectId &&
                    data.designProjectId.trim().length > 0
                );
            }
            return true;
        },
        {
            message: "Debe seleccionar un proyecto de diseño",
            path: ["designProjectId"],
        },
    );

export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>;
