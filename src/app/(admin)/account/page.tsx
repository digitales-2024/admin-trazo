"use client";

import { useProfile } from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

const profileUpdateSchema = z.object({
    name: z.string().min(1, {
        message: "Ingrese su nuevo nombre",
    }),
    password: z.string(),
    telephone: z.string().min(6),
});

type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;

export default function Account() {
    const { user, onUpdate, isLoading, isSuccess, refetch } = useProfile();

    const form = useForm<ProfileUpdateSchema>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            name: user?.email ?? "",
            password: "",
            telephone: user?.phone ?? "",
        },
    });

    // When the user profile loads, prepopulate the form data.
    useEffect(() => {
        if (user !== undefined) {
            form.setValue("name", user?.name ?? "");
            form.setValue("telephone", user?.phone ?? "");
        }
    }, [form, user, isSuccess]);

    const submitForm = (data: ProfileUpdateSchema) => {
        const updateData = {
            id: user?.id ?? "",
            roles: user?.roles.map((role) => role.id) ?? [],
            name: data.name ?? "",
            phone: data?.telephone ?? "",
        };
        onUpdate(updateData).then(() => refetch());
    };

    return (
        <div>
            <div className="pb-8 pt-16">
                <h2 className="pb-2 text-4xl font-black">Mi cuenta</h2>
                <p className="text-sm text-muted-foreground">
                    Configura la información de tu cuenta
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className={cn("text-2xl")}>
                            Datos personales
                        </CardTitle>
                        <CardDescription>
                            Revisa y actualiza tu información personal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Cargando..."
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
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña</FormLabel>
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
                                    name="telephone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Número de teléfono
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Cargando..."
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={
                                        isLoading || !form.formState.isDirty
                                    }
                                    type="submit"
                                >
                                    {isLoading
                                        ? "Actualizando..."
                                        : "Actualizar información"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
