"use client";

import { useGetWorkitemQuery } from "@/redux/services/workitemApi";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { Button } from "react-day-picker";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableExpanded } from "@/components/data-table/DataTableExpanded";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function WorkItemTable({ data }: { data: Array<any> }) {
    const columns: ColumnDef<any>[] = [
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
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const status = row.original.status;

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
            data={data}
            columns={columns}
            getSubRows={(row) => row.description as unknown as any[]}
            placeholder="Buscar partidas"
            renderExpandedRow={(subrow) => <div>:D</div>}
        />
    );
}
