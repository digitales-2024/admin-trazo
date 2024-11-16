"use client";

import { useProfile } from "@/hooks/use-profile";
import { Client } from "@/types";
import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { exportTableToCSV } from "@/lib/export";

export interface ProjectCharterTableToolbarActionsProps {
    table?: Table<Client>;
    exportFile?: boolean;
}

export function ProjectCharterTableToolbarActions({
    table,
    exportFile = false,
}: ProjectCharterTableToolbarActionsProps) {
    const { user } = useProfile();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
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
