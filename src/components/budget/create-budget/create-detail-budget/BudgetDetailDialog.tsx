"use client";

import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";
import { DialogDescription } from "@radix-ui/react-dialog";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BudgetDetailsDialog from "./BudgetDetailsDialog";
import CategoriesBudget from "./CategoriesBudget";
import GeneralInformationDialog from "./GeneralInformationDialog";

interface Props {
    open: boolean;
    onClose: (open: boolean) => void;
    budget: BudgetSummary;
}

export function BudgetDetailDialog({ budget, open, onClose }: Props) {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });

    if (!budgetData) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6 sm:max-w-2xl sm:px-4 md:max-w-3xl md:px-6 lg:max-w-4xl lg:px-8"
                aria-describedby="dialog-budget-description"
            >
                <DialogHeader>
                    <DialogTitle>
                        Detalles del Presupuesto: {budgetData.name}
                    </DialogTitle>
                    <DialogDescription>
                        dialog-budget-description
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList>
                        <TabsTrigger value="general">
                            Información General
                        </TabsTrigger>
                        <TabsTrigger value="details">
                            Detalles del Presupuesto
                        </TabsTrigger>
                        <TabsTrigger value="categories">Categorías</TabsTrigger>
                    </TabsList>

                    {/* Información General */}
                    <GeneralInformationDialog budget={budget} />

                    {/* Detalles del Presupuesto */}
                    <BudgetDetailsDialog budget={budget} />

                    {/* Categorías y Subcategorías */}
                    <CategoriesBudget budget={budget} />
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
