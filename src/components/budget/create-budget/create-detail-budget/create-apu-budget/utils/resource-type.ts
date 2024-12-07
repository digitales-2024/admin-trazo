import {
    ApuBudget,
    FullWorkItem,
    ResourceExpandedApu,
    ResourceType,
} from "@/types";
import { Package, Wrench, HeartHandshake, Users } from "lucide-react";

export const resourceTypeNames: { [key in ResourceType]: string } = {
    [ResourceType.TOOLS]: "Herramientas",
    [ResourceType.LABOR]: "Mano de Obra",
    [ResourceType.SUPPLIES]: "Insumos",
    [ResourceType.SERVICES]: "Servicios",
};

export const resourceTypeIcons: { [key in ResourceType]: React.ElementType } = {
    [ResourceType.TOOLS]: Wrench,
    [ResourceType.LABOR]: Users,
    [ResourceType.SUPPLIES]: Package,
    [ResourceType.SERVICES]: HeartHandshake,
};

export const resourceTypeColors: { [key in ResourceType]: string } = {
    [ResourceType.TOOLS]: "border-yellow-500",
    [ResourceType.LABOR]: "border-blue-500",
    [ResourceType.SUPPLIES]: "border-green-500",
    [ResourceType.SERVICES]: "border-purple-500",
};

export const convertToResourceExpanded = (
    uniqueTypes: string[],
): ResourceExpandedApu[] => {
    return uniqueTypes.map((type) => {
        const name = resourceTypeNames[type as ResourceType];
        const icon = resourceTypeIcons[type as ResourceType];
        const color = resourceTypeColors[type as ResourceType];
        return {
            name,
            icon,
            color,
        };
    });
};

export const extractUniqueTypes = (workItemById: FullWorkItem): string[] => {
    if (!workItemById.apu || !workItemById.apu.apuOnResource) {
        return [];
    }
    const resources = workItemById.apu.apuOnResource;
    const types = resources.map((item) => item.resource.type);
    const uniqueTypes = Array.from(new Set(types));
    return uniqueTypes;
};

export const extractUniqueTypesFromApuBudget = (
    apuBudgetById: ApuBudget,
): string[] => {
    if (!apuBudgetById.apuResource) {
        return [];
    }
    const resources = apuBudgetById.apuResource;
    const types = resources.map((item) => item.resource.type);
    const uniqueTypes = Array.from(new Set(types));
    return uniqueTypes;
};

const resourceTypeNamesInverted: { [key: string]: ResourceType } = {
    Herramientas: ResourceType.TOOLS,
    "Mano de Obra": ResourceType.LABOR,
    Insumos: ResourceType.SUPPLIES,
    Servicios: ResourceType.SERVICES,
};

export const getResourceTypeInEnglish = (
    typeInSpanish: string,
): ResourceType => {
    return (
        resourceTypeNamesInverted[typeInSpanish] ||
        (typeInSpanish as ResourceType)
    );
};

export const resourceTypeOptions = [
    { value: "TOOLS", label: "Herramientas" },
    { value: "LABOR", label: "Mano de obra" },
    { value: "SUPPLIES", label: "Insumos" },
    { value: "SERVICES", label: "Servicios" },
];
