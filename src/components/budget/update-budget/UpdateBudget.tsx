"use client";

import { useBudgets } from "@/hooks/use-budget";
import { createBudgetSchema, CreateBudgetSchema } from "@/schemas";
import {
    Budget,
    BudgetCategories,
    CategoryBudget,
    FullCategory,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { BudgetCreator } from "../create-budget/create-detail-budget/BudgetCreator";
import { HeadBudget } from "../create-budget/create-head-budget/HeadBudget";

interface UpdateBudgetProps {
    budgetById: Budget;
}

export default function UpdateBudget({ budgetById }: UpdateBudgetProps) {
    const { onUpdateBudget, isSuccessUpdateBudget, isLoadingUpdateBudget } =
        useBudgets();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    const form = useForm<CreateBudgetSchema>({
        resolver: zodResolver(createBudgetSchema),
        defaultValues: {
            name: "",
            ubication: "",
            clientId: "",
            dateProject: "",
        },
    });

    const [budget, setBudget] = useState<BudgetCategories>({
        categories: budgetById.category.map((cat: CategoryBudget) => ({
            id: cat.id,
            name: cat.name,
            subtotal: cat.subcategory.reduce(
                (total, sub) =>
                    total +
                    (sub.workItem?.reduce(
                        (subTotal, workItem) =>
                            subTotal +
                            (Array.isArray(workItem.subWorkItems) &&
                            workItem.subWorkItems.length > 0
                                ? workItem.subWorkItems.reduce(
                                      (swTotal, sw) => swTotal + sw.subtotal,
                                      0,
                                  )
                                : workItem.subtotal),
                        0,
                    ) ?? 0),
                0,
            ),
            type: "category",
            isActive: true,
            subcategories: cat.subcategory.map((sub) => ({
                id: sub.id,
                name: sub.name,
                subtotal:
                    sub.workItem?.reduce(
                        (subTotal, workItem) =>
                            subTotal +
                            (Array.isArray(workItem.subWorkItems) &&
                            workItem.subWorkItems.length > 0
                                ? workItem.subWorkItems.reduce(
                                      (swTotal, sw) => swTotal + sw.subtotal,
                                      0,
                                  )
                                : workItem.subtotal),
                        0,
                    ) ?? 0,
                type: "subcategory",
                isActive: true,
                workItems: Array.isArray(sub.workItem)
                    ? sub.workItem.map((workItem) => ({
                          id: workItem.id,
                          name: workItem.name,
                          unit: workItem.unit,
                          unitCost: workItem.unitCost,
                          apuId: workItem.apuId,
                          quantity: workItem.quantity,
                          sub: false,
                          subtotal:
                              Array.isArray(workItem.subWorkItems) &&
                              workItem.subWorkItems.length > 0
                                  ? workItem.subWorkItems.reduce(
                                        (swTotal, sw) => swTotal + sw.subtotal,
                                        0,
                                    )
                                  : workItem.subtotal,
                          type: "workItem",
                          isActive: true,
                          subWorkItems: Array.isArray(workItem.subWorkItems)
                              ? workItem.subWorkItems.map((sw) => ({
                                    id: sw.id,
                                    name: sw.name,
                                    unit: sw.unit,
                                    quantity: sw.quantity,
                                    unitCost: sw.unitCost,
                                    apuId: sw.apuId,
                                    subtotal: sw.subtotal,
                                    type: "subWorkItem",
                                    isActive: true,
                                }))
                              : [],
                      }))
                    : [],
            })),
        })),
        overheadPercentage:
            budgetById.budgetDetail?.[0]?.percentageOverhead ?? 0,
        profitPercentage: budgetById.budgetDetail?.[0]?.percentageUtility ?? 10,
        taxPercentage: budgetById.budgetDetail?.[0]?.igv ?? 18,
        commercialDiscount: budgetById.budgetDetail?.[0]?.discount ?? 0,
        applyTax: budgetById.budgetDetail?.[0]?.igv !== 0,
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isSuccessUpdateBudget && isClient) {
            router.push("/execution-project/budgets");
        }
    }, [isSuccessUpdateBudget, isClient, router]);

    const handleBack = () => {
        if (isClient) {
            router.push("/execution-project/budgets");
        }
    };

    useEffect(() => {
        if (budgetById) {
            form.reset({
                name: budgetById.name || "",
                ubication: budgetById.ubication || "",
                clientId: budgetById.clientBudget?.id || "",
                dateProject: budgetById.dateProject || "",
                ...(budgetById.designProjectBudget && {
                    isExistingDesignProject: true,
                    designProjectId: budgetById.designProjectBudget.id,
                }),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgetById]);

    const handleUpdateBudget = () => {
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
            igv: budget.taxPercentage,
            discount: budget.commercialDiscount,
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
        onUpdateBudget({
            ...budgetData,
            id: budgetById?.id ?? "",
        });
    };

    const onSubmit = () => {};

    return (
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
                        disabled={isLoadingUpdateBudget}
                        onClick={form.handleSubmit(handleUpdateBudget)}
                    >
                        {isLoadingUpdateBudget && (
                            <RefreshCcw
                                className="mr-2 h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Actualizar
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
    );
}
