"use client";

import { EntityType, GenericTableItem } from "@/types/category";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateWorkItemDialog } from "./CreateWorkItemDialog";

export const categoryTableColumns: ColumnDef<GenericTableItem>[] = [
    {
        id: "select",
        accessorKey: "name",
        size: 10,
        header: ({ table }) => (
            <div className="flex gap-4 px-2">
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
                <span className="inline-block">Nombre</span>
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
                {row.getCanExpand() ? (
                    <button
                        className="w-6"
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
                    <span className="w-6" />
                )}
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-0.5"
                />
                <div
                    className={`${entityTypeToColor(row.original.entityName, row.original.children.length > 0)} uppercase`}
                >
                    {getValue() as string}
                </div>
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
        cell: function Cell({ row }) {
            let actions = <></>;
            switch (row.original.entityName) {
                case "Category": {
                    actions = <CategoryActions />;
                    break;
                }
                case "Subcategory": {
                    actions = (
                        <SubCategoryActions subcategoryId={row.original.id} />
                    );
                    break;
                }
                case "Workitem": {
                    actions = <CategoryActions />;
                    break;
                }
                case "Subworkitem": {
                    actions = <CategoryActions />;
                    break;
                }
            }

            return <>{actions}</>;
        },
        enablePinning: true,
    },
];

function CategoryActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Open menu"
                    variant="ghost"
                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                    <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => {}}>
                    Ver Categoria
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SubCategoryActions({ subcategoryId }: { subcategoryId: string }) {
    const [showCreateWorkItem, setShowCreateWorkItem] = useState(false);

    return (
        <div>
            <div>
                <CreateWorkItemDialog
                    open={showCreateWorkItem}
                    onOpenChange={setShowCreateWorkItem}
                    subcategoryId={subcategoryId}
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        aria-label="Open menu"
                        variant="ghost"
                        className="flex size-8 p-0 data-[state=open]:bg-muted"
                    >
                        <Ellipsis className="size-4" aria-hidden="true" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onSelect={() => {}}>
                        Ver Subcategoria
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setShowCreateWorkItem(true);
                        }}
                    >
                        Crear Partida
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

/**
 * Returns a tailwind color from an entity type
 *
 * @param e Entity type to color
 * @param shouldColorWorkitem Used only with Workitem. If true, returns a bold, green color.
 */
function entityTypeToColor(
    e: EntityType,
    shouldColorWorkitem: boolean,
): string {
    switch (e) {
        case "Category":
            return "text-black font-bold";
        case "Subcategory":
            return "text-blue-600 font-bold";
        case "Workitem":
            return shouldColorWorkitem ? "text-green-600 font-bold" : "";
        case "Subworkitem":
            return "";
    }
}
