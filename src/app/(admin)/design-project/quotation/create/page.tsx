import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { CreateLevelSpace } from "@/components/quotation/create-quotation/LevelSpaceCreate";

export default function CreateQuotationPage() {
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <CreateLevelSpace />
        </Shell>
    );
}
