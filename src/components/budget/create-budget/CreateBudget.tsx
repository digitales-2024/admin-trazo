"use client";

import { createBudgetSchema, CreateBudgetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
/* import { RefreshCcw } from "lucide-react"; */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Form } from "../../ui/form";
import BudgetCreator from "./create-detail-budget/BudgetCreator";
import { HeadBudget } from "./create-head-budget/HeadBudget";

export default function CreateBudget() {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBack = () => {
        if (isClient) {
            router.push("/execution-project/budgets");
        }
    };

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
                    <BudgetCreator />

                    <Separator className="my-4" />

                    <div className="flex flex-row-reverse gap-2 pt-2">
                        <Button
                            type="submit"
                            /* disabled={isLoadingUpdateQuotation} */
                        >
                            {/*                             {isLoadingUpdateQuotation && (
                                <RefreshCcw
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )} */}
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
