"use client";
import { useClients } from "@/hooks/use-client";
import { useDesignProject } from "@/hooks/use-design-project";
import { CreateBudgetSchema } from "@/schemas";
import { format, parse } from "date-fns";
import { FileUser, MapPinIcon } from "lucide-react";
import { useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-time-picker";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface HeadBudgetProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    form: UseFormReturn<CreateBudgetSchema>;
    clientIdUpdate?: string;
    designProjectIdUpdate?: string;
}

export const HeadBudget = ({
    form,
    clientIdUpdate,
    designProjectIdUpdate,
}: HeadBudgetProps) => {
    const { dataClientsAll } = useClients();
    const { dataDesignProjectCompleted } = useDesignProject();
    const isExistingDesignProject = form.watch("isExistingDesignProject");

    // Obtener opciones de cliente
    const designProjectOptions: Option[] = (
        dataDesignProjectCompleted ?? []
    ).map((project) => ({
        value: project.id.toString(),
        label: project.code,
    }));

    const handleDesignProjectChange = useCallback(
        (designProjectId: string) => {
            const selectedDesignProject = (
                dataDesignProjectCompleted ?? []
            ).find((project) => project.id.toString() === designProjectId);

            if (selectedDesignProject) {
                // Completar los campos automáticamente
                form.setValue("designProjectId", selectedDesignProject.id);
                form.setValue("name", selectedDesignProject.name);
                form.setValue(
                    "ubication",
                    selectedDesignProject.ubicationProject,
                );
                form.setValue("clientId", selectedDesignProject.client.id);
            } else {
                form.setValue("designProjectId", "");
                form.setValue("name", "");
                form.setValue("ubication", "");
                form.setValue("clientId", "");
            }
        },
        [dataDesignProjectCompleted, form],
    );

    useEffect(() => {
        if (designProjectIdUpdate && designProjectOptions.length > 0) {
            handleDesignProjectChange(designProjectIdUpdate);
        }
    }, [
        designProjectIdUpdate,
        designProjectOptions,
        handleDesignProjectChange,
    ]);

    // Obtener opciones de cliente
    const clientOptions: Option[] = (dataClientsAll ?? []).map((client) => ({
        value: client.id.toString(),
        label: client.name,
    }));

    const handleClientChange = useCallback(
        (clientId: string) => {
            const selectedClient = clientOptions.find(
                (option) => option.value === clientId,
            );
            if (selectedClient) {
                form.setValue("clientId", selectedClient.value);
            } else {
                form.setValue("clientId", "");
            }
        },
        [clientOptions, form],
    );

    useEffect(() => {
        if (clientIdUpdate && clientOptions.length > 0) {
            handleClientChange(clientIdUpdate);
        }
    }, [clientIdUpdate, clientOptions, handleClientChange]);

    // Cuando el switch se apaga, limpiar los campos relacionados con el proyecto de diseño
    useEffect(() => {
        if (!isExistingDesignProject) {
            // Limpiar los campos si el switch está apagado
            form.setValue("designProjectId", "");
            form.setValue("name", "");
            form.setValue("ubication", "");
            form.setValue("clientId", "");
        }
    }, [form, isExistingDesignProject]);

    return (
        <Card>
            <CardHeader>
                <div className="flex w-full justify-between">
                    <div className="flex w-full cursor-pointer items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileUser size={24} strokeWidth={1.5} />
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Información General
                            </CardTitle>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                <FormField
                    control={form.control}
                    name="isExistingDesignProject"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Proyecto de Diseño Existente
                                </FormLabel>
                                <FormDescription>
                                    Activar si este presupuesto es para un
                                    proyecto de diseño existente.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Campo condicional para el ID del proyecto de diseño */}
                {form.watch("isExistingDesignProject") && (
                    <FormField
                        control={form.control}
                        name="designProjectId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="designProjectId">
                                    Proyecto de Diseño
                                </FormLabel>
                                <FormControl>
                                    <AutoComplete
                                        options={designProjectOptions}
                                        placeholder="Selecciona un proyecto de diseño"
                                        emptyMessage="No se encontraron proyectos"
                                        value={
                                            designProjectOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || undefined
                                        }
                                        onValueChange={(option) => {
                                            field.onChange(option?.value || "");
                                            if (option?.value) {
                                                handleDesignProjectChange(
                                                    option.value,
                                                );
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Proyecto</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingrese el nombre del proyecto"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ubication"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ubicación</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Ingrese la ubicación del proyecto"
                                        className="pl-8"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dateProject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="dateProject">
                                Fecha del Proyecto
                            </FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={
                                        field.value
                                            ? parse(
                                                  field.value,
                                                  "yyyy-MM-dd",
                                                  new Date(),
                                              )
                                            : undefined
                                    }
                                    onChange={(date) => {
                                        if (date) {
                                            const formattedDate = format(
                                                date,
                                                "yyyy-MM-dd",
                                            );
                                            field.onChange(formattedDate);
                                        } else {
                                            field.onChange("");
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo de Cliente */}
                <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="clientId">
                                Propietario / Cliente
                            </FormLabel>
                            <FormControl>
                                <AutoComplete
                                    options={clientOptions}
                                    placeholder="Selecciona un cliente"
                                    emptyMessage="No se encontraron clientes"
                                    value={
                                        clientOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        ) || undefined
                                    }
                                    onValueChange={(option) => {
                                        field.onChange(option?.value || "");
                                    }}
                                    className="z-50"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
};
