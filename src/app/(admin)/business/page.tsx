"use client";

import { useBusiness } from "@/hooks/use-business";
import {
    updateBusinessSchema,
    UpdateBusinessSchema,
} from "@/schemas/business/CreateBusinessSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function BusinessPage() {
    const [isCreatePending, startCreateTransition] = useTransition();
    const {
        data: business,
        isLoading,
        onCreateBusiness,
        onUpdateBusiness,
    } = useBusiness();

    const form = useForm<UpdateBusinessSchema>({
        resolver: zodResolver(updateBusinessSchema),
        defaultValues: {
            name: "",
            ruc: "",
            address: "",
            legalRepName: "",
            legalRepDni: "",
        },
    });

    // When the user profile loads, prepopulate the form data.
    useEffect(() => {
        if (business?.length === 1) {
            form.setValue("name", business[0].name);
            form.setValue("ruc", business[0].ruc);
            form.setValue("address", business[0].address);
            form.setValue("legalRepName", business[0].legalRepName);
            form.setValue("legalRepDni", business[0].legalRepDni);
        }
    }, [form, business]);

    function onSubmit(values: UpdateBusinessSchema) {
        startCreateTransition(async () => {
            if (business?.length === 1) {
                await onUpdateBusiness({ id: business[0].id, ...values });
            } else {
                await onCreateBusiness(values);
            }
        });
    }

    return (
        <div>
            <div className="pb-8 pt-16">
                <h2 className="pb-2 text-4xl font-black">Negocio</h2>
                <p className="text-sm text-muted-foreground">
                    Gestiona la información del negocio
                </p>
            </div>

            <Card className="pt-6">
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre del negocio
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ejm: ACME Inc"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Este se mostrará en los contratos
                                            generados por el sistema.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ruc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RUC del negocio</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ejm: 11122233344"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Este se mostrará en los contratos
                                            generados por el sistema.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ejm: Av. Las Palmeras 123"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Este se mostrará en los contratos
                                            generados por el sistema.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="legalRepName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre del representante legal
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ejm: Juan Perez"
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
                                name="legalRepDni"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            DNI del representante legal
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ejm: 77665544"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={isCreatePending}
                                className="w-full"
                            >
                                {isCreatePending && (
                                    <RefreshCcw
                                        className="mr-2 size-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                )}
                                Actualizar información
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
