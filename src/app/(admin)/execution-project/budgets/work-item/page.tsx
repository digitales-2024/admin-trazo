"use client";

import { useGetWorkitemQuery } from "@/redux/services/workitemApi";
import { CategoryGet, GenericTableItem } from "@/types/category";
import { WorkItemGetAll } from "@/types/workitem";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableNested } from "@/components/data-table/DataTableNested";
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

const mock: Array<CategoryGet> = [
    {
        id: "202daf9d-32ba-444f-b875-13266916c450",
        name: "primera categoria",
        isActive: true,
        subcategories: [
            {
                id: "11119324-5081-4443-8f01-25837d5c2daa",
                name: "primera subcategoria",
                isActive: true,
                workItems: [
                    {
                        id: "19499dbc-e65d-4077-9000-276b598bac84",
                        name: "Partida-sub-01",
                        unit: null,
                        unitCost: null,
                        apuId: null,
                        isActive: true,
                        subWorkItems: [
                            {
                                id: "19499dbc-e65d-4077-9000-276b598bac84",
                                name: "Partida-sub-01",
                                unit: "m2",
                                unitCost: 322,
                                apuId: "aaad39-234-23-2ff0c",
                                isActive: true,
                            },
                        ],
                    },
                    {
                        id: "c53a2b8c-7f64-4261-bf88-2165231c6170",
                        name: "Mi partida :D",
                        unit: null,
                        unitCost: null,
                        apuId: null,
                        isActive: true,
                        subWorkItems: [],
                    },
                    {
                        id: "a442c884-f75e-41db-840c-431d5903afef",
                        name: "Mi partida normal",
                        unit: "m2",
                        unitCost: 0,
                        apuId: "f04ff782-7d05-43e8-9b1e-f84747310601",
                        isActive: true,
                        subWorkItems: [],
                    },
                ],
            },
        ],
    },
    {
        id: "b82b1888-3789-42ff-85cb-082046eded19",
        name: "ejemplo",
        isActive: true,
        subcategories: [],
    },
];

function transformData(data: Array<CategoryGet>): Array<GenericTableItem> {
    return data.map(
        (category): GenericTableItem => ({
            id: category.id,
            name: category.name,
            isActive: category.isActive,
            entityName: "Category",
            children: category.subcategories.map(
                (subcategory): GenericTableItem => ({
                    id: subcategory.id,
                    name: subcategory.name,
                    isActive: subcategory.isActive,
                    entityName: "Subcategory",
                    children: subcategory.workItems.map(
                        (workitem): GenericTableItem => ({
                            id: workitem.id,
                            name: workitem.name,
                            isActive: workitem.isActive,
                            unit: workitem.unit,
                            unitCost: workitem.unitCost,
                            apuId: workitem.apuId,
                            entityName: "Workitem",
                            children: workitem.subWorkItems.map(
                                (sub): GenericTableItem => ({
                                    id: sub.id,
                                    name: sub.name,
                                    isActive: sub.isActive,
                                    unit: sub.unit,
                                    unitCost: sub.unitCost,
                                    apuId: sub.apuId,
                                    entityName: "Subworkitem",
                                    children: [],
                                }),
                            ),
                        }),
                    ),
                }),
            ),
        }),
    );
}

const mockData = transformData(mock);

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
    const columns: ColumnDef<GenericTableItem>[] = [
        {
            id: "select",
            accessorKey: "name",
            size: 10,
            header: ({ table }) => (
                <div className="flex gap-4 px-2">
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
                    <span>Nombre</span>
                </div>
            ),
            cell: ({ row, getValue }) => (
                <div className="flex h-10 items-center gap-2">
                    <div
                        className="h-10 bg-slate-100"
                        style={{
                            width: `${row.depth * 1.25}rem`,
                        }}
                    ></div>
                    <div className="w-6">
                        {row.getCanExpand() ? (
                            <button
                                {...{
                                    onClick: row.getToggleExpandedHandler(),
                                    style: { cursor: "pointer" },
                                }}
                            >
                                {row.getIsExpanded() ? (
                                    <ChevronDown />
                                ) : (
                                    <ChevronRight />
                                )}
                            </button>
                        ) : (
                            ""
                        )}{" "}
                    </div>
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                    <div>{getValue() as string}</div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
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
            <DataTableNested
                data={mockData}
                columns={columns}
                getSubRows={(row) => row.children}
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
