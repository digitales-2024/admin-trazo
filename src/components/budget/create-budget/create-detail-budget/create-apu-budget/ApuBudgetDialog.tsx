"use client";

import { ResourceApu, ResourceType } from "@/types";
import { Package, Wrench, HeartHandshake, Users } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ResourceTypeCard from "./ResourceTypeCard";
import { ResourceTypeSelectorApu } from "./ResourceTypeSelectorApu";

const resourceTypeNames: { [key in ResourceType]: string } = {
    [ResourceType.TOOLS]: "Herramientas",
    [ResourceType.LABOR]: "Mano de Obra",
    [ResourceType.SUPPLIES]: "Insumos",
    [ResourceType.SERVICES]: "Servicios",
};

const resourceTypeIcons: { [key in ResourceType]: React.ElementType } = {
    [ResourceType.TOOLS]: Wrench,
    [ResourceType.LABOR]: Users,
    [ResourceType.SUPPLIES]: Package,
    [ResourceType.SERVICES]: HeartHandshake,
};

const resourceTypeColors: { [key in ResourceType]: string } = {
    [ResourceType.TOOLS]: "border-yellow-500",
    [ResourceType.LABOR]: "border-blue-500",
    [ResourceType.SUPPLIES]: "border-green-500",
    [ResourceType.SERVICES]: "border-purple-500",
};

type ResourceExpanded = {
    name: string;
    icon: React.ElementType;
    color: string;
};

const initialResourceTypes: ResourceExpanded[] = [
    {
        name: resourceTypeNames[ResourceType.LABOR],
        icon: Users,
        color: "border-blue-500",
    },
    {
        name: resourceTypeNames[ResourceType.SUPPLIES],
        icon: Package,
        color: "border-green-500",
    },
    {
        name: resourceTypeNames[ResourceType.TOOLS],
        icon: Wrench,
        color: "border-yellow-500",
    },
    {
        name: resourceTypeNames[ResourceType.SERVICES],
        icon: HeartHandshake,
        color: "border-purple-500",
    },
];

interface ApuDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ApuDialog({ id, open, onOpenChange }: ApuDialogProps) {
    console.log(id);
    const [activeTab, setActiveTab] = React.useState("plantilla");
    const [resourceTypes, setResourceTypes] =
        React.useState<ResourceExpanded[]>(initialResourceTypes);
    const [resources, setResources] = React.useState<
        Record<string, ResourceApu[]>
    >(Object.fromEntries(resourceTypes.map((type) => [type.name, []])));
    const [expandedType, setExpandedType] = React.useState<string | null>(null);
    const [newResourceType, setNewResourceType] = React.useState("");
    const [isAddingResourceType, setIsAddingResourceType] =
        React.useState(false);

    const handleAddResource = (
        type: string,
        resource: Omit<ResourceApu, "id" | "totalCost">,
    ) => {
        console.log(type, resource);
        if (
            resource.name &&
            resource.quantity > 0 &&
            resource.unit &&
            resource.unitCost > 0
        ) {
            const newResource: ResourceApu = {
                ...resource,
                id: Math.random().toString(36).substr(2, 9),
                totalCost: resource.quantity * resource.unitCost,
            };
            setResources((prev) => ({
                ...prev,
                [type]: [...prev[type], newResource],
            }));
        }
    };

    const handleRemoveResource = (type: string, id: string) => {
        setResources((prev) => ({
            ...prev,
            [type]: prev[type].filter((resource) => resource.id !== id),
        }));
    };

    const handleRemoveResourceType = (name: string) => {
        setResourceTypes((prev) => prev.filter((type) => type.name !== name));
        setResources((prev) => {
            const rest = { ...prev };
            delete rest[name];
            return rest;
        });
    };

    const handleAddResourceType = () => {
        setIsAddingResourceType(true);
    };

    const handleConfirmAddResourceType = () => {
        if (
            newResourceType &&
            !resourceTypes.some(
                (type) =>
                    type.name ===
                    resourceTypeNames[newResourceType as ResourceType],
            )
        ) {
            const newType = {
                name: resourceTypeNames[newResourceType as ResourceType],
                icon: resourceTypeIcons[newResourceType as ResourceType],
                color: resourceTypeColors[newResourceType as ResourceType],
            };
            setResourceTypes((prev) => [...prev, newType]);
            setResources((prev) => ({
                ...prev,
                [resourceTypeNames[newResourceType as ResourceType]]: [],
            }));
            setNewResourceType("");
            setIsAddingResourceType(false);
        }
    };

    const handleCancelAddResourceType = () => {
        setIsAddingResourceType(false);
        setNewResourceType("");
    };

    const calculateSubtotal = (type: string) =>
        resources[type]?.reduce(
            (acc, resource) => acc + resource.totalCost,
            0,
        ) || 0;

    const calculateTotal = () =>
        Object.keys(resources).reduce(
            (acc, type) => acc + calculateSubtotal(type),
            0,
        );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Análisis de Precios Unitarios</DialogTitle>
                    <DialogDescription>
                        Elige una plantilla o crea un nuevo nuevo analisis de
                        precios unitarios
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[80vh] gap-4 p-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="mb-6"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="plantilla">
                                Plantilla
                            </TabsTrigger>
                            <TabsTrigger value="nuevo">Nuevo</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="space-y-4">
                        {activeTab === "nuevo" && (
                            <div className="mb-6 space-y-4">
                                <ResourceTypeSelectorApu
                                    newResourceType={newResourceType}
                                    setNewResourceType={setNewResourceType}
                                    handleConfirmAddResourceType={
                                        handleConfirmAddResourceType
                                    }
                                    handleCancelAddResourceType={
                                        handleCancelAddResourceType
                                    }
                                    isAddingResourceType={isAddingResourceType}
                                    handleAddResourceType={
                                        handleAddResourceType
                                    }
                                    resourceTypes={resourceTypes}
                                />
                            </div>
                        )}
                        {resourceTypes.map(({ name, icon, color }) => (
                            <ResourceTypeCard
                                key={name}
                                name={name}
                                icon={icon}
                                color={color}
                                expandedType={expandedType}
                                setExpandedType={setExpandedType}
                                calculateSubtotal={calculateSubtotal}
                                activeTab={activeTab}
                                handleRemoveResourceType={
                                    handleRemoveResourceType
                                }
                                handleAddResource={handleAddResource}
                                resources={resources[name] || []}
                                handleRemoveResource={handleRemoveResource}
                                handleUpdateResource={(
                                    type,
                                    updatedResource,
                                ) => {
                                    setResources((prev) => ({
                                        ...prev,
                                        [type]: prev[type].map((r) =>
                                            r.id === updatedResource.id
                                                ? updatedResource
                                                : r,
                                        ),
                                    }));
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between rounded-lg p-4 text-xl font-bold">
                            <span>Total General</span>
                            <span>{calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex w-full flex-row-reverse gap-2">
                            <Button
                                className="w-full"
                                onClick={() =>
                                    console.log(
                                        activeTab === "plantilla"
                                            ? "Usar plantilla"
                                            : "Crear nuevo",
                                    )
                                }
                            >
                                {activeTab === "plantilla"
                                    ? "Usar Plantilla"
                                    : "Crear Nuevo"}
                            </Button>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                >
                                    Cancelar
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
