"use client";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { useDesignProject } from "@/hooks/use-design-project";
import { DesignProjectSummaryData, DesignProjectStatus } from "@/types/designProject";
import { ColumnDef } from "@tanstack/react-table";
import { Contact, Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Project() {
    const { data, isLoading } = useDesignProject();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Diseño"
                    description="Lista de proyectos almacenados en el sistema"
                />
                <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={0}
                    cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            </Shell>
        )
    }

    if (!data) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Diseño"
                    description="Lista de proyectos almacenados en el sistema"
                />
                <ErrorPage />
            </Shell>
        )
    }

    return (
        <Shell>
            <HeaderPage
                title="Proyectos de Diseño"
                description="Lista de proyectos almacenados en el sistema"
            />
            <DesignProjectTable data={data} />
        </Shell>
    );
}

function DesignProjectTable({ data }: { data: Array<DesignProjectSummaryData> }) {
    const columns: ColumnDef<DesignProjectSummaryData>[] = [
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
            id: "estado",
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const estado: DesignProjectStatus = row.getValue("estado");
                let badge = <></>;
                switch (estado) {
                    case "APPROVED":
                        badge = <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-500"
                        >
                            Aprobado
                        </Badge>;
                        break;
                    case "COMPLETED":
                        badge = <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-500"
                        >
                            Completado
                        </Badge>;
                        break;
                    case "ENGINEERING":
                        badge = <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-500"
                        >
                            En ingeniería
                        </Badge>;
                        break;
                    case "CONFIRMATION":
                        badge = <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-500"
                        >
                            Confirmado
                        </Badge>;
                        break;
                    case "PRESENTATION":
                        badge = <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-500"
                        >
                            En presentacion
                        </Badge>;
                        break;
                }

                return (
                    <div>
                        {badge}
                    </div>
                );
            },
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
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
                                <DropdownMenuItem
                                >
                                    Ver
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enablePinning: true,
        },
    ]
    return (
        <DataTable
            data={data}
            columns={columns}
            placeholder="Buscar proyectos..."
        />
    )
}

