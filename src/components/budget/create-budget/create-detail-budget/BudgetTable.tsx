import {
    FullCategory,
    SubcategoryDragCategory,
    SubworkItemDragCategory,
    WorkItemDragCategory,
} from "@/types";
import { Droppable } from "@hello-pangea/dnd";
import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { CategoryRow } from "./CategoryRows";
import SubcategoryRow from "./SubcategoryRows";
import SubWorkItemRow from "./SubWorkItemRow";
import { Budget } from "./types";
import WorkItemRow from "./WorkItemRow";

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
    onUpdateWorkItem: (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        updates: Partial<WorkItemDragCategory>,
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
    onUpdateWorkItem,
    onUpdateSubWorkItem,
}) => {
    const calculateSubWorkItemTotal = (subItem: SubworkItemDragCategory) =>
        (subItem.quantity || 0) * (subItem.unitCost || 0);

    const calculateWorkItemTotal = (item: WorkItemDragCategory) =>
        item.subWorkItems.length > 0
            ? item.subWorkItems.reduce(
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
                    className="w-3/4 overflow-auto rounded-md border bg-white p-4"
                >
                    <h3 className="mb-2 font-semibold">Presupuesto</h3>
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">
                                        ID
                                    </TableHead>
                                    <TableHead className="w-[250px] text-center">
                                        Nombre
                                    </TableHead>
                                    <TableHead className="w-[50px] text-center">
                                        Unidad
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Cantidad
                                    </TableHead>
                                    <TableHead className="w-[250px] text-center">
                                        Precio
                                    </TableHead>
                                    <TableHead className="w-[200px] text-center">
                                        Subtotal
                                    </TableHead>
                                    <TableHead className="w-[100px] text-center">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="w-full">
                                {budget.categories.map((category, catIndex) => (
                                    <React.Fragment key={category.id}>
                                        <CategoryRow
                                            category={category}
                                            catIndex={catIndex}
                                            onDeleteCategory={onDeleteCategory}
                                            calculateCategoryTotal={
                                                calculateCategoryTotal
                                            }
                                        />
                                        {category.subcategories.map(
                                            (subcategory, subIndex) => (
                                                <React.Fragment
                                                    key={subcategory.id}
                                                >
                                                    <SubcategoryRow
                                                        catIndex={catIndex}
                                                        subIndex={subIndex}
                                                        category={category}
                                                        subcategory={
                                                            subcategory
                                                        }
                                                        calculateSubcategoryTotal={
                                                            calculateSubcategoryTotal
                                                        }
                                                        onDeleteSubcategory={
                                                            onDeleteSubcategory
                                                        }
                                                    />
                                                    {subcategory.workItems.map(
                                                        (item, itemIndex) => (
                                                            <React.Fragment
                                                                key={item.id}
                                                            >
                                                                <WorkItemRow
                                                                    catIndex={
                                                                        catIndex
                                                                    }
                                                                    subIndex={
                                                                        subIndex
                                                                    }
                                                                    itemIndex={
                                                                        itemIndex
                                                                    }
                                                                    category={
                                                                        category
                                                                    }
                                                                    subcategory={
                                                                        subcategory
                                                                    }
                                                                    item={item}
                                                                    calculateWorkItemTotal={
                                                                        calculateWorkItemTotal
                                                                    }
                                                                    onUpdateWorkItem={
                                                                        onUpdateWorkItem
                                                                    }
                                                                    onDeleteWorkItem={
                                                                        onDeleteWorkItem
                                                                    }
                                                                />
                                                                {item.subWorkItems.map(
                                                                    (
                                                                        subItem,
                                                                        subItemIndex,
                                                                    ) => (
                                                                        <SubWorkItemRow
                                                                            key={
                                                                                subItem.id
                                                                            }
                                                                            catIndex={
                                                                                catIndex
                                                                            }
                                                                            subIndex={
                                                                                subIndex
                                                                            }
                                                                            itemIndex={
                                                                                itemIndex
                                                                            }
                                                                            subItemIndex={
                                                                                subItemIndex
                                                                            }
                                                                            category={
                                                                                category
                                                                            }
                                                                            subcategory={
                                                                                subcategory
                                                                            }
                                                                            item={
                                                                                item
                                                                            }
                                                                            subItem={
                                                                                subItem
                                                                            }
                                                                            onUpdateSubWorkItem={
                                                                                onUpdateSubWorkItem
                                                                            }
                                                                            onDeleteSubWorkItem={
                                                                                onDeleteSubWorkItem
                                                                            }
                                                                        />
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
