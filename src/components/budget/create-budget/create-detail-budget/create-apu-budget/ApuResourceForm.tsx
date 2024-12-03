// src/components/budget/create-budget/create-detail-budget/create-apu-budget/ApuResourceForm.tsx
import { useResource } from "@/hooks/use-resource";
import { ResourceApu, ResourceType } from "@/types";
import React from "react";
import { useForm, useWatch } from "react-hook-form";

import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ApuResourceFormProps = {
    onSubmit: (resource: Omit<ResourceApu, "id" | "totalCost">) => void;
    resourceType: string;
    performance: number;
    workHours: number;
};

export default function ApuResourceForm({
    onSubmit,
    resourceType,
    performance,
    workHours,
}: ApuResourceFormProps) {
    const form = useForm<Omit<ResourceApu, "id" | "totalCost">>({
        defaultValues: {
            name: "",
            unit: "",
            unitCost: 0,
            type: ResourceType.LABOR,
            group: 0,
            quantity: 0,
        },
    });

    const groupValue = useWatch({
        control: form.control,
        name: "group",
        defaultValue: 0,
    });

    React.useEffect(() => {
        if (resourceType === "Mano de Obra") {
            const calculatedQuantity =
                (Number(groupValue) * workHours) / performance || 0;
            form.setValue("quantity", calculatedQuantity);
        }
    }, [resourceType, groupValue, workHours, performance, form]);

    const [isAddingResource, setIsAddingResource] = React.useState(false);
    const handleCancelAddResource = () => {
        setIsAddingResource(false);
        form.reset();
    };
    const handleAddResource = () => {
        setIsAddingResource(true);
    };

    const resourceNameToType: { [key: string]: ResourceType } = {
        Equipos: ResourceType.TOOLS,
        "Mano de Obra": ResourceType.LABOR,
        Insumos: ResourceType.SUPPLIES,
        Servicios: ResourceType.SERVICES,
    };

    const { resourceByType } = useResource({
        type: resourceNameToType[resourceType],
    });

    // Obtener opciones de recurso con solo value y label
    const resourceOptions: Option[] = (resourceByType ?? []).map(
        (resource) => ({
            value: resource.id.toString(),
            label: resource.name,
        }),
    );

    const handleFormSubmit = (data: Omit<ResourceApu, "id" | "totalCost">) => {
        if (data.name && data.quantity > 0 && data.unit && data.unitCost > 0) {
            onSubmit(data);
            form.reset();
            setIsAddingResource(false);
        }
    };

    const handleResourceChange = (selectedOption: Option | undefined) => {
        if (selectedOption) {
            // Encontrar el recurso correspondiente por ID
            const selectedResource = resourceByType.find(
                (resource) => resource.id.toString() === selectedOption.value,
            );

            if (selectedResource) {
                form.setValue("name", selectedResource.name);
                form.setValue("unit", selectedResource.unit);
                form.setValue("unitCost", selectedResource.unitCost);
            }
        } else {
            // Si no hay selección, limpiar los campos
            form.setValue("name", "");
            form.setValue("unit", "");
            form.setValue("unitCost", 0);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="relative overflow-hidden px-3"
            >
                {isAddingResource ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Campo Nombre con AutoComplete */}
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: "El nombre es requerido." }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <AutoComplete
                                                {...field}
                                                options={resourceOptions}
                                                placeholder="Selecciona un recurso"
                                                emptyMessage="No se encontraron recursos"
                                                onValueChange={(
                                                    selectedOption,
                                                ) => {
                                                    handleResourceChange(
                                                        selectedOption,
                                                    );
                                                }}
                                                value={
                                                    resourceOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) || undefined
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Campo Unidad */}
                            <FormField
                                control={form.control}
                                name="unit"
                                rules={{ required: "La unidad es requerida." }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese la unidad"
                                                {...field}
                                                disabled
                                                readOnly
                                                className="cursor-not-allowed bg-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Campo Cuadrilla */}
                            {resourceType === "Mano de Obra" && (
                                <FormField
                                    control={form.control}
                                    name="group"
                                    rules={{
                                        required: "La cuadrilla es requerida.",
                                        min: {
                                            value: 1,
                                            message:
                                                "La cuadrilla debe ser al menos 1.",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cuadrilla</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Ingrese la cuadrilla"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Campo Cantidad */}
                            <FormField
                                control={form.control}
                                name="quantity"
                                rules={{
                                    required: "La cantidad es requerida.",
                                    min: {
                                        value: 0,
                                        message:
                                            "La cantidad debe ser al menos 1.",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ingrese la cantidad"
                                                {...field}
                                                disabled={
                                                    resourceType ===
                                                    "Mano de Obra"
                                                }
                                                readOnly={
                                                    resourceType ===
                                                    "Mano de Obra"
                                                }
                                                className={
                                                    resourceType ===
                                                    "Mano de Obra"
                                                        ? "cursor-not-allowed bg-gray-100"
                                                        : ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Campo Precio Unitario */}
                            <FormField
                                control={form.control}
                                name="unitCost"
                                rules={{
                                    required:
                                        "El precio unitario es requerido.",
                                    min: {
                                        value: 0.01,
                                        message:
                                            "El precio unitario debe ser mayor a 0.",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio Unitario</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ej: 2.50"
                                                step="0.01"
                                                {...field}
                                                disabled
                                                readOnly
                                                className="cursor-not-allowed bg-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={handleCancelAddResource}
                                variant="destructive"
                                className="mt-6"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    form.handleSubmit(handleFormSubmit)()
                                }
                                className="mt-6"
                            >
                                Agregar
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button onClick={handleAddResource}>Agregar Recurso</Button>
                )}
            </form>
        </Form>
    );
}
