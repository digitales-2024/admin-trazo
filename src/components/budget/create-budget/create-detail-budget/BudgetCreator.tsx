"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
    BarChart2,
    ChevronRight,
    Trash2,
    Package,
    Layers,
    FileText,
    List,
} from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

import PercentageBudget from "./PercentageBudget";
import SummaryBudget from "./SummaryBudget";
import {
    Budget,
    CategoryType,
    SubcategoryType,
    WorkItemType,
    SubWorkItemType,
} from "./types";

const calculateSubWorkItemTotal = (subItem: SubWorkItemType) =>
    subItem.quantity * subItem.unitPrice;

const calculateWorkItemTotal = (item: WorkItemType) =>
    item.subItems.length > 0
        ? item.subItems.reduce(
              (total, subItem) => total + calculateSubWorkItemTotal(subItem),
              0,
          )
        : (item.quantity || 0) * (item.unitCost || 0);

const calculateSubcategoryTotal = (subcategory: SubcategoryType) =>
    subcategory.items.reduce(
        (total, item) => total + calculateWorkItemTotal(item),
        0,
    );

const calculateCategoryTotal = (category: CategoryType) =>
    category.subcategories.reduce(
        (total, subcategory) => total + calculateSubcategoryTotal(subcategory),
        0,
    );

const ItemTypes = {
    CATEGORY: "Categoría",
    SUBCATEGORY: "Subcategoría",
    ITEM: "Ítem",
    SUBITEM: "Sub-Ítem",
};

const ItemIcons = {
    [ItemTypes.CATEGORY]: Package,
    [ItemTypes.SUBCATEGORY]: Layers,
    [ItemTypes.ITEM]: FileText,
    [ItemTypes.SUBITEM]: List,
};

interface DraggableItemProps {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
    id,
    name,
    icon: Icon,
}) => (
    <Draggable draggableId={id} index={parseInt(id)}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="flex items-center space-x-2 rounded-md border bg-white p-2 shadow-sm"
            >
                <Icon className="h-5 w-5 text-gray-500" />
                <span>{name}</span>
            </div>
        )}
    </Draggable>
);

