"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { Quotation } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { quotationsColumns } from "./QuotationTableColumns";
import { QuotationTableToolbarActions } from "./QuotationTableToolbarActions";

export function QuotationsTable({ data }: { data: Quotation[] }) {
    const { user } = useProfile();
    console.log(data);

    const columns = useMemo(
        () => quotationsColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<QuotationTableToolbarActions />}
            placeholder="Buscar clientes..."
        />
    );
}
