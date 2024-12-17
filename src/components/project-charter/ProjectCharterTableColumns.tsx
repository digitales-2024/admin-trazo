"use client";

import { useObservation } from "@/hooks/use-observation";
import { useProjectCharter } from "@/hooks/use-project-charter";
import { ProjectCharter } from "@/types";
import { DesignProjectStatus } from "@/types/designProject";
import { type ColumnDef } from "@tanstack/react-table";
import {
    Briefcase,
    CircleCheck,
    CircleX,
    DraftingCompass,
    Ellipsis,
    FileDown,
    Plus,
    Trash,
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
import { Switch } from "../ui/switch";
import { CreateObservationDialog } from "./CreateObservationDialog";
import { DeleteAllObservationsDialog } from "./DeleteAllObservationsDialog";
import { ObservationProjectCharterSheet } from "./ObservationProjectCharterSheet";

export const projectsChartersColumns = (
    isSuperAdmin: boolean,
    exportProjectCharterToPdf: (id: string, codeProject: string) => void,
): ColumnDef<ProjectCharter>[] => {
    const columns: ColumnDef<ProjectCharter>[] = [
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
            id: "proyecto",
            accessorKey: "designProject.code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Proyecto" />
            ),
            cell: ({ row }) => (
                <div className="flex min-w-40 items-center truncate capitalize">
                    <span className="text-xs font-light">
                        {row.getValue("proyecto") as string}
                    </span>
                </div>
            ),
        },

        {
            id: "cliente",
            accessorKey: "designProject.client.name",
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
            id: "responsable",
            accessorKey: "designProject.designer.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Responsable" />
            ),
            cell: ({ row }) => {
                const userName = row.getValue("responsable") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate border-blue-500 capitalize text-blue-700"
                        >
                            <DraftingCompass
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {userName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },

        {
            id: "anteproyecto",
            accessorKey: "preProjectApproval",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Anteproyecto" />
            ),
            cell: function Cell({ row }) {
                const { onToggleProjectCharterApprovation } =
                    useProjectCharter();
                const [isAvailable, setIsAvailable] = useState(
                    row.original.preProjectApproval,
                );

                const handleToggle = async () => {
                    const productId = row.original.id;
                    await onToggleProjectCharterApprovation(productId);
                    setIsAvailable((prev) => !prev);
                };
                return (
                    <div className="flex w-56 gap-4">
                        <>
                            <div className="flex flex-col items-center">
                                <Switch
                                    checked={isAvailable}
                                    onCheckedChange={handleToggle}
                                    className="translate-y-0.5"
                                />
                            </div>
                            {row.getValue("anteproyecto") ? (
                                <span className="inline-flex items-center gap-2 text-emerald-500">
                                    <CircleCheck
                                        className="size-4 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    Aprobado
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 truncate text-red-500">
                                    <CircleX
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Desaprobado
                                </span>
                            )}
                        </>
                    </div>
                );
            },
        },

        {
            id: "estado",
            accessorKey: "designProject.status",
            header: "Estado",
            cell: ({ row }) => {
                const estado: DesignProjectStatus = row.getValue("estado");
                let badge = <></>;
                switch (estado) {
                    case "APPROVED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-yellow-200 text-yellow-600"
                            >
                                Aprobado
                            </Badge>
                        );
                        break;
                    case "COMPLETED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-green-200 text-green-700"
                            >
                                Completado
                            </Badge>
                        );
                        break;
                    case "ENGINEERING":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-blue-200 text-blue-600"
                            >
                                En ingeniería
                            </Badge>
                        );
                        break;
                    case "CONFIRMATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-cyan-200 text-cyan-600"
                            >
                                Confirmado
                            </Badge>
                        );
                        break;
                    case "PRESENTATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-teal-200 text-teal-600"
                            >
                                En presentacion
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
                const { amountOfObservations, designProject, id } =
                    row.original;
                const { observationByProjectCharter } = useObservation({
                    idProjectCharter: id,
                });
                const [showEditDialog, setShowEditDialog] = useState(false);
                const [showObservationDialog, setShowObservationDialog] =
                    useState(false);
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);
                const downloadPdfProjectCharter = () => {
                    exportProjectCharterToPdf(
                        designProject.id,
                        designProject.code,
                    );
                };

                return (
                    <div>
                        <div>
                            <CreateObservationDialog
                                open={showObservationDialog}
                                onOpenChange={setShowObservationDialog}
                                projectCharter={row?.original}
                                amountOfObservations={amountOfObservations ?? 0}
                            />
                            <ObservationProjectCharterSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                projectCharter={row?.original}
                            />
                            <DeleteAllObservationsDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                projectCharter={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {}}
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
                                    onSelect={() => setShowEditDialog(true)}
                                    disabled={
                                        observationByProjectCharter?.length ===
                                        0
                                    }
                                >
                                    Gestionar observaciones
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowObservationDialog(true)
                                    }
                                >
                                    Añadir observación
                                    <DropdownMenuShortcut>
                                        <Plus
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => downloadPdfProjectCharter()}
                                    disabled={
                                        observationByProjectCharter?.length ===
                                        0
                                    }
                                >
                                    Descargar
                                    <DropdownMenuShortcut>
                                        <FileDown
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={() => setShowDeleteDialog(true)}
                                    disabled={
                                        observationByProjectCharter?.length ===
                                        0
                                    }
                                >
                                    Eliminar observaciones
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
