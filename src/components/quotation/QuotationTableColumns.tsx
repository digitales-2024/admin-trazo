"use client";

import { Quotation, QuotationStatusType } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Contact, Ellipsis, RefreshCcwDot, Ruler, Trash } from "lucide-react";

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

export const quotationsColumns = (
    isSuperAdmin: boolean,
): ColumnDef<Quotation>[] => {
    const columns: ColumnDef<Quotation>[] = [
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
                const { status } = row.original;
                return (
                    <div>
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
                                <DropdownMenuItem disabled={!status}>
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {isSuperAdmin && (
                                    <DropdownMenuItem /* disabled={status} */>
                                        Reactivar
                                        <DropdownMenuShortcut>
                                            <RefreshCcwDot
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem disabled={!status}>
                                    Eliminar
                                    <DropdownMenuShortcut>
                                        <Trash
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
