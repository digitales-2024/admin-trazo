"use client";

import { useBudgets } from "@/hooks/use-budget";
import { useSearchParams } from "next/navigation";

import UpdateBudget from "@/components/budget/update-budget/UpdateBudget";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";

export default function UpdateBudgetPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { budgetById } = useBudgets({ id: id ?? "" });
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Actualizar Presupuesto"
                description="Complete todos los campos para actualizar el presupuesto."
                badgeContent={budgetById?.name ?? ""}
            />
            {budgetById && <UpdateBudget budgetById={budgetById} />}
        </Shell>
    );
}