export default function BudgetCreator() {
    const [budget, setBudget] = useState<Budget>({
        categories: [],
        overheadPercentage: 15,
        profitPercentage: 10,
        taxPercentage: 18,
    });

    const [dragItems] = useState([
        { id: "1", type: ItemTypes.CATEGORY, name: "Materiales" },
        { id: "2", type: ItemTypes.CATEGORY, name: "Mano de Obra" },
        { id: "3", type: ItemTypes.CATEGORY, name: "Equipos" },
        { id: "4", type: ItemTypes.SUBCATEGORY, name: "Concreto" },
        { id: "5", type: ItemTypes.SUBCATEGORY, name: "Acero" },
        { id: "6", type: ItemTypes.ITEM, name: "Cemento" },
        { id: "7", type: ItemTypes.ITEM, name: "Arena" },
        { id: "8", type: ItemTypes.SUBITEM, name: "Operario" },
        { id: "9", type: ItemTypes.SUBITEM, name: "Peón" },
    ]);

    interface DragResult {
        destination: {
            droppableId: string;
            index: number;
        } | null;
        source: {
            droppableId: string;
            index: number;
        };
    }

    const onDragEnd = (result: DragResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (
            source.droppableId === "items" &&
            destination.droppableId === "budget"
        ) {
            const draggedItem = dragItems[source.index];

            switch (draggedItem.type) {
                case ItemTypes.CATEGORY:
                    addCategory(draggedItem.name);
                    break;
                case ItemTypes.SUBCATEGORY:
                    if (budget.categories.length > 0) {
                        addSubcategory(
                            budget.categories[budget.categories.length - 1].id,
                            draggedItem.name,
                        );
                    }
                    break;
                case ItemTypes.ITEM:
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
                        );
                    }
                    break;
                case ItemTypes.SUBITEM:
                    if (
                        budget.categories.length > 0 &&
                        budget.categories[budget.categories.length - 1]
                            .subcategories.length > 0 &&
                        budget.categories[budget.categories.length - 1]
                            .subcategories[
                            budget.categories[budget.categories.length - 1]
                                .subcategories.length - 1
                        ].items.length > 0
                    ) {
                        const lastCategory =
                            budget.categories[budget.categories.length - 1];
                        const lastSubcategory =
                            lastCategory.subcategories[
                                lastCategory.subcategories.length - 1
                            ];
                        const lastItem =
                            lastSubcategory.items[
                                lastSubcategory.items.length - 1
                            ];
                        addSubWorkItem(
                            lastCategory.id,
                            lastSubcategory.id,
                            lastItem.id,
                            draggedItem.name,
                        );
                    }
                    break;
            }
        }
    };

    const addCategory = (name: string) => {
        const newCategory: CategoryType = {
            id: uuidv4(),
            name,
            subcategories: [],
        };
        setBudget((prev) => ({
            ...prev,
            categories: [...prev.categories, newCategory],
        }));
    };

    const addSubcategory = (categoryId: string, name: string) => {
        const newSubcategory: SubcategoryType = {
            id: uuidv4(),
            name,
            items: [],
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
    ) => {
        const newWorkItem: WorkItemType = {
            id: uuidv4(),
            name,
            subItems: [],
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
                                        items: [...subcat.items, newWorkItem],
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
    ) => {
        const newSubWorkItem: SubWorkItemType = {
            id: uuidv4(),
            name,
            quantity: 0,
            unitPrice: 0,
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
                                        items: subcat.items.map((item) =>
                                            item.id === workItemId
                                                ? {
                                                      ...item,
                                                      subItems: [
                                                          ...item.subItems,
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
                                        items: subcat.items.filter(
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
                                        items: subcat.items.map((item) =>
                                            item.id === itemId
                                                ? {
                                                      ...item,
                                                      subItems:
                                                          item.subItems.filter(
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
                                        items: subcat.items.map((item) =>
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
                                        items: subcat.items.map((item) =>
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
                            <div>
                                <h2 className="mb-4 flex items-center text-xl font-semibold">
                                    <BarChart2 className="mr-2" /> Estructura
                                    del Presupuesto
                                </h2>
                                <div className="flex space-x-4">
                                    <Droppable droppableId="items">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="w-1/3 rounded-md bg-gray-100 p-4"
                                            >
                                                <h3 className="mb-2 font-semibold">
                                                    Elementos Disponibles
                                                </h3>
                                                {dragItems.map((item) => (
                                                    <DraggableItem
                                                        key={item.id}
                                                        id={item.id}
                                                        name={item.name}
                                                        icon={
                                                            ItemIcons[item.type]
                                                        }
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    <Droppable droppableId="budget">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="w-2/3 rounded-md border bg-white p-4"
                                            >
                                                <h3 className="mb-2 font-semibold">
                                                    Presupuesto
                                                </h3>
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
                                                                <TableHead>
                                                                    Detalles
                                                                </TableHead>
                                                                <TableHead className="w-[100px]">
                                                                    Subtotal
                                                                </TableHead>
                                                                <TableHead className="w-[100px]">
                                                                    Acciones
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {budget.categories.map(
                                                                (
                                                                    category,
                                                                    catIndex,
                                                                ) => (
                                                                    <Collapsible
                                                                        key={
                                                                            category.id
                                                                        }
                                                                    >
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                {catIndex +
                                                                                    1}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <CollapsibleTrigger className="flex items-center">
                                                                                    <ChevronRight className="mr-2 h-4 w-4" />
                                                                                    {
                                                                                        category.name
                                                                                    }
                                                                                </CollapsibleTrigger>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    category
                                                                                        .subcategories
                                                                                        .length
                                                                                }{" "}
                                                                                subcategorías
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                S/.{" "}
                                                                                {calculateCategoryTotal(
                                                                                    category,
                                                                                ).toFixed(
                                                                                    2,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="destructive"
                                                                                    onClick={() =>
                                                                                        deleteCategory(
                                                                                            category.id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        <CollapsibleContent>
                                                                            {category.subcategories.map(
                                                                                (
                                                                                    subcategory,
                                                                                    subIndex,
                                                                                ) => (
                                                                                    <Collapsible
                                                                                        key={
                                                                                            subcategory.id
                                                                                        }
                                                                                    >
                                                                                        <TableRow className="bg-muted/50">
                                                                                            <TableCell>{`${catIndex + 1}.${subIndex + 1}`}</TableCell>
                                                                                            <TableCell className="pl-8">
                                                                                                <CollapsibleTrigger className="flex items-center">
                                                                                                    <ChevronRight className="mr-2 h-4 w-4" />
                                                                                                    {
                                                                                                        subcategory.name
                                                                                                    }
                                                                                                </CollapsibleTrigger>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {
                                                                                                    subcategory
                                                                                                        .items
                                                                                                        .length
                                                                                                }{" "}
                                                                                                ítems
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                S/.{" "}
                                                                                                {calculateSubcategoryTotal(
                                                                                                    subcategory,
                                                                                                ).toFixed(
                                                                                                    2,
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="destructive"
                                                                                                    onClick={() =>
                                                                                                        deleteSubcategory(
                                                                                                            category.id,
                                                                                                            subcategory.id,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <Trash2 className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                        <CollapsibleContent>
                                                                                            {subcategory.items.map(
                                                                                                (
                                                                                                    item,
                                                                                                    itemIndex,
                                                                                                ) => (
                                                                                                    <Collapsible
                                                                                                        key={
                                                                                                            item.id
                                                                                                        }
                                                                                                    >
                                                                                                        <TableRow className="bg-muted/20">
                                                                                                            <TableCell>{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}`}</TableCell>
                                                                                                            <TableCell className="pl-12">
                                                                                                                <CollapsibleTrigger className="flex items-center">
                                                                                                                    <ChevronRight className="mr-2 h-4 w-4" />
                                                                                                                    {
                                                                                                                        item.name
                                                                                                                    }
                                                                                                                </CollapsibleTrigger>
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                {item
                                                                                                                    .subItems
                                                                                                                    .length >
                                                                                                                0 ? (
                                                                                                                    `${item.subItems.length} sub-ítems`
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
                                                                                                                                updateWorkItemQuantity(
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
                                                                                                                                updateWorkItemUnitPrice(
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
                                                                                                                        deleteWorkItem(
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
                                                                                                        <CollapsibleContent>
                                                                                                            {item.subItems.map(
                                                                                                                (
                                                                                                                    subItem,
                                                                                                                    subItemIndex,
                                                                                                                ) => (
                                                                                                                    <TableRow
                                                                                                                        key={
                                                                                                                            subItem.id
                                                                                                                        }
                                                                                                                        className="bg-muted/10"
                                                                                                                    >
                                                                                                                        <TableCell>{`${catIndex + 1}.${subIndex + 1}.${itemIndex + 1}.${subItemIndex + 1}`}</TableCell>
                                                                                                                        <TableCell className="pl-16">
                                                                                                                            {
                                                                                                                                subItem.name
                                                                                                                            }
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
                                                                                                                                    ) => {
                                                                                                                                        const updatedSubItem =
                                                                                                                                            {
                                                                                                                                                ...subItem,
                                                                                                                                                quantity:
                                                                                                                                                    Number(
                                                                                                                                                        e
                                                                                                                                                            .target
                                                                                                                                                            .value,
                                                                                                                                                    ),
                                                                                                                                            };
                                                                                                                                        setBudget(
                                                                                                                                            (
                                                                                                                                                prev,
                                                                                                                                            ) => ({
                                                                                                                                                ...prev,
                                                                                                                                                categories:
                                                                                                                                                    prev.categories.map(
                                                                                                                                                        (
                                                                                                                                                            cat,
                                                                                                                                                        ) =>
                                                                                                                                                            cat.id ===
                                                                                                                                                            category.id
                                                                                                                                                                ? {
                                                                                                                                                                      ...cat,
                                                                                                                                                                      subcategories:
                                                                                                                                                                          cat.subcategories.map(
                                                                                                                                                                              (
                                                                                                                                                                                  sc,
                                                                                                                                                                              ) =>
                                                                                                                                                                                  sc.id ===
                                                                                                                                                                                  subcategory.id
                                                                                                                                                                                      ? {
                                                                                                                                                                                            ...sc,
                                                                                                                                                                                            items: sc.items.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                    i,
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                    i.id ===
                                                                                                                                                                                                    item.id
                                                                                                                                                                                                        ? {
                                                                                                                                                                                                              ...i,
                                                                                                                                                                                                              subItems:
                                                                                                                                                                                                                  i.subItems.map(
                                                                                                                                                                                                                      (
                                                                                                                                                                                                                          si,
                                                                                                                                                                                                                      ) =>
                                                                                                                                                                                                                          si.id ===
                                                                                                                                                                                                                          subItem.id
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
                                                                                                                                            }),
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                    placeholder="Cantidad"
                                                                                                                                />
                                                                                                                                <Input
                                                                                                                                    type="number"
                                                                                                                                    value={
                                                                                                                                        subItem.unitPrice
                                                                                                                                    }
                                                                                                                                    onChange={(
                                                                                                                                        e,
                                                                                                                                    ) => {
                                                                                                                                        const updatedSubItem =
                                                                                                                                            {
                                                                                                                                                ...subItem,
                                                                                                                                                unitPrice:
                                                                                                                                                    Number(
                                                                                                                                                        e
                                                                                                                                                            .target
                                                                                                                                                            .value,
                                                                                                                                                    ),
                                                                                                                                            };
                                                                                                                                        setBudget(
                                                                                                                                            (
                                                                                                                                                prev,
                                                                                                                                            ) => ({
                                                                                                                                                ...prev,
                                                                                                                                                categories:
                                                                                                                                                    prev.categories.map(
                                                                                                                                                        (
                                                                                                                                                            cat,
                                                                                                                                                        ) =>
                                                                                                                                                            cat.id ===
                                                                                                                                                            category.id
                                                                                                                                                                ? {
                                                                                                                                                                      ...cat,
                                                                                                                                                                      subcategories:
                                                                                                                                                                          cat.subcategories.map(
                                                                                                                                                                              (
                                                                                                                                                                                  sc,
                                                                                                                                                                              ) =>
                                                                                                                                                                                  sc.id ===
                                                                                                                                                                                  subcategory.id
                                                                                                                                                                                      ? {
                                                                                                                                                                                            ...sc,
                                                                                                                                                                                            items: sc.items.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                    i,
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                    i.id ===
                                                                                                                                                                                                    item.id
                                                                                                                                                                                                        ? {
                                                                                                                                                                                                              ...i,
                                                                                                                                                                                                              subItems:
                                                                                                                                                                                                                  i.subItems.map(
                                                                                                                                                                                                                      (
                                                                                                                                                                                                                          si,
                                                                                                                                                                                                                      ) =>
                                                                                                                                                                                                                          si.id ===
                                                                                                                                                                                                                          subItem.id
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
                                                                                                                                            }),
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                    placeholder="Precio"
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                        </TableCell>
                                                                                                                        <TableCell>
                                                                                                                            S/.{" "}
                                                                                                                            {(
                                                                                                                                subItem.quantity *
                                                                                                                                subItem.unitPrice
                                                                                                                            ).toFixed(
                                                                                                                                2,
                                                                                                                            )}
                                                                                                                        </TableCell>
                                                                                                                        <TableCell>
                                                                                                                            <Button
                                                                                                                                size="sm"
                                                                                                                                variant="destructive"
                                                                                                                                onClick={() =>
                                                                                                                                    deleteSubWorkItem(
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
                                                                                                        </CollapsibleContent>
                                                                                                    </Collapsible>
                                                                                                ),
                                                                                            )}
                                                                                        </CollapsibleContent>
                                                                                    </Collapsible>
                                                                                ),
                                                                            )}
                                                                        </CollapsibleContent>
                                                                    </Collapsible>
                                                                ),
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </ScrollArea>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
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
