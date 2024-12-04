"use client";

import { useCategory } from "@/hooks/use-category";
import {
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
import {
    calculateCategoryTotal,
    DragResult,
    findDragItemById,
} from "./utils/budget-utils";

export default function BudgetCreator() {
    const [budget, setBudget] = useState<Budget>({
        categories: [],
        overheadPercentage: 15,
        profitPercentage: 10,
        taxPercentage: 18,
    });

    console.log(
        "este es el budget de creator",
        JSON.stringify(budget, null, 2),
    );

    const { fullCategoryData } = useCategory();

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
                            addWorkItem(
                                draggedItem.name,
                                draggedItem.id,
                                draggedItem.unit || "",
                                draggedItem.unitCost || 0,
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
                            addSubWorkItem(
                                draggedItem.name,
                                draggedItem.id,
                                draggedItem.unit || "",
                                draggedItem.unitCost || 0,
                            );
                        }
                        break;
                }
            }
        }
    };

    const getParentIDs = (type: string, id: string) => {
        if (!fullCategoryData) return null;
        for (const category of fullCategoryData) {
            if (type === "category" && category.id === id) {
                // Retornar los IDs de la categoría
                return { categoryId: category.id };
            }

            for (const subcategory of category.subcategories || []) {
                if (type === "subcategory" && subcategory.id === id) {
                    // Retornar los IDs de la categoría
                    return { categoryId: category.id };
                }

                for (const workItem of subcategory.workItems || []) {
                    if (type === "workItem" && workItem.id === id) {
                        // Retornar los IDs de la categoría, subcategoría
                        return {
                            categoryId: category.id,
                            subcategoryId: subcategory.id,
                        };
                    }

                    for (const subWorkItem of workItem.subWorkItems || []) {
                        if (type === "subWorkItem" && subWorkItem.id === id) {
                            // Retornar los IDs de la categoría, subcategoría y el de partida
                            return {
                                categoryId: category.id,
                                subcategoryId: subcategory.id,
                                workItemId: workItem.id,
                            };
                        }
                    }
                }
            }
        }
        return null;
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
        name: string,
        id: string,
        unit: string,
        unitCost: number,
    ) => {
        const newWorkItem: WorkItemDragCategory = {
            id: id,
            name,
            subWorkItems: [],
            quantity: 0,
            unitCost: unitCost,
            unit: unit,
        };

        const { categoryId, subcategoryId } = getParentIDs("workItem", id) as {
            categoryId: string;
            subcategoryId: string;
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
        name: string,
        id: string,
        unit: string,
        unitCost: number,
    ) => {
        const newSubWorkItem: SubworkItemDragCategory = {
            id: id,
            name,
            quantity: 0,
            unitCost: unitCost,
            unit: unit,
        };
        const { categoryId, subcategoryId, workItemId } = getParentIDs(
            "subWorkItem",
            id,
        ) as {
            categoryId: string;
            subcategoryId: string;
            workItemId: string;
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
                                                          subWorkItems: [
                                                              ...(item.subWorkItems ||
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
                                                          subWorkItems:
                                                              item.subWorkItems?.filter(
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

    const updateWorkItemApuId = (
        categoryId: string,
        subcategoryId: string,
        itemId: string,
        apuId: string,
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
                                                    ? { ...item, apuId }
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
                                                      subWorkItems:
                                                          i.subWorkItems?.map(
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
            <div className="min-h-screen">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex w-full justify-between">
                            <div className="flex w-full cursor-pointer items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BarChart2 size={24} strokeWidth={1.5} />
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        Estructura del Presupuesto
                                    </CardTitle>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="lg:col-span-2">
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
                                        onUpdateWorkItemApuId={
                                            updateWorkItemApuId
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
