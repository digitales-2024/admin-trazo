import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";
import { FileText, Layers, List, Package } from "lucide-react";
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
            <Card className="rounded-lg">
                <CardHeader className="border-gray-300 bg-zinc-50">
                    <CardTitle className="text-base font-semibold text-gray-800 sm:text-xl">
                        Estructura del Presupuesto
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
                                className="rounded-lg bg-white"
                            >
                                <AccordionTrigger className="pl-4 text-start text-sm font-light capitalize leading-none tracking-tight sm:text-center">
                                    <div className="flex w-full flex-col justify-start gap-2 sm:flex-row sm:justify-between sm:gap-0">
                                        <div className="flex flex-row gap-2">
                                            <Package
                                                className="h-4 w-4 flex-shrink-0 text-blue-500"
                                                strokeWidth={1.5}
                                            />
                                            <span>{category.name}</span>
                                        </div>
                                        <span className="mr-[2%]">
                                            <span className="font-light text-green-500">
                                                {formatCurrency(
                                                    category.subtotal,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    {category.subcategory?.map(
                                        (subcategory) => (
                                            <Accordion
                                                key={subcategory.id}
                                                type="single"
                                                className="ml-4 w-full"
                                            >
                                                <AccordionItem
                                                    value={subcategory.id}
                                                    className="mb-2 rounded-lg bg-white"
                                                >
                                                    <AccordionTrigger className="px-4 py-2 text-start text-sm font-light capitalize sm:text-center">
                                                        <div className="flex w-full flex-col justify-start gap-2 sm:flex-row sm:justify-between sm:gap-0">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <Layers
                                                                    className="h-4 w-4 flex-shrink-0 text-green-500"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                />
                                                                <span>
                                                                    {
                                                                        subcategory.name
                                                                    }
                                                                </span>
                                                            </div>

                                                            <span className="mr-[2%]">
                                                                <span className="font-light text-red-500">
                                                                    {formatCurrency(
                                                                        subcategory.subtotal,
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="p-4">
                                                        <Table className="mt-4">
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="text-xs font-light sm:text-sm">
                                                                        Descripción
                                                                    </TableHead>
                                                                    <TableHead className="text-xs font-light sm:text-sm">
                                                                        Unidad
                                                                    </TableHead>
                                                                    <TableHead className="text-xs font-light sm:text-sm">
                                                                        Cantidad
                                                                    </TableHead>
                                                                    <TableHead className="text-xs font-light sm:text-sm">
                                                                        Costo
                                                                        Unitario
                                                                    </TableHead>
                                                                    <TableHead className="text-xs font-light sm:text-sm">
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
                                                                            {Array.isArray(
                                                                                item.subWorkItems,
                                                                            ) &&
                                                                            item
                                                                                .subWorkItems
                                                                                .length >
                                                                                0 ? (
                                                                                <TableRow className="border-t">
                                                                                    <TableCell className="text-xs font-light sm:text-sm">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <FileText
                                                                                                className="h-4 w-4 flex-shrink-0 text-yellow-500"
                                                                                                strokeWidth={
                                                                                                    1.5
                                                                                                }
                                                                                            />
                                                                                            <span className="ml-2">
                                                                                                {
                                                                                                    item.name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center text-xs sm:text-sm"></TableCell>
                                                                                    <TableCell className="text-center text-xs sm:text-sm"></TableCell>
                                                                                    <TableCell className="text-center text-xs sm:text-sm"></TableCell>
                                                                                    <TableCell className="text-center text-xs font-light text-blue-500 sm:text-sm">
                                                                                        {formatCurrency(
                                                                                            item.subtotal,
                                                                                        )}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ) : (
                                                                                <TableRow className="border-t border-gray-200">
                                                                                    <TableCell className="text-xs font-light sm:text-sm">
                                                                                        <div className="flex items-center">
                                                                                            <FileText
                                                                                                className="h-4 w-4 flex-shrink-0 text-yellow-500"
                                                                                                strokeWidth={
                                                                                                    1.5
                                                                                                }
                                                                                            />
                                                                                            <span className="ml-2">
                                                                                                {
                                                                                                    item.name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center text-xs font-light sm:text-sm">
                                                                                        {
                                                                                            item.unit
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center text-xs font-light sm:text-sm">
                                                                                        {
                                                                                            item.quantity
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center text-xs font-light sm:text-sm">
                                                                                        {
                                                                                            item.unitCost
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center text-sm font-light">
                                                                                        {formatCurrency(
                                                                                            item.subtotal,
                                                                                        )}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )}
                                                                            {/* SubWorkItems */}
                                                                            {Array.isArray(
                                                                                item.subWorkItems,
                                                                            ) &&
                                                                                item
                                                                                    .subWorkItems
                                                                                    .length >
                                                                                    0 && (
                                                                                    <TableRow className="border-t">
                                                                                        <TableCell
                                                                                            colSpan={
                                                                                                5
                                                                                            }
                                                                                            className="p-2"
                                                                                        >
                                                                                            <Table className="ml-4">
                                                                                                <TableHeader>
                                                                                                    <TableRow>
                                                                                                        <TableHead className="text-xs font-light sm:text-sm">
                                                                                                            Subpartida
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs font-light sm:text-sm">
                                                                                                            Unidad
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs font-light sm:text-sm">
                                                                                                            Cantidad
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs font-light sm:text-sm">
                                                                                                            Costo
                                                                                                            Unitario
                                                                                                        </TableHead>
                                                                                                        <TableHead className="text-xs font-light sm:text-sm">
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
                                                                                                            >
                                                                                                                <TableCell className="text-xs font-light sm:text-sm">
                                                                                                                    <div className="flex items-center">
                                                                                                                        <List
                                                                                                                            className="h-4 w-4 flex-shrink-0 text-red-500"
                                                                                                                            strokeWidth={
                                                                                                                                1.5
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <span className="ml-2">
                                                                                                                            {
                                                                                                                                subItem.name
                                                                                                                            }
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                </TableCell>

                                                                                                                <TableCell className="text-center text-xs font-light sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.unit
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs font-light sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.quantity
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs font-light sm:text-sm">
                                                                                                                    {
                                                                                                                        subItem.unitCost
                                                                                                                    }
                                                                                                                </TableCell>
                                                                                                                <TableCell className="text-center text-xs font-light sm:text-sm">
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
