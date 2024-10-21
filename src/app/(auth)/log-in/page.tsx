"use client";

import { authApi } from "@/redux/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
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
    const [login, { isLoading, error, isError, reset }] = useLoginMutation();
    const router = useRouter();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginSchema) {
        await login(values).unwrap();

        // TODO: redirect to a different page, depending on the user role
        router.replace("/");
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
                                                placeholder="usuario@trazoarq.com"
                                                type="email"
                                                required
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
                                                required
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={cn(isLoading && "animate-pulse")}
                            >
                                Iniciar sesión
                            </Button>
                        </form>
                    </Form>

                    {isError && (
                        <div className="my-2 grid grid-cols-[auto_3rem] gap-2 rounded-md border border-red-700 bg-red-200 p-2 text-red-700">
                            <span>{(error as Error)?.message}</span>
                            <button className="text-center" onClick={reset}>
                                <CircleX className="inline-block" />
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
