"use client";

import { ExecutionProject, ExecutionProjectStatusType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
    BarChart2,
    Briefcase,
    Ellipsis,
    FileDown,
    HardHat,
    MonitorCog,
    Pencil,
    Trash,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { DeleteExecutionProjectDialog } from "./DeleteExecutionProjectDialog";
import { ExecutionProjectDescriptionDialog } from "./ExecutionProjectDescriptionDialog";
import { GenerateContractExecutionProjectForm } from "./GenerateContractExecutionForm";
import { UpdateExecutionProjectSheet } from "./UpdateExecutionProjectSheet";
import UpdateStatusExecutionProjectDialog from "./UpdateStatusExecutionProjectDialog";

export const executionProjectColumns = (
    isSuperAdmin: boolean,
): ColumnDef<ExecutionProject>[] => {
    console.log(isSuperAdmin);
    const columns: ColumnDef<ExecutionProject>[] = [
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
                <div className="min-w-20 truncate capitalize">
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
                <div className="min-w-20 truncate capitalize">
                    <span className="text-xs">
                        {row.getValue("nombre") as string}
                    </span>
                </div>
            ),
        },
        {
            id: "cliente",
            accessorKey: "client.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Cliente" />
            ),
            cell: ({ row }) => {
                const client = row.original.client;
                return (
                    <div className="flex items-center space-x-2">
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
                                {client.name}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "resident",
            accessorKey: "resident.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Residente" />
            ),
            cell: ({ row }) => {
                const resident = row.original.resident;
                return (
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="outline"
                            className="border-amber-600 bg-amber-50 px-2 py-1 dark:bg-amber-900/20"
                        >
                            <HardHat
                                size={14}
                                className="mr-2 text-amber-600"
                                strokeWidth={1.5}
                            />
                            <span className="truncate text-xs font-normal capitalize text-amber-700 dark:text-amber-300">
                                {resident.name}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },

        {
            id: "projectProgress",
            accessorKey: "projectProgress",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Avance" />
            ),
            cell: ({ row }) => {
                const projectProgress = parseFloat(
                    row.getValue("projectProgress"),
                );

                return (
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="outline"
                            className="border-emerald-600 bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20"
                        >
                            <BarChart2
                                size={14}
                                className="mr-2 text-emerald-600"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-normal text-emerald-700 dark:text-emerald-300">
                                {projectProgress} m²
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
                const estado: ExecutionProjectStatusType =
                    row.getValue("estado");
                let badge = <></>;
                switch (estado) {
                    case "COMPLETED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Completado
                            </Badge>
                        );
                        break;
                    case "STARTED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-500"
                            >
                                Iniciado
                            </Badge>
                        );
                        break;
                    case "EXECUTION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-blue-200 text-blue-600"
                            >
                                En ejecución
                            </Badge>
                        );
                        break;
                    case "CANCELLED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-red-100 text-red-500"
                            >
                                Cancelado
                            </Badge>
                        );
                        break;
                }

                return <div>{badge}</div>;
            },
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const [showContractForm, setShowContractForm] = useState(false);
                const [showEditSheet, setShowEditSheet] = useState(false);
                const [showDescriptionDialog, setShowDescriptionDialog] =
                    useState(false);
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);
                const [showUpdateStatusDialog, setShowUpdateStatusDialog] =
                    useState(false);

                const status = row.original.status;

                return (
                    <div>
                        <div>
                            <ExecutionProjectDescriptionDialog
                                open={showDescriptionDialog}
                                onOpenChange={setShowDescriptionDialog}
                                project={row?.original}
                            />
                            <GenerateContractExecutionProjectForm
                                id={row.original.id}
                                publicCode={row.original.code}
                                open={showContractForm}
                                onOpenChange={setShowContractForm}
                            />
                            <UpdateExecutionProjectSheet
                                open={showEditSheet}
                                onOpenChange={setShowEditSheet}
                                project={row?.original}
                            />
                            <DeleteExecutionProjectDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                projects={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                            <UpdateStatusExecutionProjectDialog
                                open={showUpdateStatusDialog}
                                onOpenChange={setShowUpdateStatusDialog}
                                project={row?.original}
                                showTrigger={false}
                                onSuccess={() => {
                                    setShowUpdateStatusDialog(false);
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
                                    onSelect={() =>
                                        setShowDescriptionDialog(true)
                                    }
                                >
                                    Ver
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() => setShowEditSheet(true)}
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
                                        status ===
                                            ExecutionProjectStatusType.COMPLETED ||
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
                                    onSelect={() => setShowContractForm(true)}
                                    disabled={status !== "COMPLETED"}
                                >
                                    Generar contrato
                                    <DropdownMenuShortcut>
                                        <FileDown
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-700"
                                    onSelect={() => setShowDeleteDialog(true)}
                                >
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
