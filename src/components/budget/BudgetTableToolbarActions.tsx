"use client";

import { useProfile } from "@/hooks/use-profile";
import { Quotation } from "@/types";
import { type Table } from "@tanstack/react-table";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { exportTableToCSV } from "@/lib/export";

export interface BudgetTableToolbarActionsProps {
    table?: Table<Quotation>;
    exportFile?: boolean;
}

export function BudgetTableToolbarActions({
    table,
    exportFile = false,
}: BudgetTableToolbarActionsProps) {
    const { user } = useProfile();
    const router = useRouter();

    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <></>
            ) : null}
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/execution-project/budgets/create")}
            >
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Crear Presupuesto
            </Button>
            {exportFile ||
                (user?.isSuperAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (table) {
                                exportTableToCSV(table, {
                                    filename: "products",
                                    excludeColumns: ["select", "actions"],
                                });
                            }
                        }}
                    >
                        <Download className="mr-2 size-4" aria-hidden="true" />
                        Exportar
                    </Button>
                ))}
        </div>
    );
}
