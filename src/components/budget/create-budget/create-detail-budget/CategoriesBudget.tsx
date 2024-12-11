import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";

type Props = {
    budget: BudgetSummary;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        maximumFractionDigits: 2,
    }).format(amount);
};

const CategoriesBudget = ({ budget }: Props) => {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });

    if (!budgetData) {
        return <></>;
    }
    return (
        <TabsContent value="categories">
            <Card className="rounded-lg shadow-lg">
                <CardHeader className="border-b border-gray-300 bg-gray-200">
                    <CardTitle className="text-base font-semibold text-gray-800 sm:text-xl">
                        Categorías, Subcategorías y WorkItems
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-4"
                    >
                        {budgetData.category?.map((category) => (
                            <AccordionItem
                                key={category.id}
                                value={category.id}
                                className="rounded-lg bg-white shadow-sm"
                            >
                                <AccordionTrigger className="pl-4 text-start text-sm font-bold capitalize leading-none tracking-tight sm:text-center">
                                    <div className="flex w-full flex-col justify-start sm:flex-row sm:justify-between">
                                        <span>{category.name}</span>
                                        <span className="mr-[2%]">
                                            <span>SubTotal: </span>
                                            <span className="font-bold text-green-500">
                                                {formatCurrency(193660.59)}
                                            </span>
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-gray-50 p-4">
                                    {category.subcategory?.map(
                                        (subcategory) => (
                                            <Accordion
                                                key={subcategory.id}
                                                type="single"
                                                collapsible
                                                className="ml-4 w-full"
                                            >
                                                <AccordionItem
                                                    value={subcategory.id}
                                                    className="mb-2 rounded-lg bg-white shadow-sm"
                                                >
                                                    <AccordionTrigger className="border-b-2 border-gray-300 px-4 py-2 text-start text-xs font-semibold capitalize transition-all hover:bg-gray-100 sm:text-center sm:text-sm">
                                                        <div className="flex w-full flex-col justify-start sm:flex-row sm:justify-between">
                                                            <span>
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </span>
                                                            <span className="mr-[2%]">
                                                                <span>
                                                                    SubTotal:{" "}
                                                                </span>
                                                                <span className="text-red-500">
                                                                    {formatCurrency(
                                                                        3851.01,
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="bg-gray-100 p-4">
                                                        <Table className="mt-4">
                                                            <TableHeader className="bg-gray-200">
                                                                <TableRow>
                                                                    <TableHead className="text-xs sm:text-sm">
                                                                        Descripción
                                                                    </TableHead>
                                                                    <TableHead className="text-xs sm:text-sm">
                                                                        Unidad
                                                                    </TableHead>
                                                                    <TableHead className="text-xs sm:text-sm">
                                                                        Cantidad
                                                                    </TableHead>
                                                                    <TableHead className="text-xs sm:text-sm">
                                                                        Costo
                                                                        Unitario
                                                                    </TableHead>
                                                                    <TableHead className="text-xs sm:text-sm">
                                                                        Subtotal
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {subcategory.workItem?.map(
                                                                    (item) => (
                                                                        <React.Fragment
                                                                            key={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            <TableRow className="border-t border-gray-200">
                                                                                <TableCell className="text-xs sm:text-sm">
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                    {
                                                                                        item.unit
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                    {
                                                                                        item.quantity
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                    {
                                                                                        item.unitCost
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                    {formatCurrency(
                                                                                        item.subtotal,
                                                                                    )}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            {/* SubWorkItems */}
                                                                            {Array.isArray(
                                                                                item.subWorkItems,
                                                                            ) &&
                                                                                item
                                                                                    .subWorkItems
                                                                                    .length >
                                                                                    0 && (
                                                                                    <TableRow className="border-t border-gray-200">
                                                                                        <TableCell
                                                                                            colSpan={
                                                                                                5
                                                                                            }
                                                                                            className="p-2"
                                                                                        >
                                                                                            <Table className="ml-4 bg-gray-50">
                                                                                                <TableHeader>
                                                                                                    <TableRow>
                                                                                                        <TableHead className="text-xs sm:text-sm">
                                                                                                            Sub-WorkItem
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs sm:text-sm">
                                                                                                            Unidad
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs sm:text-sm">
                                                                                                            Cantidad
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs sm:text-sm">
                                                                                                            Costo
                                                                                                            Unitario
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs sm:text-sm">
                                                                                                            Subtotal
                                                                                                        </TableHead>
                                                                                                    </TableRow>
                                                                                                </TableHeader>
                                                                                                <TableBody>
                                                                                                    {(
                                                                                                        item.subWorkItems ||
                                                                                                        []
                                                                                                    )?.map(
                                                                                                        (
                                                                                                            subItem,
                                                                                                        ) => (
                                                                                                            <TableRow
                                                                                                                key={
                                                                                                                    subItem.id
                                                                                                                }
                                                                                                                className="border-t border-gray-200"
                                                                                                            >
                                                                                                                <TableCell className="text-xs sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.name
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.unit
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.quantity
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.unitCost
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs sm:text-sm">
                                                                                                                    {formatCurrency(
                                                                                                                        subItem.subtotal,
                                                                                                                    )}
                                                                                                                </TableCell>
                                                                                                            </TableRow>
                                                                                                        ),
                                                                                                    )}
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )}
                                                                        </React.Fragment>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                        {/* Mostrar subWorkItems si existen */}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ),
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default CategoriesBudget;
