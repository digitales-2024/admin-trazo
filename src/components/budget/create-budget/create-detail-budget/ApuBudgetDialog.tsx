"use client";

import { ResourceApu, ResourceType } from "@/types";
import {
    ChevronDown,
    ChevronUp,
    DollarSign,
    Package,
    Wrench,
    Truck,
    Trash2,
    PlusCircle,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ApuResourceForm from "./ApuResourceForm";
import ApuResourceRow from "./ApuResourceRow";

const resourceTypeNames: { [key in ResourceType]: string } = {
    [ResourceType.TOOLS]: "Equipos",
    [ResourceType.LABOR]: "Mano de Obra",
    [ResourceType.SUPPLIES]: "Insumos",
    [ResourceType.SERVICES]: "Servicios",
};

type ResourceExpanded = {
    name: string;
    icon: React.ElementType;
    color: string;
};

const initialResourceTypes: ResourceExpanded[] = [
    {
        name: resourceTypeNames[ResourceType.LABOR],
        icon: Wrench,
        color: "border-blue-500",
    },
    {
        name: resourceTypeNames[ResourceType.SUPPLIES],
        icon: Package,
        color: "border-green-500",
    },
    {
        name: resourceTypeNames[ResourceType.TOOLS],
        icon: Truck,
        color: "border-yellow-500",
    },
    {
        name: resourceTypeNames[ResourceType.SERVICES],
        icon: DollarSign,
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

    const handleAddResource = (
        type: string,
        resource: Omit<ResourceApu, "id" | "totalCost">,
    ) => {
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

    /*     const handleRemoveResourceType = (name: string) => {
        setResourceTypes((prev) => prev.filter((type) => type.name !== name));
        setResources((prev) => {
            const { [name]: ...rest } = prev;
            return rest;
        });
    }; */

    const handleAddResourceType = () => {
        if (
            newResourceType &&
            !resourceTypes.some((type) => type.name === newResourceType)
        ) {
            const newType = {
                name: newResourceType,
                icon: Package,
                color: `border-${["red", "pink", "indigo", "teal"][Math.floor(Math.random() * 4)]}-500`,
            };
            setResourceTypes((prev) => [...prev, newType]);
            setResources((prev) => ({ ...prev, [newResourceType]: [] }));
            setNewResourceType("");
        }
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
                        {resourceTypes.map(({ name, icon: Icon, color }) => (
                            <div
                                key={name}
                                className={`border-l-4 ${color} overflow-hidden rounded-lg`}
                            >
                                <div
                                    className="flex cursor-pointer items-center justify-between p-4"
                                    onClick={() =>
                                        setExpandedType(
                                            expandedType === name ? null : name,
                                        )
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <Icon className="h-6 w-6" />
                                        <h3 className="text-lg font-semibold">
                                            {name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold">
                                            {calculateSubtotal(name).toFixed(2)}
                                        </span>
                                        {activeTab === "nuevo" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemoveResourceType(
                                                        name,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {expandedType === name ? (
                                            <ChevronUp />
                                        ) : (
                                            <ChevronDown />
                                        )}
                                    </div>
                                </div>

                                {expandedType === name && (
                                    <div className="overflow-hidden">
                                        <div className="space-y-4 p-4">
                                            {activeTab === "nuevo" && (
                                                <ApuResourceForm
                                                    onSubmit={(resource) =>
                                                        handleAddResource(
                                                            name,
                                                            resource,
                                                        )
                                                    }
                                                    resourceType={expandedType}
                                                />
                                            )}
                                            <div className="mt-6">
                                                <h4 className="mb-3 text-lg font-semibold">
                                                    Recursos Agregados
                                                </h4>
                                                <div className="space-y-2">
                                                    {resources[name]?.map(
                                                        (resource) => (
                                                            <ApuResourceRow
                                                                key={
                                                                    resource.id
                                                                }
                                                                resource={
                                                                    resource
                                                                }
                                                                onUpdate={(
                                                                    updatedResource,
                                                                ) => {
                                                                    if (
                                                                        activeTab ===
                                                                        "nuevo"
                                                                    ) {
                                                                        setResources(
                                                                            (
                                                                                prev,
                                                                            ) => ({
                                                                                ...prev,
                                                                                [name]: prev[
                                                                                    name
                                                                                ].map(
                                                                                    (
                                                                                        r,
                                                                                    ) =>
                                                                                        r.id ===
                                                                                        updatedResource.id
                                                                                            ? updatedResource
                                                                                            : r,
                                                                                ),
                                                                            }),
                                                                        );
                                                                    }
                                                                }}
                                                                onDelete={() =>
                                                                    activeTab ===
                                                                        "nuevo" &&
                                                                    handleRemoveResource(
                                                                        name,
                                                                        resource.id,
                                                                    )
                                                                }
                                                                isEditable={
                                                                    activeTab ===
                                                                    "nuevo"
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {activeTab === "nuevo" && (
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="Nuevo tipo de recurso"
                                    value={newResourceType}
                                    onChange={(e) =>
                                        setNewResourceType(e.target.value)
                                    }
                                />
                                <Button onClick={handleAddResourceType}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Agregar Tipo
                                </Button>
                            </div>
                        </div>
                    )}
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
