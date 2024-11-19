"use client";

import { ResourceType } from "@/types/resource";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { CreateResourceDialog } from "@/components/resources/resources-table/CreateResourceDialog";
import ResourcesCollapsible from "@/components/resources/ResourcesCollapsible";

export default function ResourcesPage() {
    return (
        <Shell className="flex-auto gap-2">
            <HeaderPage
                title="Gestion de recursos"
                description="Lista de recursos registrados en el sistema."
            />
            <div className="py-4">
                <CreateResourceDialog />
            </div>

            <div className="space-y-4">
                <ResourcesCollapsible
                    name="Herramientas"
                    resourceType={ResourceType.TOOLS}
                />

                <ResourcesCollapsible
                    name="Mano de Obra"
                    resourceType={ResourceType.LABOR}
                />

                <ResourcesCollapsible
                    name="Suministros"
                    resourceType={ResourceType.SUPPLIES}
                />

                <ResourcesCollapsible
                    name="Servicios"
                    resourceType={ResourceType.SERVICES}
                />
            </div>
        </Shell>
    );
}
