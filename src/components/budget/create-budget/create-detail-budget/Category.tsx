import { useCategory } from "@/hooks/use-category";
import { Trash2, Plus, Folder } from "lucide-react";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Subcategory } from "./Subcategory";
import { CategoryType, SubcategoryType } from "./types";

interface CategoryProps {
    category: CategoryType;
    onDelete: (id: string) => void;
    onUpdate: (category: CategoryType) => void;
}

export const Category: React.FC<CategoryProps> = ({
    category,
    onDelete,
    onUpdate,
}) => {
    const { dataCategoryAll } = useCategory();

    // Obtener opciones de las categorias
    const categoryOptions: Option[] = (dataCategoryAll ?? []).map(
        (category) => ({
            value: category.id.toString(),
            label: category.name,
        }),
    );

    const addSubcategory = () => {
        const newSubcategory: SubcategoryType = {
            id: "",
            name: "Nueva Subcategoría",
            items: [],
        };
        onUpdate({
            ...category,
            subcategories: [...category.subcategories, newSubcategory],
        });
    };

    const deleteSubcategory = (subcategoryId: string) => {
        onUpdate({
            ...category,
            subcategories: category.subcategories.filter(
                (sub) => sub.id !== subcategoryId,
            ),
        });
    };

    const updateSubcategory = (updatedSubcategory: SubcategoryType) => {
        onUpdate({
            ...category,
            subcategories: category.subcategories.map((sub) =>
                sub.id === updatedSubcategory.id ? updatedSubcategory : sub,
            ),
        });
    };

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="w-full">
                        <FormField
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <AutoComplete
                                            options={categoryOptions}
                                            placeholder="Selecciona una categoría"
                                            emptyMessage="No se encontraron categorias"
                                            value={
                                                categoryOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                ) || undefined
                                            }
                                            onValueChange={(option) => {
                                                if (option) {
                                                    onUpdate({
                                                        ...category,
                                                        id: option.value,
                                                        name: option.label,
                                                    });
                                                }
                                            }}
                                            className="z-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(category.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {category.subcategories.map((subcategory, index) => (
                        <AccordionItem
                            value={`item-${index}`}
                            key={subcategory.id}
                        >
                            <AccordionTrigger className="text-sm">
                                <Folder className="mr-2 h-4 w-4" />
                                {subcategory.name}
                            </AccordionTrigger>
                            <AccordionContent>
                                <Subcategory
                                    subcategory={subcategory}
                                    onDelete={deleteSubcategory}
                                    onUpdate={updateSubcategory}
                                    idCategory={category.id}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <Button
                    onClick={addSubcategory}
                    className="mt-2 w-full"
                    type="button"
                >
                    <Plus className="mr-2 h-4 w-4" /> Agregar Subcategoría
                </Button>
            </CardContent>
        </Card>
    );
};
