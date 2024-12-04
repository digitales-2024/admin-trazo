import { ResourceApu, ResourceType } from "@/types";
import { Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApuResourceRowProps {
    resource: ResourceApu;
    onUpdate: (resource: ResourceApu) => void;
    onDelete: () => void;
    isEditable: boolean;
    performance: number;
    workHours: number;
}

const resourceTypeNamesInverted: { [key: string]: ResourceType } = {
    Herramientas: ResourceType.TOOLS,
    "Mano de Obra": ResourceType.LABOR,
    Insumos: ResourceType.SUPPLIES,
    Servicios: ResourceType.SERVICES,
};
const getResourceTypeInEnglish = (
    typeInSpanish: string,
): ResourceType | undefined => {
    return resourceTypeNamesInverted[typeInSpanish];
};

export default function ApuResourceRow({
    resource,
    onUpdate,
    onDelete,
    isEditable,
    performance,
    workHours,
}: ApuResourceRowProps) {
    // Estado local para manejar el formulario de edición
    const [editForm, setEditForm] = React.useState<ResourceApu>(resource);

    // Efecto para recalcular la cantidad si el tipo es "Mano de Obra"
    React.useEffect(() => {
        if (getResourceTypeInEnglish(resource.type) === ResourceType.LABOR) {
            const calculatedQuantity =
                (Number(editForm.group) * workHours) / performance || 0;
            if (calculatedQuantity !== editForm.quantity) {
                const updatedResource = {
                    ...editForm,
                    quantity: calculatedQuantity,
                    totalCost: calculatedQuantity * editForm.unitCost,
                };
                setEditForm(updatedResource);
                onUpdate(updatedResource);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editForm.group, resource.type, workHours, performance]);

    // Maneja los cambios en los campos de entrada
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let updatedResource = { ...editForm };

        if (name === "quantity" || name === "unitCost" || name === "group") {
            const numericValue = Number(value);
            if (!isNaN(numericValue)) {
                updatedResource = {
                    ...updatedResource,
                    [name]: numericValue,
                };
            }
        } else {
            updatedResource = {
                ...updatedResource,
                [name]: value,
            };
        }

        // Si se actualiza "unitCost", recalcular "totalCost"
        if (name === "quantity" || name === "unitCost") {
            updatedResource.totalCost =
                updatedResource.quantity * updatedResource.unitCost;
        }

        setEditForm(updatedResource);
        onUpdate(updatedResource);
    };
    return (
        <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-sm">
            {/* Campo Nombre - Solo Lectura */}
            <Input
                name="name"
                value={editForm.name}
                onChange={handleChange}
                className="flex-grow capitalize"
                readOnly
            />

            {/* Campo Cuadrilla - Solo si es Mano de Obra */}
            {getResourceTypeInEnglish(editForm.type) === ResourceType.LABOR && (
                <Input
                    name="group"
                    type="number"
                    value={editForm.group}
                    onChange={handleChange}
                    className="w-20"
                    readOnly={!isEditable}
                    placeholder="Cuadrilla"
                    min={1}
                />
            )}

            {/* Campo Cantidad */}
            <Input
                name="quantity"
                type="number"
                value={editForm.quantity}
                onChange={handleChange}
                className="w-20"
                readOnly={
                    getResourceTypeInEnglish(editForm.type) ===
                        ResourceType.LABOR || !isEditable
                }
                placeholder="Cantidad"
                min={1}
                step="0.0001"
            />

            {/* Campo Unidad - Solo Lectura */}
            <Input
                name="unit"
                value={editForm.unit}
                onChange={handleChange}
                className="w-20"
                readOnly
            />

            {/* Campo Precio Unitario */}
            <Input
                name="unitCost"
                type="number"
                value={editForm.unitCost}
                onChange={handleChange}
                className="w-32"
                readOnly={!isEditable}
                placeholder="Precio Unitario"
                step="0.01"
                min={0.01}
            />

            {/* Campo Costo Total - Solo Lectura */}
            <span className="w-24 text-right font-bold">
                {editForm.totalCost.toFixed(2)}
            </span>

            {/* Botón de Eliminar - Solo si es Editable */}
            {isEditable && (
                <Button variant="ghost" size="sm" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
