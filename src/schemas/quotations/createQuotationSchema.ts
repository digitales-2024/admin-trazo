import * as z from "zod";

export const createHeadQuotationSchema = z.object({
    name: z.string().min(1, { message: "El nombre es obligatorio" }),
    description: z
        .string()
        .min(1, { message: "La descripción es obligatoria" }),
    clientId: z.string().uuid({ message: "El cliente es obligatorio" }),
    deliveryTime: z
        .number()
        .min(1, { message: "El plazo de entrega debe ser al menos 1 mes" }),
    landArea: z
        .number()
        .min(1, { message: "El área del terreno debe ser al menos 1 m²" }),
});

export type CreateHeadQuotationSchema = z.infer<
    typeof createHeadQuotationSchema
>;

export const createQuotationIntegralProjectSchema = z.object({
    architecturalCost: z.number().min(1, {
        message: "El costo del proyecto arquitectónico debe ser mayor a 0",
    }),
    structuralCost: z.number().min(1, {
        message: "El costo del proyecto estructural debe ser mayor a 0",
    }),
    electricCost: z.number().min(1, {
        message: "El costo del proyecto eléctrico debe ser mayor a 0",
    }),
    sanitaryCost: z.number().min(1, {
        message: "El costo del proyecto sanitario debe ser mayor a 0",
    }),
});

export type CreateQuotationIntegralProjectSchema = z.infer<
    typeof createQuotationIntegralProjectSchema
>;