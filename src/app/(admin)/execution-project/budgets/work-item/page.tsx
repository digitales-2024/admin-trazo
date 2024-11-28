"use client";

import { useGetWorkitemQuery } from "@/redux/services/workitemApi";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Ellipsis } from "lucide-react";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableExpanded } from "@/components/data-table/DataTableExpanded";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChildrenDataTable } from "./ChildrenDataTable";

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

type TMock = {
    id: string;
    name: string;
    unit: string;
    children: Array<TMockChildren>;
};

type TMockChildren = {
    name: string;
    unit: string;
};

const mockData: Array<TMock> = [
    {
        id: "ff01",
        name: "padre 01",
        unit: "m3",
        children: [
            {
                name: "sub 01",
                unit: "cm3",
            },
            {
                name: "sub 02",
                unit: "cm3",
            },
        ],
    },
    {
        id: "ff02",
        name: "padre 02",
        unit: "m2",
        children: [],
    },
    {
        id: "ff03",
        name: "padre 02",
        unit: "cc",
        children: [],
    },
    {
        id: "ff04",
        name: "padre 04",
        unit: "cm2",
        children: [],
    },
    {
        id: "ff05",
        name: "padre 05",
        unit: "pies",
        children: [],
    },
    {
        id: "ff06",
        name: "padre 06",
        unit: "nm",
        children: [],
    },
];

function WorkItemTable({ data }: { data: Array<any> }) {
    const columns: ColumnDef<TMock>[] = [
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
            accessorKey: "id",
            header: "Identificador",
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            accessorKey: "unit",
            header: "Unidad de medida",
        },
        {
            size: 10,
            accessorKey: "children",
            header: ({ column }) => {
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Descripción"
                    />
                );
            },
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <Button
                        variant="ghost"
                        {...{
                            onClick: row.getToggleExpandedHandler(),
                        }}
                    >
                        {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                ) : null;
            },
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
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
        <DataTableExpanded
            data={mockData}
            columns={columns}
            getSubRows={(row) => row.children as unknown as Array<TMock>}
            placeholder="Buscar partidas"
            renderExpandedRow={(subrow) => {
                return <ChildrenDataTable data={subrow.children} />;
            }}
        />
    );
}
