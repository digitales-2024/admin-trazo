"use client";
"use memo";

import { useSpaces } from "@/hooks/use-space";
import React from "react";
import { SpacesTable } from "@/components/spaces/SpacesTable";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpacesPage() {
    const { dataSpacesAll, isLoading } = useSpaces();

    if (isLoading) {
        return (
            <Shell className="gap-2">
                <HeaderPage
                    title="Ambientes"
                    description="Lista de ambientes registrados en el sistema."
                />
                <div className="flex flex-col items-end justify-center gap-4">
                    <Skeleton className="h-7 w-52 justify-end" />
                    <DataTableSkeleton
                        columnCount={5}
                        searchableColumnCount={1}
                        filterableColumnCount={0}
                        cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                        shrinkZero
                    />
                </div>
            </Shell>
        );
    }
    if (!dataSpacesAll) {
        return null;
    }
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Ambientes"
                description="Lista de ambientes registrados en el sistema."
            />
            <SpacesTable data={dataSpacesAll} />
        </Shell>
    );
}
