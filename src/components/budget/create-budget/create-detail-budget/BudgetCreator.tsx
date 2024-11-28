"use client";

import { useCategory } from "@/hooks/use-category";
import {
    Plus,
    DollarSign,
    Percent,
    BarChart2,
    Sheet,
    Trash2,
} from "lucide-react";
import React, { useState } from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Category } from "./Category";
import { CategoryType, Budget } from "./types";

export default function BudgetCreator() {
    const [budget, setBudget] = useState<Budget>({
        categories: [],
        overheadPercentage: 15,
        profitPercentage: 10,
        taxPercentage: 18,
    });

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Option | undefined
    >(undefined);

    const { dataCategoryAll } = useCategory();

    // Obtener opciones para AutoComplete
    const categoryOptions: Option[] = (dataCategoryAll ?? []).map(
        (category) => ({
            value: category.id.toString(),
            label: category.name,
        }),
    );

    const addCategory = (selectedOption: Option) => {
        const newCategory: CategoryType = {
            id: selectedOption.value,
            name: selectedOption.label,
            subcategories: [],
        };
        setBudget((prev) => ({
            ...prev,
            categories: [...prev.categories, newCategory],
        }));
    };

    const deleteCategory = (categoryId: string) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.filter((cat) => cat.id !== categoryId),
        }));
    };

    const updateCategory = (updatedCategory: CategoryType) => {
        setBudget((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
                cat.id === updatedCategory.id ? updatedCategory : cat,
            ),
        }));
    };

    const calculateTotals = () => {
        const directCosts = budget.categories.reduce(
            (total, category) =>
                total +
                category.subcategories.reduce(
                    (subTotal, subcategory) =>
                        subTotal +
                        subcategory.items.reduce(
                            (itemTotal, item) =>
                                itemTotal +
                                item.subItems.reduce(
                                    (subItemTotal, subItem) =>
                                        subItemTotal +
                                        subItem.quantity * subItem.unitPrice,
                                    0,
                                ),
                            0,
                        ),
                    0,
                ),
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
        <div>
            <Card className="w-full">
                <CardHeader>
                    <div className="flex w-full justify-between">
                        <div className="flex w-full cursor-pointer items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sheet size={24} strokeWidth={1.5} />
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    Detalle del Presupuesto
                                </CardTitle>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <h2 className="mb-4 flex items-center text-xl font-semibold">
                                <BarChart2 className="mr-2" /> Categorías
                            </h2>
                            {isAddingCategory ? (
                                <div className="mt-3 flex flex-col gap-2">
                                    <AutoComplete
                                        options={categoryOptions}
                                        placeholder="Selecciona una categoría"
                                        emptyMessage="No se encontraron categorías"
                                        value={selectedCategory}
                                        onValueChange={(option) =>
                                            setSelectedCategory(option)
                                        }
                                        className="z-50"
                                    />
                                    <div className="mb-4 flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (selectedCategory) {
                                                    addCategory(
                                                        selectedCategory,
                                                    );
                                                    setIsAddingCategory(false);
                                                    setSelectedCategory(
                                                        undefined,
                                                    );
                                                }
                                            }}
                                            className="w-full"
                                        >
                                            Confirmar
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                setIsAddingCategory(false)
                                            }
                                            className="w-full"
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    className="mb-4 w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Agregar
                                    Categoría
                                </Button>
                            )}
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    {budget.categories.map(
                                        (category, index) => (
                                            <AccordionItem
                                                value={`item-${index}`}
                                                key={category.id}
                                            >
                                                <div className="mb-2 flex items-center justify-between gap-4">
                                                    <div className="w-full">
                                                        <AccordionTrigger className="capitalize">
                                                            {category.name}
                                                        </AccordionTrigger>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() =>
                                                            deleteCategory(
                                                                category.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <AccordionContent>
                                                    <Category
                                                        category={category}
                                                        onUpdate={
                                                            updateCategory
                                                        }
                                                    />
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )}
                                </Accordion>
                            </ScrollArea>
                        </div>
                        <div>
                            <h2 className="mb-4 flex items-center text-xl font-semibold">
                                <Percent className="mr-2" /> Porcentajes y
                                Resumen
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="overhead"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Gastos Generales (%)
                                    </label>
                                    <Input
                                        type="number"
                                        id="overhead"
                                        value={budget.overheadPercentage}
                                        onChange={(e) =>
                                            setBudget((prev) => ({
                                                ...prev,
                                                overheadPercentage: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="profit"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Utilidad (%)
                                    </label>
                                    <Input
                                        type="number"
                                        id="profit"
                                        value={budget.profitPercentage}
                                        onChange={(e) =>
                                            setBudget((prev) => ({
                                                ...prev,
                                                profitPercentage: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="tax"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        IGV (%)
                                    </label>
                                    <Input
                                        type="number"
                                        id="tax"
                                        value={budget.taxPercentage}
                                        onChange={(e) =>
                                            setBudget((prev) => ({
                                                ...prev,
                                                taxPercentage: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <Card className="mt-6 bg-gray-100">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-semibold">
                                        <DollarSign className="mr-2" /> Resumen
                                        del Presupuesto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p>
                                            <strong>Costos Directos:</strong>{" "}
                                            S/. {directCosts.toFixed(2)}
                                        </p>
                                        <p>
                                            <strong>Gastos Generales:</strong>{" "}
                                            S/. {overhead.toFixed(2)}
                                        </p>
                                        <p>
                                            <strong>Utilidad:</strong> S/.{" "}
                                            {profit.toFixed(2)}
                                        </p>
                                        <p>
                                            <strong>IGV:</strong> S/.{" "}
                                            {tax.toFixed(2)}
                                        </p>
                                        <p className="mt-2 text-xl font-bold">
                                            Total: S/. {total.toFixed(2)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
