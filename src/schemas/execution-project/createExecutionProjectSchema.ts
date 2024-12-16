import * as z from "zod";

export const executionProjectSchema = z.object({
    name: z
        .string({
            required_error: "El nombre del proyecto es obligatorio",
        })
        .min(2, {
            message: "El nombre del proyecto debe tener al menos 2 caracteres",
        }),

    ubicationProject: z
        .string({
            required_error: "La ubicación del proyecto es obligatoria",
        })
        .min(2, {
            message:
                "La ubicación del proyecto debe tener al menos 2 caracteres",
        }),

    province: z.string().min(1, { message: "La provincia es obligatoria" }),

    department: z
        .string()
        .min(1, { message: "El departamento es obligatorio" }),

    clientId: z.string().min(1, { message: "El cliente es obligatorio" }),

    budgetId: z.string().min(1, { message: "El presupuesto es obligatorio" }),

    residentId: z.string().min(1, { message: "El residente es obligatorio" }),

    startProjectDate: z
        .string({
            required_error: "La fecha de inicio del proyecto es obligatoria",
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "La fecha de inicio del proyecto es obligatoria",
        }),

    executionTime: z
        .string({
            required_error: "El plazo de ejecución es obligatorio",
        })
        .min(1, {
            message: "El plazo de ejecución debe tener al menos 1 carácter",
        })
        .refine((val) => !isNaN(Number(val)), {
            message: "El plazo de ejecución debe ser un número",
        }),
});

export type CreateExecutionProjectSchema = z.infer<
    typeof executionProjectSchema
>;
