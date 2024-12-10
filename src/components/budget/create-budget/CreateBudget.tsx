"use client";

import { useBudgets } from "@/hooks/use-budget";
import { createBudgetSchema, CreateBudgetSchema } from "@/schemas";
import { FullCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Form } from "../../ui/form";
import { BudgetCreator } from "./create-detail-budget/BudgetCreator";
import { Budget } from "./create-detail-budget/types";
import { HeadBudget } from "./create-head-budget/HeadBudget";

export default function CreateBudget() {
    const [isClient, setIsClient] = useState(false);
    const { onCreateBudget, isLoadingCreateBudget, isSuccessCreateBudget } =
        useBudgets();
    const router = useRouter();
    const [budget, setBudget] = useState<Budget>({
        categories: [],
        overheadPercentage: 15,
        profitPercentage: 10,
        taxPercentage: 18,
    });

    const handleCreateBudget = () => {
        const formData = form.getValues();

        // Cálculo de costos
        const directCost = budget.categories.reduce(
            (acc: number, category: FullCategory) => {
                const categoryTotal = category.subcategories.reduce(
                    (subAcc: number, subcat) => subAcc + subcat.subtotal,
                    0,
                );
                return acc + categoryTotal;
            },
            0,
        );

        const overhead = directCost * (budget.overheadPercentage / 100);
        const utility = directCost * (budget.profitPercentage / 100);
        const igv = directCost * (budget.taxPercentage / 100);
        const totalCost = directCost + overhead + utility + igv;

        // Construcción del objeto DTO final
        const budgetData = {
            name: formData.name.trim(),
            ubication: formData.ubication.trim(),
            dateProject: formData.dateProject,
            clientId: formData.clientId,
            designProjectId: formData.isExistingDesignProject
                ? formData.designProjectId
                : undefined,

            directCost: directCost,
            overhead: overhead,
            utility: utility,
            igv: igv,
            percentageOverhead: budget.overheadPercentage,
            percentageUtility: budget.profitPercentage,
            totalCost: totalCost,

            category: budget.categories.map((cat: FullCategory) => ({
                categoryId: cat.id,
                subtotal: cat.subcategories.reduce(
                    (subAcc: number, subcat) => subAcc + subcat.subtotal,
                    0,
                ),
                subcategory: cat.subcategories.map((sub) => ({
                    subcategoryId: sub.id,
                    subtotal: sub.subtotal,
                    workItem: sub.workItems.map((wi) => ({
                        quantity: wi.quantity,
                        unitCost: wi.unitCost,
                        subtotal: wi.subtotal,
                        workItemId: wi.id,
                        apuBugdetId: wi.apuId,
                        subWorkItem:
                            wi.subWorkItems && wi.subWorkItems.length > 0
                                ? wi.subWorkItems.map((swi) => ({
                                      quantity: swi.quantity!,
                                      unitCost: swi.unitCost!,
                                      subtotal: swi.subtotal,
                                      subWorkItemId: swi.id,
                                      apuBugdetId: swi.apuId,
                                  }))
                                : undefined,
                    })),
                })),
            })),
        };
        onCreateBudget(budgetData);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBack = () => {
        if (isClient) {
            router.push("/execution-project/budgets");
        }
    };

    useEffect(() => {
        if (isSuccessCreateBudget && isClient) {
            router.push("/execution-project/budgets");
        }
    }, [isSuccessCreateBudget, isClient, router]);

    const form = useForm<CreateBudgetSchema>({
        resolver: zodResolver(createBudgetSchema),
        defaultValues: {
            name: "",
            ubication: "",
            clientId: "",
            dateProject: "",
            isExistingDesignProject: false,
            designProjectId: "",
        },
    });

    const onSubmit = () => {};

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 p-1"
                >
                    <HeadBudget form={form} />
                    <BudgetCreator budget={budget} setBudget={setBudget} />

                    <Separator className="my-4" />

                    <div className="flex flex-row-reverse gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={isLoadingCreateBudget}
                            onClick={form.handleSubmit(handleCreateBudget)}
                        >
                            {isLoadingCreateBudget && (
                                <RefreshCcw
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Crear
                        </Button>
                        <Button
                            type="button"
                            variant={"destructive"}
                            onClick={handleBack}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
