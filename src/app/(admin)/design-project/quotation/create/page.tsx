"use client";
import { Floor } from "@/types";
import React, { useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import IntegralProject from "@/components/quotation/create-quotation/create-integral-project/IntegralProject";
import { CreateLevelSpace } from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import { Button } from "@/components/ui/button";

export default function CreateQuotationPage() {
    const [floors, setFloors] = useState<Floor[]>([
        { number: 1, name: "Nivel 1", spaces: [], expanded: true },
    ]);

    const calculateTotalBuildingMeters = () => {
        return floors.reduce(
            (total, floor) =>
                total +
                floor.spaces.reduce((sum, space) => sum + space.meters, 0),
            0,
        );
    };

    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <CreateLevelSpace
                floors={floors}
                setFloors={setFloors}
                calculateTotalBuildingMeters={calculateTotalBuildingMeters}
            />
            <IntegralProject area={calculateTotalBuildingMeters()} />
            <Button>Crear Cotización</Button>
        </Shell>
    );
}
