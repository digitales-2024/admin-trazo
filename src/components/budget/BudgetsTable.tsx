"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { BudgetSummary } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { budgetsColumns } from "./BudgetTableColumns";
import { BudgetTableToolbarActions } from "./BudgetTableToolbarActions";

export function BudgetssTable({ data }: { data: BudgetSummary[] }) {
    const { user } = useProfile();

    const router = useRouter();
    const handleEditClick = useCallback(
        (id: string) => {
            router.push(`/execution-project/budgets/update?id=${id}`);
        },
        [router],
    );
    const columns = useMemo(
        () => budgetsColumns(user?.isSuperAdmin || false, handleEditClick),
        [user, handleEditClick],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<BudgetTableToolbarActions />}
            placeholder="Buscar presupuestos..."
        />
    );
}
