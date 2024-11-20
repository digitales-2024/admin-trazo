"use client";
import { useResource } from "@/hooks/use-resource";
import { ResourceType } from "@/types";
import {
    ChevronDown,
    ChevronUp,
    Wrench,
    Users,
    Package,
    HeartHandshake,
    LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ErrorPage } from "../common/ErrorPage";
import { DataTableSkeleton } from "../data-table/DataTableSkeleton";
import { Skeleton } from "../ui/skeleton";
import { ResourcesTable } from "./resources-table/ResourcesTable";

interface ResourcesCollapsibleProps {
    name: string;
    resourceType: ResourceType;
}

const iconMap: Record<ResourceType, LucideIcon> = {
    TOOLS: Wrench, // Herramientas
    LABOR: Users, // Mano de obra
    SUPPLIES: Package, // Suministros
    SERVICES: HeartHandshake, // Servicios
};

export default function ResourcesCollapsible({
    name,
    resourceType,
}: ResourcesCollapsibleProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { resourceByType, isLoadingResourceByType } = useResource({
        type: resourceType,
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                // 640px es el breakpoint 'sm' en Tailwind
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const IconComponent = iconMap[resourceType] || Wrench;

    const renderContent = () => {
        if (isLoadingResourceByType) {
            return (
                <div className="p-4">
                    <div className="flex flex-col items-end justify-center gap-4">
                        <Skeleton className="h-7 w-52 justify-end" />
                        <DataTableSkeleton
                            columnCount={4}
                            searchableColumnCount={1}
                            filterableColumnCount={0}
                            cellWidths={[
                                "1rem",
                                "15rem",
                                "12rem",
                                "12rem",
                                "8rem",
                            ]}
                            shrinkZero
                        />
                    </div>
                </div>
            );
        }

        if (!resourceByType) {
            return (
                <div className="p-4">
                    <ErrorPage />
                </div>
            );
        }

        return (
            <div className="p-4">
                <ResourcesTable
                    data={resourceByType}
                    iconMap={iconMap}
                    currentResourceType={resourceType}
                />
            </div>
        );
    };

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="">
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-4">
                                    <IconComponent
                                        size={28}
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-sm font-light text-gray-900">
                                        {
                                            <div>
                                                <h2 className="text-lg font-medium text-gray-900">
                                                    {name}
                                                </h2>
                                                <span className="text-sm font-light text-slate-600">{`Lista de recursos de tipo ${name} en el sistema`}</span>
                                            </div>
                                        }
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                {isOpen && (
                    <CardContent>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-6 p-4 sm:p-0">
                                {renderContent()}
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
}
