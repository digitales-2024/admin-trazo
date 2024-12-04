"use client";

import { useWorkItem } from "@/hooks/use-workitem";
import { ResourceApu, ResourceExpandedApu, ResourceType } from "@/types";
import { SquarePlus, Pin } from "lucide-react";
import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ApuActionButtons from "./ApuActionButtons";
import ApuHeadInformation from "./ApuHeadInformation";
import ResourceTypeCard from "./ResourceTypeCard";
import { ResourceTypeSelectorApu } from "./ResourceTypeSelectorApu";
import {
    convertToResourceExpanded,
    extractUniqueTypes,
    resourceTypeColors,
    resourceTypeIcons,
    resourceTypeNames,
} from "./utils/resource-type";

interface ApuDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (apuId: string) => void;
}

export function ApuDialog({
    id,
    open,
    onOpenChange,
    onSuccess,
}: ApuDialogProps) {
    const { workItemById } = useWorkItem({ id });
    const [activeTab, setActiveTab] = React.useState("new");
    const [resourceTypes, setResourceTypes] = React.useState<
        ResourceExpandedApu[]
    >([]);
    const [templateResources, setTemplateResources] = React.useState<
        Record<string, ResourceApu[]>
    >({});
    const [newResources, setNewResources] = React.useState<
        Record<string, ResourceApu[]>
    >({});
    const [expandedType, setExpandedType] = React.useState<string | null>(null);
    const [newResourceType, setNewResourceType] = React.useState("");
    const [isAddingResourceType, setIsAddingResourceType] =
        React.useState(false);

    const [templatePerformance, setTemplatePerformance] = React.useState(0);
    const [templateWorkHours, setTemplateWorkHours] = React.useState(0);
    const [newPerformance, setNewPerformance] = React.useState(0);
    const [newWorkHours, setNewWorkHours] = React.useState(0);

    React.useEffect(() => {
        if (workItemById) {
            const uniqueTypes = extractUniqueTypes(workItemById);
            const resourceExpandedList = convertToResourceExpanded(uniqueTypes);
            setResourceTypes(resourceExpandedList);

            const initialResources: Record<string, ResourceApu[]> = {};
            workItemById.apu.apuOnResource.forEach((apuResource) => {
                const { resource, quantity, group } = apuResource;
                const typeName = resourceTypeNames[resource.type];
                if (!initialResources[typeName]) {
                    initialResources[typeName] = [];
                }
                initialResources[typeName].push({
                    id: resource.id,
                    name: resource.name,
                    unit: resource.unit,
                    quantity,
                    group,
                    unitCost: resource.unitCost,
                    totalCost: quantity * resource.unitCost,
                    type: resource.type,
                });
            });
            setTemplateResources(initialResources);
            setNewResources(initialResources);
            setTemplatePerformance(workItemById.apu.performance || 0);
            setTemplateWorkHours(workItemById.apu.workHours || 0);
            setNewPerformance(workItemById.apu.performance || 0);
            setNewWorkHours(workItemById.apu.workHours || 0);
            setActiveTab(uniqueTypes.length > 0 ? "template" : "new");
        }
    }, [workItemById]);

    const handleAddResource = (
        type: string,
        resource: Omit<ResourceApu, "totalCost" | "type">,
    ) => {
        if (
            resource.name &&
            resource.quantity > 0 &&
            resource.unit &&
            resource.unitCost > 0
        ) {
            const newResource: ResourceApu = {
                ...resource,
                type: type as ResourceType,
                totalCost: resource.quantity * resource.unitCost,
            };

            if (activeTab === "template") {
                setTemplateResources((prev) => {
                    const updatedResources = {
                        ...prev,
                        [type]: [...(prev[type] || []), newResource],
                    };
                    return updatedResources;
                });
            } else {
                setNewResources((prev) => {
                    const updatedResources = {
                        ...prev,
                        [type]: [...(prev[type] || []), newResource],
                    };
                    return updatedResources;
                });
            }
        }
    };

    const handleRemoveResource = (type: string, id: string) => {
        if (activeTab === "template") {
            setTemplateResources((prev) => ({
                ...prev,
                [type]: (prev[type] || []).filter(
                    (resource) => resource.id !== id,
                ),
            }));
        } else {
            setNewResources((prev) => ({
                ...prev,
                [type]: (prev[type] || []).filter(
                    (resource) => resource.id !== id,
                ),
            }));
        }
    };

    const handleRemoveResourceType = (name: string) => {
        if (activeTab === "template") {
            setTemplateResources((prev) => {
                const rest = { ...prev };
                delete rest[name];
                return rest;
            });
        } else {
            setNewResources((prev) => {
                const rest = { ...prev };
                delete rest[name];
                return rest;
            });
        }
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
            if (activeTab === "template") {
                setTemplateResources((prev) => ({
                    ...prev,
                    [resourceTypeNames[newResourceType as ResourceType]]: [],
                }));
            } else {
                setNewResources((prev) => ({
                    ...prev,
                    [resourceTypeNames[newResourceType as ResourceType]]: [],
                }));
            }
            setNewResourceType("");
            setIsAddingResourceType(false);
        }
    };

    const handleCancelAddResourceType = () => {
        setIsAddingResourceType(false);
        setNewResourceType("");
    };

    const calculateSubtotal = (type: string) =>
        (activeTab === "template"
            ? templateResources[type]
            : newResources[type]
        )?.reduce((acc, resource) => acc + resource.totalCost, 0) || 0;

    const calculateTotal = () =>
        Object.keys(
            activeTab === "template" ? templateResources : newResources,
        ).reduce((acc, type) => acc + calculateSubtotal(type), 0);

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
                            <TabsTrigger value="template">
                                <Pin className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="truncate text-ellipsis">
                                    Plantilla
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="new">
                                <SquarePlus className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="truncate text-ellipsis">
                                    Nuevo
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <ApuHeadInformation
                        name={workItemById?.name || ""}
                        performance={
                            activeTab === "template"
                                ? templatePerformance
                                : newPerformance
                        }
                        setPerformance={
                            activeTab === "template"
                                ? setTemplatePerformance
                                : setNewPerformance
                        }
                        workHours={
                            activeTab === "template"
                                ? templateWorkHours
                                : newWorkHours
                        }
                        setWorkHours={
                            activeTab === "template"
                                ? setTemplateWorkHours
                                : setNewWorkHours
                        }
                        activeTab={activeTab}
                    />
                    <div className="space-y-4">
                        {activeTab === "new" && (
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
                                performance={
                                    activeTab === "template"
                                        ? templatePerformance
                                        : newPerformance
                                }
                                workHours={
                                    activeTab === "template"
                                        ? templateWorkHours
                                        : newWorkHours
                                }
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
                                resources={
                                    activeTab === "template"
                                        ? templateResources[name]
                                        : newResources[name] || []
                                }
                                handleRemoveResource={handleRemoveResource}
                                handleUpdateResource={(
                                    type,
                                    updatedResource,
                                ) => {
                                    if (activeTab === "template") {
                                        setTemplateResources((prev) => ({
                                            ...prev,
                                            [type]: prev[type].map((r) =>
                                                r.id === updatedResource.id
                                                    ? updatedResource
                                                    : r,
                                            ),
                                        }));
                                    } else {
                                        setNewResources((prev) => ({
                                            ...prev,
                                            [type]: prev[type].map((r) =>
                                                r.id === updatedResource.id
                                                    ? updatedResource
                                                    : r,
                                            ),
                                        }));
                                    }
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between rounded-lg p-4 text-xl font-bold">
                            <span>Total General</span>
                            <span>{calculateTotal().toFixed(2)}</span>
                        </div>
                        <ApuActionButtons
                            activeTab={activeTab}
                            templatePerformance={templatePerformance}
                            newPerformance={newPerformance}
                            templateWorkHours={templateWorkHours}
                            newWorkHours={newWorkHours}
                            templateResources={templateResources}
                            newResources={newResources}
                            onSuccess={onSuccess}
                            onOpenChange={onOpenChange}
                        />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
