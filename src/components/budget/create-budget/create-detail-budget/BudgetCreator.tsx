"use client";

import { useCategory } from "@/hooks/use-category";
import {
    DragCategoriesItem,
    FullCategory,
    SubcategoryDragCategory,
    SubworkItemDragCategory,
    WorkItemDragCategory,
} from "@/types";
import { DragDropContext } from "@hello-pangea/dnd";
import { BarChart2 } from "lucide-react";
import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AvailableItems } from "./AvailableItems";
import { BudgetTable } from "./BudgetTable";
import PercentageBudget from "./PercentageBudget";
import SummaryBudget from "./SummaryBudget";
import { Budget } from "./types";

const calculateSubWorkItemTotal = (subItem: SubworkItemDragCategory) =>
    (subItem.quantity || 0) * (subItem.unitCost || 0);

const calculateWorkItemTotal = (item: WorkItemDragCategory) =>
    item.subworkItem && item.subworkItem.length > 0
        ? item.subworkItem.reduce(
              (total, subItem) => total + calculateSubWorkItemTotal(subItem),
              0,
          )
        : (item.quantity || 0) * (item.unitCost || 0);

const calculateSubcategoryTotal = (subcategory: SubcategoryDragCategory) => {
    if (!subcategory.workItems) {
        return 0;
    }
    return subcategory.workItems.reduce(
        (total, item) => total + calculateWorkItemTotal(item),
        0,
    );
};

const calculateCategoryTotal = (category: FullCategory) =>
    category.subcategories.reduce(
        (total, subcategory) => total + calculateSubcategoryTotal(subcategory),
        0,
    );

