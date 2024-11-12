"use client";

import { useProfile } from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

const passwordUpdateSchema = z.object({
    password: z.string(),
    newPassword: z
        .string()
        .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos 1 minuscula, 1 número, 1 símbolo y 1 número",
        }),
    confirmPassword: z
        .string()
        .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message:
                "La contraseña debe tener al menos 1 minuscula, 1 número, 1 símbolo y 1 número",
        }),
});
type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;

export function PasswordComponent() {
    const {
        onUpdatePassword,
        isLoadingUpdatePassword: isLoading,
        refetch,
    } = useProfile();

    const form = useForm<PasswordUpdateSchema>({
        resolver: zodResolver(passwordUpdateSchema),
        defaultValues: {
            password: "",
        },
    });

    const submitForm = (data: PasswordUpdateSchema) => {
        const updateData = {
            password: data.password,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        };
        onUpdatePassword(updateData).then(() => refetch());
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>
                    Cambia tu contraseña aquí.
                    <br />
                    Una vez tu contraseña se cambie, se cerrará tu sesión.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Form {...form}>
                    <form
                        className={cn(
                            "space-y-4",
                            isLoading && "animate-pulse",
                        )}
                        onSubmit={form.handleSubmit(submitForm)}
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña actual</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="········"
                                            type="password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña nueva</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="········"
                                            type="password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Confirmar contraseña nueva
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="········"
                                            type="password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={isLoading || !form.formState.isDirty}
                            type="submit"
                        >
                            {isLoading
                                ? "Actualizando..."
                                : "Actualizar contraseña"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
