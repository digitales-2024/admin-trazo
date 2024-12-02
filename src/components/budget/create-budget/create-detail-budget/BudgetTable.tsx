import {
    FullCategory,
    SubcategoryDragCategory,
    SubworkItemDragCategory,
    WorkItemDragCategory,
} from "@/types";
import { Droppable } from "@hello-pangea/dnd";
import { Trash2, Package, Layers, FileText, List } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Budget } from "./types";

interface BudgetTableProps {
    budget: Budget;
    onDeleteCategory: (id: string) => void;
    onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void;
    onDeleteWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
    ) => void;
    onDeleteSubWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        subItemId: string,
    ) => void;
    onUpdateWorkItemQuantity: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        quantity: number,
    ) => void;
    onUpdateWorkItemUnitPrice: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        unitPrice: number,
    ) => void;
    onUpdateSubWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        subItemId: string,
        quantity: number,
        unitPrice: number,
    ) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
    budget,
    onDeleteCategory,
    onDeleteSubcategory,
    onDeleteWorkItem,
    onDeleteSubWorkItem,
    onUpdateWorkItemQuantity,
    onUpdateWorkItemUnitPrice,
    onUpdateSubWorkItem,
}) => {
    const calculateSubWorkItemTotal = (subItem: SubworkItemDragCategory) =>
        (subItem.quantity || 0) * (subItem.unitCost || 0);

    const calculateWorkItemTotal = (item: WorkItemDragCategory) =>
        item.subworkItem.length > 0
            ? item.subworkItem.reduce(
                  (total, subItem) =>
                      total + calculateSubWorkItemTotal(subItem),
                  0,
              )
            : (item.quantity || 0) * (item.unitCost || 0);

    const calculateSubcategoryTotal = (subcategory: SubcategoryDragCategory) =>
        subcategory.workItems.reduce(
            (total, item) => total + calculateWorkItemTotal(item),
            0,
        );

    const calculateCategoryTotal = (category: FullCategory) =>
        category.subcategories.reduce(
            (total, subcategory) =>
                total + calculateSubcategoryTotal(subcategory),
            0,
        );

    return (
        <Droppable droppableId="budget">
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-2/3 rounded-md border bg-white p-4"
                >
                    <h3 className="mb-2 font-semibold">Presupuesto</h3>
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        ID
                                    </TableHead>
                                    <TableHead className="w-[250px]">
                                        Nombre
                                    </TableHead>
                                    <TableHead>Detalles</TableHead>
                                    <TableHead className="w-[100px]">
                                        Subtotal
                                    </TableHead>
                                    <TableHead className="w-[100px]">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {budget.categories.map((category, catIndex) => (
                                    <React.Fragment key={category.id}>
                                        <TableRow className="bg-blue-50">
                                            <TableCell>
                                                {catIndex + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Package className="mr-2 h-5 w-5 text-blue-500" />
                                                    {category.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {category.subcategories.length}{" "}
                                                subcategorías
                                            </TableCell>
                                            <TableCell>
                                                S/.{" "}
                                                {calculateCategoryTotal(
                                                    category,
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        onDeleteCategory(
                                                            category.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {category.subcategories.map(
                                            (subcategory, subIndex) => (
                                                <React.Fragment
                                                    key={subcategory.id}
                                                >
                                                    <TableRow className="bg-green-50">
                                                        <TableCell>{`${catIndex + 1}.${subIndex + 1}`}</TableCell>
                                                        <TableCell className="pl-8">
                                                            <div className="flex items-center">
                                                                <Layers className="mr-2 h-5 w-5 text-green-500" />
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                subcategory
                                                                    .workItems
                                                                    .length
                                                            }{" "}
                                                            ítems
                                                        </TableCell>
                                                        <TableCell>
                                                            S/.{" "}
                                                            {calculateSubcategoryTotal(
                                                                subcategory,
                                                            ).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    onDeleteSubcategory(
                                                                        category.id,
                                                                        subcategory.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {subcategory.workItems.map(
                                                        (item, itemIndex) => (
                                                            <React.Fragment
                                                                key={item.id}
                                                            >
                                                                <TableRow className="bg-yellow-50">
                                                                    <TableCell>{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}`}</TableCell>
                                                                    <TableCell className="pl-12">
                                                                        <div className="flex items-center">
                                                                            <FileText className="mr-2 h-5 w-5 text-yellow-500" />
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item
                                                                            .subworkItem
                                                                            .length >
                                                                        0 ? (
                                                                            `${item.subworkItem.length} sub-ítems`
                                                                        ) : (
                                                                            <div className="flex space-x-2">
                                                                                <Input
                                                                                    type="number"
                                                                                    value={
                                                                                        item.quantity ||
                                                                                        0
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        onUpdateWorkItemQuantity(
                                                                                            category.id,
                                                                                            subcategory.id,
                                                                                            item.id,
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            ),
                                                                                        )
                                                                                    }
                                                                                    className="w-20"
                                                                                    placeholder="Cantidad"
                                                                                />
                                                                                <Input
                                                                                    type="number"
                                                                                    value={
                                                                                        item.unitCost ||
                                                                                        0
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        onUpdateWorkItemUnitPrice(
                                                                                            category.id,
                                                                                            subcategory.id,
                                                                                            item.id,
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            ),
                                                                                        )
                                                                                    }
                                                                                    className="w-20"
                                                                                    placeholder="Precio"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        S/.{" "}
                                                                        {calculateWorkItemTotal(
                                                                            item,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            onClick={() =>
                                                                                onDeleteWorkItem(
                                                                                    category.id,
                                                                                    subcategory.id,
                                                                                    item.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {item.subworkItem.map(
                                                                    (
                                                                        subItem,
                                                                        subItemIndex,
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                subItem.id
                                                                            }
                                                                            className="bg-red-50"
                                                                        >
                                                                            <TableCell>{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}.${subItemIndex + 1}`}</TableCell>
                                                                            <TableCell className="pl-16">
                                                                                <div className="flex items-center">
                                                                                    <List className="mr-2 h-5 w-5 text-red-500" />
                                                                                    {
                                                                                        subItem.name
                                                                                    }
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="flex space-x-2">
                                                                                    <Input
                                                                                        type="number"
                                                                                        value={
                                                                                            subItem.quantity
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            onUpdateSubWorkItem(
                                                                                                category.id,
                                                                                                subcategory.id,
                                                                                                item.id,
                                                                                                subItem.id,
                                                                                                Number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                                subItem.unitCost ||
                                                                                                    0,
                                                                                            )
                                                                                        }
                                                                                        placeholder="Cantidad"
                                                                                    />
                                                                                    <Input
                                                                                        type="number"
                                                                                        value={
                                                                                            subItem.unitCost
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            onUpdateSubWorkItem(
                                                                                                category.id,
                                                                                                subcategory.id,
                                                                                                item.id,
                                                                                                subItem.id,
                                                                                                subItem.quantity ||
                                                                                                    0,
                                                                                                Number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                            )
                                                                                        }
                                                                                        placeholder="Precio"
                                                                                    />
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                S/.{" "}
                                                                                {(
                                                                                    (subItem.quantity ||
                                                                                        0) *
                                                                                    (subItem.unitCost ||
                                                                                        0)
                                                                                ).toFixed(
                                                                                    2,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="destructive"
                                                                                    onClick={() =>
                                                                                        onDeleteSubWorkItem(
                                                                                            category.id,
                                                                                            subcategory.id,
                                                                                            item.id,
                                                                                            subItem.id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </React.Fragment>
                                                        ),
                                                    )}
                                                </React.Fragment>
                                            ),
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};
