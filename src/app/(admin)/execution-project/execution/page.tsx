"use client";

import { useExecutionProject } from "@/hooks/use-execution-project";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { ExecutionProjectsTable } from "@/components/execution-project/ExecutionProjectsTable";

export default function ExecutionProject() {
    const { dataExecutionProjectsAll, isLoading } = useExecutionProject();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Ejecución"
                    description="Lista de proyectos de ejecución almacenados en el sistema"
                />
                <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={0}
                    cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            </Shell>
        );
    }

    if (!dataExecutionProjectsAll) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Ejecución"
                    description="Lista de proyectos de ejecución almacenados en el sistema"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Proyectos de Ejecución"
                description="Lista de proyectos de ejecución almacenados en el sistema"
            />
            <ExecutionProjectsTable data={dataExecutionProjectsAll} />
        </Shell>
    );
}
