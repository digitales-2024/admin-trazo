"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { ProjectCharter } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { ClientTableToolbarActions } from "./ClientsTableToolbarActions";
import { projectsChartersColumns } from "./ProjectCharterTableColumns";

export function ProjectCharterTable({ data }: { data: ProjectCharter[] }) {
    const { user } = useProfile();

    const columns = useMemo(
        () => projectsChartersColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<ClientTableToolbarActions />}
            placeholder="Buscar actas de proyectos..."
        />
    );
}
