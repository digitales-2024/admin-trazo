"use client";

import { ExecutionProject, ExecutionProjectStatusType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
/* import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 import { Button } from "@/components/ui/button";

 import { useState } from "react";
 import { Contact, Ellipsis, FileDown, MonitorCog, Trash } from "lucide-react";

import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { DesignProjectDescriptionDialog } from "./DesignProjectDescriptionDialog";
import { EditDesignProjectSheet } from "./EditDesignProjectSheet";
import { GenerateContractForm } from "./GenerateContractForm";
import { UpdateStatusDialog } from "./UpdateStatusDialog"; */

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
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "cliente",
            accessorKey: "client.name",
            header: "Cliente",
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
            id: "resident",
            accessorKey: "resident.name",
            header: "Residente",
            cell: ({ row }) => {
                const designerName = row.getValue("resident") as string;
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
                                {designerName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "estado",
            accessorKey: "status",
            header: "Estado",
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
        /* {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const [showContractForm, setShowContractForm] = useState(false);
                const [showEditSheet, setShowEditSheet] = useState(false);
                const [showUpdateStatusDialog, setShowUpdateStatusDialog] =
                    useState(false);
                const [showDescriptionDialog, setShowDescriptionDialog] =
                    useState(false);
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);

                const status = row.original.status;

                return (
                    <div>
                        <div>
                            <DesignProjectDescriptionDialog
                                open={showDescriptionDialog}
                                onOpenChange={setShowDescriptionDialog}
                                project={row?.original}
                            />
                            <GenerateContractForm
                                id={row.original.id}
                                publicCode={row.original.code}
                                open={showContractForm}
                                onOpenChange={setShowContractForm}
                            />
                            <EditDesignProjectSheet
                                id={row.original.id}
                                open={showEditSheet}
                                onOpenChange={setShowEditSheet}
                                project={row?.original}
                            />
                            <UpdateStatusDialog
                                id={row?.original?.id ?? -1}
                                open={showUpdateStatusDialog}
                                onOpenChange={setShowUpdateStatusDialog}
                                project={row?.original}
                            />
                            <DeleteProjectDialog
                                id={row?.original?.id ?? -1}
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                project={row?.original}
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
                                <DropdownMenuItem
                                    onSelect={() => setShowEditSheet(true)}
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowUpdateStatusDialog(true)
                                    }
                                    disabled={status === "COMPLETED"}
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
        }, */
    ];
    return columns;
};
