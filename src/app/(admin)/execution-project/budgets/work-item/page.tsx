"use client";

import { useGetWorkitemQuery } from "@/redux/services/workitemApi";
import { WorkItemGetAll } from "@/types/workitem";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Ellipsis } from "lucide-react";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateWorkItemDialog } from "./CreateWorkItemDialog";
const mock = [
    {
        name: "Partida 01",
        id: "0000-ffff-abc1",
        unit: "m2",
        unitCost: 322,
        apuId: "ffff-ffff-ffff",
        subWorkItem: [
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
        ],
    },
    {
        name: "Partida 01",
        id: "0000-ffff-abc1",
        unit: "m2",
        unitCost: 322,
        apuId: "ffff-ffff-ffff",
        subWorkItem: [
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
        ],
    },
    {
        name: "Partida 01",
        id: "0000-ffff-abc1",
        unit: "m2",
        unitCost: 322,
        apuId: "ffff-ffff-ffff",
        subWorkItem: [],
    },
    {
        name: "Partida 01",
        id: "0000-ffff-abc1",
        unit: "m2",
        unitCost: 322,
        apuId: "ffff-ffff-ffff",
        subWorkItem: [],
    },
    {
        name: "Partida 01",
        id: "0000-ffff-abc1",
        unit: "m2",
        unitCost: 322,
        apuId: "ffff-ffff-ffff",
        subWorkItem: [
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
            {
                name: "SubPartida 01",
                id: "0000-cccc-f0f1",
                unit: "m2",
                unitCost: 322,
                apuId: "ffff-ffff-ffff",
                subWorkItem: [],
            },
        ],
    },
];

export default function WorkItemPage() {
    const { data, isLoading } = useGetWorkitemQuery();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Partidas y Subpartidas"
                    description="Gestiona las partidas y subpartidas"
                />
                <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={0}
                    cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            </Shell>
        );
    }

    if (!data) {
        return (
            <Shell>
                <HeaderPage
                    title="Partidas y Subpartidas"
                    description="Gestiona las partidas y subpartidas"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Partidas y Subpartidas"
                description="Gestiona las partidas y subpartidas"
            />
            <WorkItemTable data={data} />
        </Shell>
    );
}

function WorkItemTable({ data }: { data: Array<WorkItemGetAll> }) {
    console.log("unused:", data);
    const columns: ColumnDef<WorkItemGetAll>[] = [
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
                <div
                    className="flex gap-2 px-2"
                    style={{
                        // Since rows are flattened by default,
                        // we can use the row.depth property
                        // and paddingLeft to visually indicate the depth
                        // of the row
                        paddingLeft: `${row.depth * 1}rem`,
                    }}
                >
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                    {row.getCanExpand() ? (
                        <button
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: { cursor: "pointer" },
                            }}
                        >
                            {row.getIsExpanded() ? (
                                <ChevronUp />
                            ) : (
                                <ChevronDown />
                            )}
                        </button>
                    ) : (
                        ""
                    )}{" "}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            accessorKey: "unit",
            header: "Unidad de medida",
            cell: ({ row }) => <div>{row.original.unit ?? "-"}</div>,
        },
        {
            accessorKey: "unitCost",
            header: "Costo unitario",
            cell: ({ row }) => <div>{row.original.unitCost ?? "-"}</div>,
        },
        {
            size: 10,
            accessorKey: "children",
            header: ({ column }) => {
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="APU/Subpartidas"
                    />
                );
            },
            cell: ({ row }) => {
                const hasApu = !!row.original.apuId;

                if (hasApu) {
                    return <Button>APU :D</Button>;
                } else {
                    return (
                        <Button
                            variant="ghost"
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                            }}
                        >
                            {row.getIsExpanded()
                                ? "Ocultar subpartidas"
                                : "Ver subpartidas"}{" "}
                            {row.getIsExpanded() ? (
                                <ChevronUp />
                            ) : (
                                <ChevronDown />
                            )}
                        </Button>
                    );
                }
            },
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell() {
                return (
                    <div>
                        {/* Componentes que crean paneles flotantes */}
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
                                <DropdownMenuItem onSelect={() => {}}>
                                    Ver
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enablePinning: true,
        },
    ];
    return (
        <>
            <DataTable
                data={mock}
                columns={columns}
                getSubRows={(row) => row.subWorkItem}
                placeholder="Buscar partidas"
                toolbarActions={<WorkItemToolbarActions />}
            />
            <hr />
        </>
    );
}

function WorkItemToolbarActions() {
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            <CreateWorkItemDialog />
        </div>
    );
}
