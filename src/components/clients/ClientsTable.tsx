"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { Client } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { ClientTableToolbarActions } from "./ClientsTableToolbarActions";
import { clientsColumns } from "./ClientTableColumns";

export function ClientsTable({ data }: { data: Client[] }) {
    const { user } = useProfile();

    const columns = useMemo(
        () => clientsColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<ClientTableToolbarActions />}
            placeholder="Buscar clientes..."
        />
    );
}
