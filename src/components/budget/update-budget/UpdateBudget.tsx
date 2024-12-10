"use client";

import { useBudgets } from "@/hooks/use-budget";
import { createBudgetSchema, CreateBudgetSchema } from "@/schemas";
import { Budget } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// Importa el Form desde tu ui/form
import { HeadBudget } from "../create-budget/create-head-budget/HeadBudget";

interface UpdateBudgetProps {
    budgetById: Budget;
}

export default function UpdateBudget({ budgetById }: UpdateBudgetProps) {
    const { isSuccessUpdateBudget, isLoadingUpdateBudget } = useBudgets();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isSuccessUpdateBudget && isClient) {
            router.push("/design-project/quotation");
        }
    }, [isSuccessUpdateBudget, isClient, router]);

    const handleBack = () => {
        if (isClient) {
            router.push("/design-project/quotation");
        }
    };

    const form = useForm<CreateBudgetSchema>({
        resolver: zodResolver(createBudgetSchema),
        defaultValues: {
            name: budgetById.name,
            ubication: budgetById.ubication,
            clientId: budgetById.clientBudget.id,
            dateProject: budgetById.dateProject,
            isExistingDesignProject: !!budgetById.designProjectBudget?.id,
            designProjectId: budgetById.designProjectBudget?.id,
        },
    });

    const onSubmit = (data: CreateBudgetSchema) => {
        console.log("Submitting", data);
    };

    return (
        // Aquí Form actúa como FormProvider
        <Form {...form}>
            {/* Ahora el formulario HTML y tus campos están dentro de FormProvider */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <HeadBudget form={form} />

                <Separator className="my-4" />

                <div className="flex flex-row-reverse gap-2 pt-2">
                    <Button type="submit" disabled={isLoadingUpdateBudget}>
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