export default function BudgetCreator() {
    const [budget, setBudget] = useState<Budget>({
        categories: [],
        overheadPercentage: 15,
        profitPercentage: 10,
        taxPercentage: 18,
    });

    const { fullCategoryData } = useCategory();

    interface DragResult {
        source: {
            droppableId: string;
            index: number;
        };
        destination: {
            droppableId: string;
            index: number;
        } | null;
        draggableId: string;
        type: string;
    }

    const onDragEnd = (result: DragResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (
            source.droppableId === "items" &&
            destination.droppableId === "budget"
        ) {
            const draggedItemId = result.draggableId;
            const draggedItem = findDragItemById(
                fullCategoryData || [],
                draggedItemId,
            );

            if (draggedItem) {
                switch (draggedItem.type) {
                    case "category":
                        addCategory(draggedItem.name, draggedItem.id);
                        break;
                    case "subcategory":
                        if (budget.categories.length > 0) {
                            addSubcategory(
                                budget.categories[budget.categories.length - 1]
                                    .id,
                                draggedItem.name,
                                draggedItem.id,
                            );
                        }
                        break;
                    case "workItem":
                        if (
                            budget.categories.length > 0 &&
                            budget.categories[budget.categories.length - 1]
                                .subcategories.length > 0
                        ) {
                            const lastCategory =
                                budget.categories[budget.categories.length - 1];
                            const lastSubcategory =
                                lastCategory.subcategories[
                                    lastCategory.subcategories.length - 1
                                ];
                            addWorkItem(
                                lastCategory.id,
                                lastSubcategory.id,
                                draggedItem.name,
                                draggedItem.id,
                            );
                        }
                        break;
                    case "subWorkItem":
                        if (
                            budget.categories.length > 0 &&
                            budget.categories[budget.categories.length - 1]
                                .subcategories.length > 0 &&
                            budget.categories[budget.categories.length - 1]
                                .subcategories[
                                budget.categories[budget.categories.length - 1]
                                    .subcategories.length - 1
                            ].workItems.length > 0
                        ) {
                            const lastCategory =
                                budget.categories[budget.categories.length - 1];
                            const lastSubcategory =
                                lastCategory.subcategories[
                                    lastCategory.subcategories.length - 1
                                ];
                            const lastItem =
                                lastSubcategory.workItems[
                                    lastSubcategory.workItems.length - 1
                                ];
                            addSubWorkItem(
                                lastCategory.id,
                                lastSubcategory.id,
                                lastItem.id,
                                draggedItem.name,
                                draggedItem.id,
                            );
                        }
                        break;
                }
            }
        }
    };

    const addCategory = (name: string, id: string) => {
        const newCategory: FullCategory = {
            id: id,
            name,
            subcategories: [],
        };
        setBudget((prev) => ({
            ...prev,
            categories: [...prev.categories, newCategory],
        }));
    };

    const addSubcategory = (categoryId: string, name: string, id: string) => {
        const newSubcategory: SubcategoryDragCategory = {
            id: id,
            name,
            workItems: [],
        };
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: [...cat.subcategories, newSubcategory],
                      }
                    : cat,
            ),
        }));
    };

    const addWorkItem = (
        categoryId: string,
        subcategoryId: string,
        name: string,
        id: string,
    ) => {
        const newWorkItem: WorkItemDragCategory = {
            id: id,
            name,
            subworkItem: [],
            quantity: 0,
            unitCost: 0,
        };
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((subcat) =>
                              subcat.id === subcategoryId
                                  ? {
                                        ...subcat,
                                        workItems: [
                                            ...subcat.workItems,
                                            newWorkItem,
                                        ],
                                    }
                                  : subcat,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const addSubWorkItem = (
        categoryId: string,
        subcategoryId: string,
        workItemId: string,
        name: string,
        id: string,
    ) => {
        const newSubWorkItem: SubworkItemDragCategory = {
            id: id,
            name,
            quantity: 0,
            unitCost: 0,
        };
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((subcat) =>
                              subcat.id === subcategoryId
                                  ? {
                                        ...subcat,
                                        workItems: subcat.workItems.map(
                                            (item) =>
                                                item.id === workItemId
                                                    ? {
                                                          ...item,
                                                          subworkItem: [
                                                              ...(item.subworkItem ||
                                                                  []),
                                                              newSubWorkItem,
                                                          ],
                                                      }
                                                    : item,
                                        ),
                                    }
                                  : subcat,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const deleteCategory = (categoryId: string) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.filter((cat) => cat.id !== categoryId),
        }));
    };

    const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.filter(
                              (subcat) => subcat.id !== subcategoryId,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const deleteWorkItem = (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
    ) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((subcat) =>
                              subcat.id === subcategoryId
                                  ? {
                                        ...subcat,
                                        workItems: subcat.workItems.filter(
                                            (item) => item.id !== itemId,
                                        ),
                                    }
                                  : subcat,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const deleteSubWorkItem = (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        subItemId: string,
    ) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((subcat) =>
                              subcat.id === subcategoryId
                                  ? {
                                        ...subcat,
                                        workItems: subcat.workItems.map(
                                            (item) =>
                                                item.id === itemId
                                                    ? {
                                                          ...item,
                                                          subworkItem:
                                                              item.subworkItem?.filter(
                                                                  (subItem) =>
                                                                      subItem.id !==
                                                                      subItemId,
                                                              ),
                                                      }
                                                    : item,
                                        ),
                                    }
                                  : subcat,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const updateWorkItemQuantity = (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        quantity: number,
    ) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((subcat) =>
                              subcat.id === subcategoryId
                                  ? {
                                        ...subcat,
                                        workItems: subcat.workItems.map(
                                            (item) =>
                                                item.id === itemId
                                                    ? { ...item, quantity }
                                                    : item,
                                        ),
                                    }
                                  : subcat,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const updateWorkItemUnitPrice = (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        unitPrice: number,
    ) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((subcat) =>
                              subcat.id === subcategoryId
                                  ? {
                                        ...subcat,
                                        workItems: subcat.workItems.map(
                                            (item) =>
                                                item.id === itemId
                                                    ? { ...item, unitPrice }
                                                    : item,
                                        ),
                                    }
                                  : subcat,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const updateSubWorkItem = (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        subItemId: string,
        updatedSubItem: SubworkItemDragCategory,
    ) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === categoryId
                    ? {
                          ...cat,
                          subcategories: cat.subcategories.map((sc) =>
                              sc.id === subcategoryId
                                  ? {
                                        ...sc,
                                        workItems: sc.workItems.map((i) =>
                                            i.id === itemId
                                                ? {
                                                      ...i,
                                                      subworkItem:
                                                          i.subworkItem?.map(
                                                              (si) =>
                                                                  si.id ===
                                                                  subItemId
                                                                      ? updatedSubItem
                                                                      : si,
                                                          ),
                                                  }
                                                : i,
                                        ),
                                    }
                                  : sc,
                          ),
                      }
                    : cat,
            ),
        }));
    };

    const calculateTotals = () => {
        const directCosts = budget.categories.reduce(
            (total, category) => total + calculateCategoryTotal(category),
            0,
        );
        const overhead = directCosts * (budget.overheadPercentage / 100);
        const profit = directCosts * (budget.profitPercentage / 100);
        const subtotal = directCosts + overhead + profit;
        const tax = subtotal * (budget.taxPercentage / 100);
        const total = subtotal + tax;
        return { directCosts, overhead, profit, tax, total };
    };

    const { directCosts, overhead, profit, tax, total } = calculateTotals();

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="container mx-auto min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
                <Card className="mx-auto w-full max-w-6xl shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <CardTitle className="text-center text-3xl font-bold">
                            Creador de Presupuestos Interactivo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="lg:col-span-2">
                                <h2 className="mb-4 flex items-center text-xl font-semibold">
                                    <BarChart2 className="mr-2" /> Estructura
                                    del Presupuesto
                                </h2>
                                <div className="flex space-x-4">
                                    {fullCategoryData && (
                                        <AvailableItems
                                            items={fullCategoryData}
                                        />
                                    )}
                                    <BudgetTable
                                        budget={budget}
                                        onDeleteCategory={deleteCategory}
                                        onDeleteSubcategory={deleteSubcategory}
                                        onDeleteWorkItem={deleteWorkItem}
                                        onDeleteSubWorkItem={deleteSubWorkItem}
                                        onUpdateWorkItemQuantity={
                                            updateWorkItemQuantity
                                        }
                                        onUpdateWorkItemUnitPrice={
                                            updateWorkItemUnitPrice
                                        }
                                        onUpdateSubWorkItem={(
                                            categoryId,
                                            subcategoryId,
                                            itemId,
                                            subItemId,
                                            quantity,
                                            unitCost,
                                        ) =>
                                            updateSubWorkItem(
                                                categoryId,
                                                subcategoryId,
                                                itemId,
                                                subItemId,
                                                {
                                                    id: subItemId,
                                                    name: "",
                                                    quantity,
                                                    unitCost,
                                                },
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <PercentageBudget
                                    budget={budget}
                                    setBudget={setBudget}
                                />
                                <SummaryBudget
                                    directCosts={directCosts}
                                    overhead={overhead}
                                    profit={profit}
                                    tax={tax}
                                    total={total}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DragDropContext>
    );
}

function findDragItemById(
    items: DragCategoriesItem[],
    id: string,
): DragCategoriesItem | undefined {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.subcategories) {
            const found = findDragItemById(item.subcategories, id);
            if (found) return found;
        }
        if (item.workItems) {
            const found = findDragItemById(item.workItems, id);
            if (found) return found;
        }
        if (item.subWorkItems) {
            const found = findDragItemById(item.subWorkItems, id);
            if (found) return found;
        }
    }
    return undefined;
}
