import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import IntegralProject from "@/components/quotation/create-quotation/create-integral-project/IntegralProject";
import { CreateLevelSpace } from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";

export default function CreateQuotationPage() {
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <CreateLevelSpace />
            <IntegralProject />
        </Shell>
    );
}
