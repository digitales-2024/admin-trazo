"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { useQuotations } from "@/hooks/use-quotation";
import { QuotationSummary } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { quotationsColumns } from "./QuotationTableColumns";
import { QuotationTableToolbarActions } from "./QuotationTableToolbarActions";

export function QuotationsTable({ data }: { data: QuotationSummary[] }) {
    const { user } = useProfile();

    const { exportQuotationToPdf } = useQuotations();

    const columns = useMemo(
        () =>
            quotationsColumns(
                user?.isSuperAdmin || false,
                exportQuotationToPdf,
            ),
        [user, exportQuotationToPdf],
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
