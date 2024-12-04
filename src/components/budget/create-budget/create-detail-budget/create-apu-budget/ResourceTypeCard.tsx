import { ResourceApu } from "@/types";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import ApuResourceForm from "./ApuResourceForm";
import ApuResourceRow from "./ApuResourceRow";

interface ResourceTypeCardProps {
    name: string;
    performance: number;
    workHours: number;
    icon: React.ElementType;
    color: string;
    expandedType: string | null;
    setExpandedType: (value: string | null) => void;
    calculateSubtotal: (type: string) => number;
    activeTab: string;
    handleRemoveResourceType: (name: string) => void;
    handleAddResource: (
        type: string,
        resource: Omit<ResourceApu, "totalCost" | "type">,
    ) => void;
    resources: ResourceApu[];
    handleRemoveResource: (type: string, id: string) => void;
    handleUpdateResource: (type: string, resource: ResourceApu) => void;
}

const ResourceTypeCard: React.FC<ResourceTypeCardProps> = ({
    name,
    performance,
    workHours,
    icon: Icon,
    color,
    expandedType,
    setExpandedType,
    calculateSubtotal,
    activeTab,
    handleRemoveResourceType,
    handleAddResource,
    resources,
    handleRemoveResource,
    handleUpdateResource,
}) => {
    return (
        <div className={`border-l-4 ${color} overflow-hidden rounded-lg`}>
            <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() =>
                    setExpandedType(expandedType === name ? null : name)
                }
            >
                <div className="flex items-center space-x-2">
                    <Icon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">{name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-bold">
                        {calculateSubtotal(name).toFixed(2)}
                    </span>
                    {activeTab === "nuevo" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveResourceType(name)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    {expandedType === name ? <ChevronUp /> : <ChevronDown />}
                </div>
            </div>

            {expandedType === name && (
                <div className="overflow-hidden">
                    <div className="space-y-4 p-4">
                        {activeTab === "nuevo" && (
                            <ApuResourceForm
                                onSubmit={(resource) =>
                                    handleAddResource(name, resource)
                                }
                                resourceType={expandedType}
                                performance={performance}
                                workHours={workHours}
                            />
                        )}
                        <div className="mt-6">
                            {resources.length > 0 && (
                                <h4 className="mb-3 text-lg font-semibold">
                                    Recursos Agregados
                                </h4>
                            )}
                            <div className="space-y-2">
                                {resources.map((resource) => (
                                    <ApuResourceRow
                                        key={resource.id}
                                        resource={resource}
                                        onUpdate={(updatedResource) =>
                                            handleUpdateResource(
                                                name,
                                                updatedResource,
                                            )
                                        }
                                        onDelete={() =>
                                            handleRemoveResource(
                                                name,
                                                resource.id,
                                            )
                                        }
                                        isEditable={activeTab === "nuevo"}
                                        performance={performance}
                                        workHours={workHours}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceTypeCard;
