"use client";

import { useCategory } from "@/hooks/use-category";
import { CategoryGet, EntityType, GenericTableItem } from "@/types/category";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import { useMemo } from "react";

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

import { CreateCategoryDialog } from "./CreateCategoryDialog";

/**
 * Transforma la data que llega del backend (categorias, subcategorias, partidas, subpartidas)
 * a un formato que el DataTableNested acepta (un unico tipo de dato recursivo)
 */
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

export default function WorkItemPage() {
    const { nestedData: data, nestedDataLoading: isLoading } = useCategory();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Categorías"
                    description="Gestiona las categorías, subcategorías, partidas y subpartidas"
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
                    title="Categorías"
                    description="Gestiona las categorías, subcategorías, partidas y subpartidas"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Categorías"
                description="Gestiona las categorías, subcategorías, partidas y subpartidas"
            />
            <WorkItemTable data={data} />
        </Shell>
    );
}

function WorkItemTable({ data }: { data: Array<CategoryGet> }) {
    // preprocess the data
    const dataMemo = useMemo(() => {
        return transformData(data);
    }, [data]);

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
                data={dataMemo}
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
            <CreateCategoryDialog />
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
