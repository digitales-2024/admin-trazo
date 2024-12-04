import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";

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
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        Categorías y Subcategorías
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
                                <AccordionTrigger className="text-lg font-bold capitalize leading-none tracking-tight">
                                    {category.name}
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
                                                    <AccordionTrigger className="text-md border-b-2 border-gray-300 px-4 py-2 font-semibold capitalize transition-all hover:bg-gray-100">
                                                        {subcategory.name}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="bg-gray-100 p-4">
                                                        <Table className="mt-4">
                                                            <TableHeader className="bg-gray-200">
                                                                <TableRow>
                                                                    <TableHead>
                                                                        Descripción
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Unidad
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Cantidad
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Costo
                                                                        Unitario
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Subtotal
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {subcategory.workitem?.map(
                                                                    (item) => (
                                                                        <TableRow
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="border-t border-gray-200"
                                                                        >
                                                                            <TableCell className="">
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="text-center">
                                                                                {
                                                                                    item.unit
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="text-center">
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="text-center">
                                                                                {
                                                                                    item.unitCost
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="text-center">
                                                                                {
                                                                                    item.subtotal
                                                                                }
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
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
