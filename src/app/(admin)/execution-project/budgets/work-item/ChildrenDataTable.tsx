import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

import { DataTable } from "@/components/data-table/DataTable";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TMockChildren = {
    name: string;
    unit: string;
};

const columns: ColumnDef<TMockChildren>[] = [
    {
        id: "select",
        size: 10,
        header: ({ table }) => (
            <div className="px-2">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
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
        accessorKey: "unit",
        header: "Unidad de medida",
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

export function ChildrenDataTable({ data }: { data: Array<TMockChildren> }) {
    console.log("rendering subtable");
    return (
        <div>
            <DataTable
                data={data}
                columns={columns}
                toolbarActions={<div />}
                placeholder="Buscar supartidas"
            />
        </div>
    );
}
