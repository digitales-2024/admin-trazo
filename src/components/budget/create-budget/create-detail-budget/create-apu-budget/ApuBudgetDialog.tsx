"use client";

import { useApuBudget } from "@/hooks/use-apu-budget";
import { useSubWorkItem } from "@/hooks/use-subworkitem";
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
    extractUniqueTypesFromApuBudget,
    resourceTypeColors,
    resourceTypeIcons,
    resourceTypeNames,
} from "./utils/resource-type";

interface ApuDialogProps {
    idWorkItem?: string;
    idSubWorkItem?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (apuId: string, totalCost: number) => void;
    apuId?: string;
}

export function ApuDialog({
    idWorkItem,
    idSubWorkItem,
    open,
    onOpenChange,
    onSuccess,
    apuId,
}: ApuDialogProps) {
    const { workItemById } = useWorkItem({ id: idWorkItem });
    const { apuBudgetById } = useApuBudget({ id: apuId || "" });
    const { subWorkItemById } = useSubWorkItem({ id: idSubWorkItem });

    const itemData = idWorkItem ? workItemById : subWorkItemById;

    const [activeTab, setActiveTab] = React.useState("template");

    // Separación de tipos de recursos
    const [templateResourceTypes, setTemplateResourceTypes] = React.useState<
        ResourceExpandedApu[]
    >([]);
    const [newResourceTypes, setNewResourceTypes] = React.useState<
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
        // Si no hay datos del item
        if (!itemData) return;

        // Inicializar tipos y recursos de la plantilla desde itemData
        if (itemData.apu && itemData.apu.apuOnResource) {
            const uniqueTypesFromItem = extractUniqueTypes(itemData);
            const resourceExpandedListTemplate =
                convertToResourceExpanded(uniqueTypesFromItem);
            setTemplateResourceTypes(resourceExpandedListTemplate);

            const initialTemplateResources: Record<string, ResourceApu[]> = {};
            itemData.apu.apuOnResource.forEach((apuResource) => {
                const { resource, quantity, group } = apuResource;
                const typeName = resourceTypeNames[resource.type];
                if (!initialTemplateResources[typeName]) {
                    initialTemplateResources[typeName] = [];
                }
                initialTemplateResources[typeName].push({
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
            setTemplateResources(initialTemplateResources);
            setTemplatePerformance(itemData.apu.performance || 0);
            setTemplateWorkHours(itemData.apu.workHours || 0);
        }

        // Inicializar tipos y recursos nuevos desde apuBudgetById si está disponible
        if (apuBudgetById && apuBudgetById.apuResource) {
            const uniqueTypesFromApuBudget =
                extractUniqueTypesFromApuBudget(apuBudgetById);
            const resourceExpandedListNew = convertToResourceExpanded(
                uniqueTypesFromApuBudget,
            );
            setNewResourceTypes(resourceExpandedListNew);

            const initialNewResourcesFromApuBudget: Record<
                string,
                ResourceApu[]
            > = {};
            apuBudgetById.apuResource.forEach((apuResource) => {
                const { resource, quantity, group } = apuResource;
                const typeName = resourceTypeNames[resource.type];
                if (!initialNewResourcesFromApuBudget[typeName]) {
                    initialNewResourcesFromApuBudget[typeName] = [];
                }
                initialNewResourcesFromApuBudget[typeName].push({
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
            setNewResources(initialNewResourcesFromApuBudget);
            setNewPerformance(apuBudgetById.performance || 0);
            setNewWorkHours(apuBudgetById.workHours || 0);

            // Cambiar a la pestaña "new" si hay recursos en APU Budget
            if (uniqueTypesFromApuBudget.length > 0) {
                setActiveTab("new");
            }
        } else if (itemData.apu && itemData.apu.apuOnResource) {
            // Si no hay apuBudgetById, inicializar newResourceTypes y newResources desde itemData
            const uniqueTypesFromItem = extractUniqueTypes(itemData);
            const resourceExpandedListNew =
                convertToResourceExpanded(uniqueTypesFromItem);
            setNewResourceTypes(resourceExpandedListNew);

            const initialNewResourcesFromWorkItem: Record<
                string,
                ResourceApu[]
            > = {};
            itemData.apu.apuOnResource.forEach((apuResource) => {
                const { resource, quantity, group } = apuResource;
                const typeName = resourceTypeNames[resource.type];
                if (!initialNewResourcesFromWorkItem[typeName]) {
                    initialNewResourcesFromWorkItem[typeName] = [];
                }
                initialNewResourcesFromWorkItem[typeName].push({
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
            setNewResources(initialNewResourcesFromWorkItem);
            setNewPerformance(itemData.apu.performance || 0);
            setNewWorkHours(itemData.apu.workHours || 0);
        }
    }, [itemData, apuBudgetById]);

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [name]: removed, ...rest } = prev;
                return rest;
            });
            setTemplateResourceTypes((prev) =>
                prev.filter((type) => type.name !== name),
            );
        } else {
            setNewResources((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [name]: removed, ...rest } = prev;
                return rest;
            });
            setNewResourceTypes((prev) =>
                prev.filter((type) => type.name !== name),
            );
        }
    };

    const handleAddResourceType = () => {
        setIsAddingResourceType(true);
    };

    const handleConfirmAddResourceType = () => {
        if (
            newResourceType &&
            !newResourceTypes.some(
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
            setNewResourceTypes((prev) => [...prev, newType]);
            setNewResources((prev) => ({
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
                        Elige una plantilla o crea un nuevo análisis de precios
                        unitarios
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[80vh] gap-4 p-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="mb-6"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="template"
                                disabled={templateResourceTypes.length === 0}
                            >
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
                        name={
                            activeTab === "new" && apuBudgetById
                                ? itemData?.name || ""
                                : itemData?.name || ""
                        }
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
                                    resourceTypes={newResourceTypes}
                                />
                            </div>
                        )}
                        {activeTab === "template" &&
                            templateResourceTypes.map(
                                ({ name, icon, color }) => (
                                    <ResourceTypeCard
                                        key={name}
                                        name={name}
                                        performance={templatePerformance}
                                        workHours={templateWorkHours}
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
                                            templateResources[name] || []
                                        }
                                        handleRemoveResource={
                                            handleRemoveResource
                                        }
                                        handleUpdateResource={(
                                            type,
                                            updatedResource,
                                        ) => {
                                            setTemplateResources((prev) => ({
                                                ...prev,
                                                [type]: prev[type].map((r) =>
                                                    r.id === updatedResource.id
                                                        ? updatedResource
                                                        : r,
                                                ),
                                            }));
                                        }}
                                    />
                                ),
                            )}
                        {activeTab === "new" &&
                            newResourceTypes.map(({ name, icon, color }) => (
                                <ResourceTypeCard
                                    key={name}
                                    name={name}
                                    performance={newPerformance}
                                    workHours={newWorkHours}
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
                                    resources={newResources[name] || []}
                                    handleRemoveResource={handleRemoveResource}
                                    handleUpdateResource={(
                                        type,
                                        updatedResource,
                                    ) => {
                                        setNewResources((prev) => ({
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
                            apuId={apuId}
                        />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
