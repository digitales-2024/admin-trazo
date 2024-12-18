"use client";

import { BudgetStatusType, BudgetSummary } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import {
    Briefcase,
    Ellipsis,
    FileDown,
    MonitorCog,
    Pencil,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import { Badge } from "../ui/badge";
import { BudgetDetailDialog } from "./show-budget-data/BudgetDetailDialog";
import UpdateStatusBudgetDialog from "./UpdateStatusBudgetDialog";

export const budgetsColumns = (
    isSuperAdmin: boolean,
    generateBudgetPdf: (id: string, code: string) => void,
    handleEditClick: (id: string) => void,
    // ColumnDef<Budget>[] => {
): ColumnDef<BudgetSummary>[] => {
    // const columns: ColumnDef<Budget>[] = [
    const columns: ColumnDef<BudgetSummary>[] = [
        {
            id: "select",
            size: 10,
            header: ({ table }) => (
                <div className="px-2">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        className="translate-y-0.5"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-2">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },

        {
            id: "Código",
            accessorKey: "code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Código" />
            ),
            cell: ({ row }) => (
                <div className="min-w-40 truncate capitalize">
                    <span className="text-xs">
                        {row.getValue("Código") as string}
                    </span>
                </div>
            ),
        },

        {
            id: "nombre",
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nombre" />
            ),
            cell: ({ row }) => (
                <div className="min-w-40 truncate capitalize">
                    <span className="text-xs">
                        {row.getValue("nombre") as string}
                    </span>
                </div>
            ),
        },

        {
            id: "cliente",
            accessorKey: "clientBudget.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Cliente" />
            ),
            cell: ({ row }) => {
                const clientName = row.getValue("cliente") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="border-slate-400 px-2 py-1 capitalize dark:bg-slate-800/40"
                        >
                            <Briefcase
                                size={14}
                                className="mr-2 text-slate-600 dark:text-slate-400"
                                strokeWidth={1.5}
                            />
                            <span className="max-w-[150px] truncate text-xs font-normal text-slate-700 dark:text-slate-300">
                                {clientName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },

        {
            id: "estado",
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Estado" />
            ),
            cell: ({ row }) => {
                const estado = row.getValue("estado");
                return (
                    <div>
                        {estado === BudgetStatusType.APPROVED ? (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Aprobado
                            </Badge>
                        ) : estado === BudgetStatusType.PENDING ? (
                            <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-500"
                            >
                                Pendiente
                            </Badge>
                        ) : estado === BudgetStatusType.REJECTED ? (
                            <Badge
                                variant="secondary"
                                className="bg-red-100 text-red-500"
                            >
                                Rechazado
                            </Badge>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-500"
                            >
                                Desconocido
                            </Badge>
                        )}
                    </div>
                );
            },
        },

        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const [showUpdateStatusDialog, setShowUpdateStatusDialog] =
                    useState(false);
                const [showDataDialog, setShowDataDialog] = useState(false);
                const { status, id, code } = row.original;
                const downloadPdfBudget = () => {
                    generateBudgetPdf(id, code);
                };

                return (
                    <div>
                        <div>
                            <UpdateStatusBudgetDialog
                                open={showUpdateStatusDialog}
                                onOpenChange={setShowUpdateStatusDialog}
                                budget={row?.original}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                            <BudgetDetailDialog
                                open={showDataDialog}
                                onClose={setShowDataDialog}
                                budget={row?.original}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                >
                                    <Ellipsis
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    onSelect={() => setShowDataDialog(true)}
                                >
                                    Ver
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() => handleEditClick(id)}
                                    disabled={
                                        status === BudgetStatusType.APPROVED
                                    }
                                >
                                    Editar
                                    <DropdownMenuShortcut>
                                        <Pencil
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowUpdateStatusDialog(true)
                                    }
                                    disabled={
                                        status === BudgetStatusType.APPROVED ||
                                        !isSuperAdmin
                                    }
                                >
                                    Actualizar
                                    <DropdownMenuShortcut>
                                        <MonitorCog
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => downloadPdfBudget()}
                                >
                                    Descargar
                                    <DropdownMenuShortcut>
                                        <FileDown
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enablePinning: true,
        },
    ];

    return columns;
};
