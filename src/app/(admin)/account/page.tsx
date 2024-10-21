"use client";

import { adminApi } from "@/redux/services/adminApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { QueryError } from "@/redux/baseQuery";

const profileUpdateSchema = z.object({
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
    telephone: z.string().min(6),
});

type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;

export default function Account() {
    const { useProfileQuery } = adminApi;
    const profileQuery = useProfileQuery();

    const form = useForm<ProfileUpdateSchema>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            email: profileQuery.data?.email ?? "",
            password: "",
            telephone: profileQuery.data?.phone ?? "",
        },
    });

    // When the user profile loads, prepopulate the form data.
    useEffect(() => {
        if (profileQuery.isSuccess) {
            const profile = profileQuery.data;
            form.setValue("email", profile.email);
            form.setValue("telephone", profile.phone);
        }
    }, [form, profileQuery]);

    // If the user profile fails to load, show a notification
    useEffect(() => {
        if (profileQuery.isError) {
            const error = profileQuery.error as QueryError;
            toast.error(error.message);
        }
    }, [profileQuery]);

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
                                    profileQuery.isLoading && "animate-pulse",
                                )}
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Cargando..."
                                                    required
                                                    type="email"
                                                    disabled={
                                                        profileQuery.isLoading
                                                    }
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
                                                    required
                                                    disabled={
                                                        profileQuery.isLoading
                                                    }
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
                                                    required
                                                    disabled={
                                                        profileQuery.isLoading
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled type="submit">
                                    Actualizar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
