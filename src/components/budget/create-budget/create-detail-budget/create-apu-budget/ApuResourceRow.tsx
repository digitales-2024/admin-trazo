import { ResourceApu } from "@/types";
import { Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ApuResourceRow({
    resource,
    onUpdate,
    onDelete,
    isEditable,
}: {
    resource: ResourceApu;
    onUpdate: (resource: ResourceApu) => void;
    onDelete: () => void;
    isEditable: boolean;
}) {
    const [editForm, setEditForm] = React.useState(resource);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedResource = {
            ...editForm,
            [name]:
                name === "quantity" || name === "unitCost"
                    ? Number(value)
                    : value,
        };
        updatedResource.totalCost =
            updatedResource.quantity * updatedResource.unitCost;
        setEditForm(updatedResource);
        onUpdate(updatedResource);
    };

    return (
        <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-sm">
            <Input
                name="name"
                value={editForm.name}
                onChange={handleChange}
                className="flex-grow capitalize"
                readOnly
            />
            <Input
                name="quantity"
                type="number"
                value={editForm.quantity}
                onChange={handleChange}
                className="w-20"
                readOnly={!isEditable}
            />
            <Input
                name="unit"
                value={editForm.unit}
                onChange={handleChange}
                className="w-20"
                readOnly
            />
            <Input
                name="unitCost"
                type="number"
                value={editForm.unitCost}
                onChange={handleChange}
                className="w-32"
                readOnly={!isEditable}
            />
            <span className="w-24 text-right font-bold">
                {editForm.totalCost.toFixed(2)}
            </span>
            {isEditable && (
                <Button variant="ghost" size="sm" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
