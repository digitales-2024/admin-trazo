"use client";

import { QuotationStatusType, QuotationSummary } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Contact, Ellipsis, FileDown, NotebookPen, Ruler } from "lucide-react";
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
import UpdateStatusQuotationDialog from "./UpdateStatusQuotationDialog";

export const quotationsColumns = (
    isSuperAdmin: boolean,
    exportQuotationToPdf: (id: string, publicCode: number) => void,
    handleEditClick: (id: string) => void,
): ColumnDef<QuotationSummary>[] => {
    const columns: ColumnDef<QuotationSummary>[] = [
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
            accessorKey: "publicCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Código" />
            ),
            cell: ({ row }) => (
                <div className="min-w-40 truncate capitalize">
                    <span className="text-xs">
                        COT-DIS-
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
            id: "metrado",
            accessorKey: "metering",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Metrado" />
            ),
            cell: ({ row }) => {
                const metrado = row.getValue("metrado") as string;
                return (
                    <div className="flex flex-row">
                        <Ruler size={14} className="mr-2" strokeWidth={1.5} />
                        <span className="text-xs font-light">
                            {metrado} m²{" "}
                        </span>
                    </div>
                );
            },
        },

        {
            id: "cliente",
            accessorKey: "client.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Cliente" />
            ),
            cell: ({ row }) => {
                const clientName = row.getValue("cliente") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
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
                        {estado === QuotationStatusType.APPROVED ? (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Aprobado
                            </Badge>
                        ) : estado === QuotationStatusType.PENDING ? (
                            <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-500"
                            >
                                Pendiente
                            </Badge>
                        ) : estado === QuotationStatusType.REJECTED ? (
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
                const { status, id, publicCode } = row.original;
                const downloadPdfQuotation = () => {
                    exportQuotationToPdf(id, publicCode);
                };

                return (
                    <div>
                        <div>
                            <UpdateStatusQuotationDialog
                                open={showUpdateStatusDialog}
                                onOpenChange={setShowUpdateStatusDialog}
                                quotation={row?.original}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
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
                                    onSelect={() => handleEditClick(id)}
                                    disabled={
                                        status === QuotationStatusType.APPROVED
                                    }
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowUpdateStatusDialog(true)
                                    }
                                    disabled={
                                        status ===
                                            QuotationStatusType.APPROVED ||
                                        !isSuperAdmin
                                    }
                                >
                                    Actualizar
                                    <DropdownMenuShortcut>
                                        <NotebookPen
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={() => downloadPdfQuotation()}
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
