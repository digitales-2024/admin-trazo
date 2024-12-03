import { useResource } from "@/hooks/use-resource";
import { ResourceApu, ResourceType } from "@/types";
import React from "react";

import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApuResourceForm({
    onSubmit,
    resourceType,
}: {
    onSubmit: (resource: Omit<ResourceApu, "id" | "totalCost">) => void;
    resourceType: string;
}) {
    const [form, setForm] = React.useState<
        Omit<ResourceApu, "id" | "totalCost">
    >({
        name: "",
        quantity: 0,
        unit: "",
        unitCost: 0,
        type: ResourceType.LABOR,
    });

    const resourceNameToType: { [key: string]: ResourceType } = {
        Equipos: ResourceType.TOOLS,
        "Mano de Obra": ResourceType.LABOR,
        Insumos: ResourceType.SUPPLIES,
        Servicios: ResourceType.SERVICES,
    };
    const { resourceByType } = useResource({
        type: resourceNameToType[resourceType],
    });

    // Obtener opciones de cliente
    const resourceOptions: Option[] = (resourceByType ?? []).map(
        (resource) => ({
            value: resource.id.toString(),
            label: resource.name,
        }),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.name && form.quantity > 0 && form.unit && form.unitCost > 0) {
            onSubmit(form);
            setForm({
                name: "",
                quantity: 0,
                unit: "",
                unitCost: 0,
                type: ResourceType.LABOR,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative overflow-hidden px-3">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label
                        htmlFor="description"
                        className="mb-2 block text-base font-medium"
                    >
                        Nombre
                    </Label>
                    <AutoComplete
                        options={resourceOptions}
                        placeholder="Selecciona un recurso"
                        emptyMessage="No se encontraron recursos"
                        className="z-50"
                    />
                </div>
                <div>
                    <Label
                        htmlFor="quantity"
                        className="mb-2 block text-base font-medium"
                    >
                        Cantidad
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        placeholder="Ej: 50"
                        value={form.quantity || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                quantity: Number(e.target.value),
                            })
                        }
                        className="w-full rounded-lg border-2"
                    />
                </div>
                <div>
                    <Label
                        htmlFor="unit"
                        className="mb-2 block text-base font-medium"
                    >
                        Unidad
                    </Label>
                    <Input
                        id="unit"
                        placeholder="Ej: kg"
                        value={form.unit}
                        onChange={(e) =>
                            setForm({ ...form, unit: e.target.value })
                        }
                        className="w-full rounded-lg border-2 p-3"
                    />
                </div>
                <div className="col-span-2">
                    <Label
                        htmlFor="unitPrice"
                        className="mb-2 block text-base font-medium"
                    >
                        Precio Unitario
                    </Label>
                    <Input
                        id="unitPrice"
                        type="number"
                        placeholder="Ej: 2.50"
                        value={form.unitCost || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                unitCost: Number(e.target.value),
                            })
                        }
                        className="w-full rounded-lg border-2"
                    />
                </div>
            </div>
            <Button
                type="submit"
                className="mt-6 w-full transform rounded-lg px-4 py-3 font-bold text-white"
            >
                Agregar Recurso
            </Button>
        </form>
    );
}
