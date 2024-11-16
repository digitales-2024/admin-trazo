"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { ProjectCharter } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { projectsChartersColumns } from "./ProjectCharterTableColumns";
import { ProjectCharterTableToolbarActions } from "./ProjectCharterTableToolbarActions";

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
            toolbarActions={<ProjectCharterTableToolbarActions />}
            placeholder="Buscar actas de proyectos..."
        />
    );
}
