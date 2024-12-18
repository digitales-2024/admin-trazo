"use client";

import { useCategory } from "@/hooks/use-category";
import { useEditSubWorkItemMutation } from "@/redux/services/subworkitemApi";
import { useEditWorkItemMutation } from "@/redux/services/workitemApi";
import { EntityType, GenericTableItem } from "@/types/category";
import { ColumnDef } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronRight,
    Ellipsis,
    Pencil,
    RefreshCcwDot,
    Trash,
} from "lucide-react";
import { useState } from "react";

import { ApuDialog } from "@/components/budget/create-budget/create-detail-budget/create-apu-budget/ApuBudgetDialog";
import { Badge } from "@/components/ui/badge";
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

import { DeleteCategoryDialog } from "./_category/DeleteCategoryDialog";
import { EditCategorySheet } from "./_category/EditCategorySheet";
import { ReactivateCategoryDialog } from "./_category/ReactivateCategoryDialog";
import { CreateSubCategoryDialog } from "./_subcategory/CreateSubCategoryDialog";
import { DeleteSubCategoryDialog } from "./_subcategory/DeleteSubCategoryDialog";
import { EditSubCategorySheet } from "./_subcategory/EditSubCategorySheet";
import { ReactivateSubCategoryDialog } from "./_subcategory/ReactivateSubCategoryDialog";
import { CreateSubWorkItemDialog } from "./_subworkitem/CreateSubWorkItemDialog";
import { DeleteSubWorkItemDialog } from "./_subworkitem/DeleteSubWorkItemDialog";
import { ReactivateSubWorkItemDialog } from "./_subworkitem/ReactivateSubWorkItemDialog";
import { CreateWorkItemDialog } from "./_workitem/CreateWorkItemDialog";
import { DeleteWorkItemDialog } from "./_workitem/DeleteWorkItemDialog";
import { EditWorkItemSheet } from "./_workitem/EditWorkItemSheet";
import { ReactivateWorkItemDialog } from "./_workitem/ReactivateWorkItemDialog";

export const categoryTableColumns = (
    isSuperadmin: boolean,
): ColumnDef<GenericTableItem>[] => [
    {
        id: "select",
        accessorKey: "name",
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
        cell: ({ row, getValue }) => {
            let indentationClass = "";
            switch (row.depth) {
                case 1: {
                    indentationClass = "w-1 md:w-3";
                    break;
                }
                case 2: {
                    indentationClass = "w-2 md:w-6";
                    break;
                }
                case 3: {
                    indentationClass = "w-3 md:w-9";
                    break;
                }
            }
            return (
                <div className="flex h-16 items-center">
                    <div className={`h-16 bg-gray-100 ${indentationClass}`} />
                    {row.getCanExpand() ? (
                        <button
                            className="inline-block h-16 w-9 px-2"
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: { cursor: "pointer" },
                            }}
                        >
                            {row.getIsExpanded() ? (
                                <ChevronDown
                                    strokeWidth={1.5}
                                    className="h-5 w-5"
                                />
                            ) : (
                                <ChevronRight
                                    strokeWidth={1.5}
                                    className="h-5 w-5"
                                />
                            )}
                        </button>
                    ) : (
                        <span className="w-9" />
                    )}
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                    <div
                        className={`${entityTypeToColor(row.original.entityName, !row.original.apuId)} pl-2 uppercase`}
                    >
                        {getValue() as string}
                    </div>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
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
        id: "estado",
        accessorKey: "isActive",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {row.original.isActive ? (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-500"
                    >
                        Activo
                    </Badge>
                ) : (
                    <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-500"
                    >
                        Inactivo
                    </Badge>
                )}
            </div>
        ),
    },
    {
        id: "buttons",
        header: () => <div className="text-center">Acciones</div>,
        cell: function Component({ row }) {
            const data = row.original;
            const [open, setOpen] = useState(false);
            const { fullCategoryRefetch } = useCategory();
            const [workitemEdit] = useEditWorkItemMutation();
            const [subworkitemEdit] = useEditSubWorkItemMutation();
            if (!data.apuId) {
                return <div />;
            }

            // recibe el costo unitario de cuando se actualiza el apu,
            // y lo guarda en la bd
            async function updateWorkItemUnitPrice(price: number) {
                if (data.entityName === "Workitem") {
                    await workitemEdit({
                        id: data.id,
                        body: {
                            unitCost: price,
                        },
                    });
                } else if (data.entityName === "Subworkitem") {
                    await subworkitemEdit({
                        id: data.id,
                        body: {
                            unitCost: price,
                        },
                    });
                }
                fullCategoryRefetch();
            }

            return (
                <div className="text-center">
                    <ApuDialog
                        idWorkItem={
                            data.entityName === "Workitem" ? data.id : undefined
                        }
                        idSubWorkItem={
                            data.entityName === "Subworkitem"
                                ? data.id
                                : undefined
                        }
                        open={open}
                        onOpenChange={setOpen}
                        onSuccess={(id, cost) => updateWorkItemUnitPrice(cost)}
                        apuId={!!data.apuId ? data.apuId : undefined}
                        isBlueprint={true}
                    />
                    <Button
                        onClick={() => setOpen(true)}
                        size="sm"
                        disabled={!data.isActive}
                    >
                        APU
                    </Button>
                </div>
            );
        },
    },
    {
        id: "actions",
        size: 5,
        cell: function Cell({ row }) {
            let actions = <></>;
            switch (row.original.entityName) {
                case "Category": {
                    actions = (
                        <CategoryActions
                            categoryId={row.original.id}
                            data={row.original}
                            isSuperAdmin={isSuperadmin}
                        />
                    );
                    break;
                }
                case "Subcategory": {
                    actions = (
                        <SubCategoryActions
                            subcategoryId={row.original.id}
                            data={row.original}
                            isSuperAdmin={isSuperadmin}
                        />
                    );
                    break;
                }
                case "Workitem": {
                    actions = (
                        <WorkItemActions
                            parentId={row.original.id}
                            hasApu={!!row.original.apuId}
                            data={row.original}
                            isSuperAdmin={isSuperadmin}
                        />
                    );
                    break;
                }
                case "Subworkitem": {
                    actions = (
                        <SubWorkItemActions
                            parentId={row.original.id}
                            data={row.original}
                            isSuperAdmin={isSuperadmin}
                        />
                    );
                    break;
                }
            }

            return <>{actions}</>;
        },
        enablePinning: true,
    },
];

