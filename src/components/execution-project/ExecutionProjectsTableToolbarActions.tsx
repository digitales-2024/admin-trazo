"use client";

import { useProfile } from "@/hooks/use-profile";
import { ExecutionProject } from "@/types";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { exportTableToCSV } from "@/lib/export";

import { CreateExecutionProjectDialog } from "./CreateExecutionProjectDialog";

export interface ExecutionProjectsTableToolbarActionsProps {
    table?: Table<ExecutionProject>;
    exportFile?: boolean;
}

export function ExecutionProjectsTableToolbarActions({
    table,
    exportFile = false,
}: ExecutionProjectsTableToolbarActionsProps) {
    const { user } = useProfile();

    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <></>
            ) : null}
            <CreateExecutionProjectDialog />
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
