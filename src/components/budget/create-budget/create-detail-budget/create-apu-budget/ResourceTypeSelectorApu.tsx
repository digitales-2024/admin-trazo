import { ResourceType } from "@/types";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ResourceTypeSelectorApuProps {
    newResourceType: string;
    setNewResourceType: React.Dispatch<React.SetStateAction<string>>;
    handleConfirmAddResourceType: () => void;
    handleCancelAddResourceType: () => void;
    isAddingResourceType: boolean;
    handleAddResourceType: () => void;
    resourceTypes: { name: string }[];
}

const resourceTypeOptions = [
    { value: "TOOLS", label: "Herramientas" },
    { value: "LABOR", label: "Mano de obra" },
    { value: "SUPPLIES", label: "Insumos" },
    { value: "SERVICES", label: "Servicios" },
];

const resourceTypeNames: { [key in ResourceType]: string } = {
    [ResourceType.TOOLS]: "Herramientas",
    [ResourceType.LABOR]: "Mano de Obra",
    [ResourceType.SUPPLIES]: "Insumos",
    [ResourceType.SERVICES]: "Servicios",
};

export function ResourceTypeSelectorApu({
    newResourceType,
    setNewResourceType,
    handleConfirmAddResourceType,
    handleCancelAddResourceType,
    isAddingResourceType,
    handleAddResourceType,
    resourceTypes,
}: ResourceTypeSelectorApuProps) {
    return (
        <div className="flex items-center space-x-2">
            {isAddingResourceType ? (
                <>
                    <Select
                        value={newResourceType}
                        onValueChange={(value) => setNewResourceType(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un tipo de recurso" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {resourceTypeOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={resourceTypes.some(
                                            (type) =>
                                                type.name ===
                                                resourceTypeNames[
                                                    option.value as ResourceType
                                                ],
                                        )}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleConfirmAddResourceType}>
                        Agregar
                    </Button>
                    <Button onClick={handleCancelAddResourceType}>
                        Cancelar
                    </Button>
                </>
            ) : (
                <Button onClick={handleAddResourceType}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Tipo
                </Button>
            )}
        </div>
    );
}
