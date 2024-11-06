import * as z from "zod";

export const createQuotationSchema = z.object({
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
    discount: z.number().min(1, {
        message: "El descuento debe ser mayor a 0",
    }),
    exchangeRate: z.number().min(1, {
        message: "El tipo de cambio debe ser mayor a 0",
    }),
});

export const updateQuotationSchema = createQuotationSchema.extend({
    totalAmount: z.number().min(1, {
        message: "El monto total debe ser mayor a 0",
    }),
});

export type CreateQuotationSchema = z.infer<typeof createQuotationSchema>;
export type UpdateQuotationSchema = z.infer<typeof updateQuotationSchema>;
