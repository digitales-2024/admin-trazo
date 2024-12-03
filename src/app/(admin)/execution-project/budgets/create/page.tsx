import CreateBudget from "@/components/budget/create-budget/CreateBudget";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";

export default function CreatePage() {
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Presupuesto"
                description="Complete todos los campos para crear un presupuesto."
            />
            <CreateBudget />
        </Shell>
    );
}
