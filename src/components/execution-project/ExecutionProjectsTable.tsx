"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { ExecutionProject } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { executionProjectColumns } from "./ExecutionProjectsTableColumns";
import { ExecutionProjectsTableToolbarActions } from "./ExecutionProjectsTableToolbarActions";

export function ExecutionProjectsTable({ data }: { data: ExecutionProject[] }) {
    const { user } = useProfile();

    const columns = useMemo(
        () => executionProjectColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<ExecutionProjectsTableToolbarActions />}
            placeholder="Buscar proyectos de ejecución..."
        />
    );
}
