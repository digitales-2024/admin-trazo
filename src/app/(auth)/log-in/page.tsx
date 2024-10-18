"use client";

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

import { authApi } from "../authApi";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
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
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LogIn() {
    const { useLoginMutation } = authApi;
    const [login, { error, isError }] = useLoginMutation();
    const router = useRouter();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginSchema) {
        const loginResponse = await login(values).unwrap();
        const userRoles = loginResponse.roles;
        console.log(`Logged in, redirecting to landing page for ${JSON.stringify(userRoles)}`);
        // redirect to a different page, depending on the user role
        router.replace("/account");
    }

    return (
        <div className="flex h-screen w-full items-center justify-center py-12">
            <Card className={cn("w-[30rem]")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Inicia sesión
                    </CardTitle>
                    <CardDescription>
                        Inicia sesión para acceder al sistema de Trazo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="usuario@trazo.com"
                                                type="email"
                                                required
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
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Iniciar sesión</Button>
                        </form>
                    </Form>

                    {isError && (
                        <div className="my-2 rounded-md border border-red-700 bg-red-200 p-2 text-red-700">
                            {(error as Error)?.message}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
