import { z } from "zod";

export const updatePasswordSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: "Ingrese su email",
        })
        .email({
            message: "Email no válido",
        }),

    password: z.string().min(1, {
        message: "Ingrese su contraseña",
    }),
    newPassword: z
        .string()
        .min(6, {
            message: "La contraseña debe tener mínimo 6 caracteres",
        })
        .regex(/(?:(?=.\d)|(?=.\W+))(?![.\n])(?=.[A-Z])(?=.[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
        }),
    confirmPassword: z
        .string()
        .min(6, {
            message: "La contraseña debe tener mínimo 6 caracteres",
        })
        .regex(/(?:(?=.\d)|(?=.\W+))(?![.\n])(?=.[A-Z])(?=.[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
        }),
});
