"use client";

import { useLogin } from "@/hooks/use-login";
import { authSchema } from "@/schemas";
import { Credentials } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { InputPassword } from "../common/forms";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const FormLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Credentials>({
        resolver: zodResolver(authSchema),
    });

    const { onLogin, isLoading } = useLogin();

    return (
        <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit(onLogin)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            {...register("email")}
                            placeholder="ejemplo@chaqchao.com"
                            autoComplete="email"
                        />
                        {errors.email?.message && (
                            <span className="text-xs text-red-500">
                                {errors.email?.message}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <InputPassword
                            id="password"
                            {...register("password")}
                            placeholder="********"
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <Button className="w-full select-none" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Autenticando...
                            </>
                        ) : (
                            "Ingresar"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
