"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { Spaces } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { SpaceTableToolbarActions } from "./SpaceTableToolbarActions";
import { clientsColumns } from "./ClientTableColumns";

export function SpacesTable({ data }: { data: Spaces[] }) {
    const { user } = useProfile();

    const columns = useMemo(
        () => clientsColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<SpaceTableToolbarActions />}
            placeholder="Buscar ambiente..."
        />
    );
}