function CategoryActions({
    categoryId,
    data,
    isSuperAdmin,
}: {
    categoryId: string;
    data: GenericTableItem;
    isSuperAdmin: boolean;
}) {
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showReactivate, setShowReactivate] = useState(false);

    return (
        <div>
            <div>
                <CreateSubCategoryDialog
                    open={showCreate}
                    setOpen={setShowCreate}
                    categoryId={categoryId}
                />
                <EditCategorySheet
                    open={showEdit}
                    setOpen={setShowEdit}
                    categoryId={categoryId}
                    data={data}
                />
                <DeleteCategoryDialog
                    open={showDelete}
                    onOpenChange={setShowDelete}
                    data={data}
                />
                <ReactivateCategoryDialog
                    open={showReactivate}
                    onOpenChange={setShowReactivate}
                    data={data}
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
                    <DropdownMenuItem onSelect={() => setShowCreate(true)}>
                        Crear Subcategoría
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setShowEdit(true)}>
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil className="size-4" aria-hidden="true" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {isSuperAdmin && (
                        <DropdownMenuItem
                            onSelect={() => setShowReactivate(true)}
                            disabled={data.isActive}
                        >
                            Reactivar
                            <DropdownMenuShortcut>
                                <RefreshCcwDot
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="text-red-700"
                        onSelect={() => setShowDelete(true)}
                        disabled={!data.isActive}
                    >
                        Eliminar
                        <DropdownMenuShortcut>
                            <Trash className="size-4" aria-hidden="true" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function SubCategoryActions({
    subcategoryId,
    data,
    isSuperAdmin,
}: {
    subcategoryId: string;
    data: GenericTableItem;
    isSuperAdmin: boolean;
}) {
    const [showCreateWorkItem, setShowCreateWorkItem] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showReactivate, setShowReactivate] = useState(false);

    return (
        <div>
            <div>
                <CreateWorkItemDialog
                    open={showCreateWorkItem}
                    onOpenChange={setShowCreateWorkItem}
                    subcategoryId={subcategoryId}
                />
                <EditSubCategorySheet
                    open={showEdit}
                    setOpen={setShowEdit}
                    data={data}
                />
                <DeleteSubCategoryDialog
                    open={showDelete}
                    onOpenChange={setShowDelete}
                    data={data}
                />
                <ReactivateSubCategoryDialog
                    open={showReactivate}
                    onOpenChange={setShowReactivate}
                    data={data}
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
                    <DropdownMenuItem
                        onSelect={() => {
                            setShowCreateWorkItem(true);
                        }}
                    >
                        Crear Partida
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setShowEdit(true)}>
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil className="size-4" aria-hidden="true" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {isSuperAdmin && (
                        <DropdownMenuItem
                            onSelect={() => setShowReactivate(true)}
                            disabled={data.isActive}
                        >
                            Reactivar
                            <DropdownMenuShortcut>
                                <RefreshCcwDot
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="text-red-700"
                        onSelect={() => setShowDelete(true)}
                        disabled={!data.isActive}
                    >
                        Eliminar
                        <DropdownMenuShortcut>
                            <Trash className="size-4" aria-hidden="true" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function WorkItemActions({
    parentId,
    hasApu,
    data,
    isSuperAdmin,
}: {
    parentId: string;
    hasApu: boolean;
    data: GenericTableItem;
    isSuperAdmin: boolean;
}) {
    const [showCreate, setShowCreate] = useState(false);
    const [showEditSheet, setShowEditSheet] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showReactivateDialog, setShowReactivateDialog] = useState(false);

    return (
        <div>
            <div>
                <CreateSubWorkItemDialog
                    open={showCreate}
                    onOpenChange={setShowCreate}
                    workitemId={parentId}
                />
                <EditWorkItemSheet
                    open={showEditSheet}
                    onOpenChange={setShowEditSheet}
                    data={data}
                />
                <DeleteWorkItemDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    data={data}
                />
                <ReactivateWorkItemDialog
                    open={showReactivateDialog}
                    onOpenChange={setShowReactivateDialog}
                    data={data}
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
                    {!hasApu && (
                        <>
                            <DropdownMenuItem
                                onSelect={() => {
                                    setShowCreate(true);
                                }}
                            >
                                Crear Subpartida
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                        </>
                    )}

                    <DropdownMenuItem onSelect={() => setShowEditSheet(true)}>
                        Editar
                        {!hasApu && (
                            <>
                                <DropdownMenuShortcut>
                                    <Pencil
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </DropdownMenuShortcut>
                            </>
                        )}
                    </DropdownMenuItem>
                    {hasApu && (
                        <>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    {isSuperAdmin && (
                        <DropdownMenuItem
                            onSelect={() => setShowReactivateDialog(true)}
                            disabled={data.isActive}
                        >
                            Reactivar
                            <DropdownMenuShortcut>
                                <RefreshCcwDot
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="text-red-700"
                        onSelect={() => setShowDeleteDialog(true)}
                        disabled={!data.isActive}
                    >
                        Eliminar
                        <DropdownMenuShortcut>
                            <Trash className="size-4" aria-hidden="true" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function SubWorkItemActions({
    data,
    isSuperAdmin,
}: {
    parentId: string;
    data: GenericTableItem;
    isSuperAdmin: boolean;
}) {
    const [showEditSheet, setShowEditSheet] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showReactivateDialog, setShowReactivateDialog] = useState(false);

    return (
        <div>
            <div>
                <EditWorkItemSheet
                    open={showEditSheet}
                    onOpenChange={setShowEditSheet}
                    data={data}
                    isSub={true}
                />
                <DeleteSubWorkItemDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    data={data}
                />
                <ReactivateSubWorkItemDialog
                    open={showReactivateDialog}
                    onOpenChange={setShowReactivateDialog}
                    data={data}
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
                    <DropdownMenuItem onSelect={() => setShowEditSheet(true)}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {isSuperAdmin && (
                        <DropdownMenuItem
                            onSelect={() => setShowReactivateDialog(true)}
                            disabled={data.isActive}
                        >
                            Reactivar
                            <DropdownMenuShortcut>
                                <RefreshCcwDot
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="text-red-700"
                        onSelect={() => setShowDeleteDialog(true)}
                        disabled={!data.isActive}
                    >
                        Eliminar
                        <DropdownMenuShortcut>
                            <Trash className="size-4" aria-hidden="true" />
                        </DropdownMenuShortcut>
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
