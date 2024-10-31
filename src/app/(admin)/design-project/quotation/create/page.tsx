"use client";
import { Floor } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import HeadQuotation from "@/components/quotation/create-quotation/create-head-quotation/HeadQuotation";
import IntegralProject from "@/components/quotation/create-quotation/create-integral-project/IntegralProject";
import { CreateLevelSpace } from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import { Button } from "@/components/ui/button";

export default function CreateQuotationPage() {
    const [floors, setFloors] = useState<Floor[]>([
        { number: 1, name: "Nivel 1", spaces: [], expanded: true },
    ]);

    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const calculateTotalBuildingMeters = () => {
        return floors.reduce(
            (total, floor) =>
                total +
                floor.spaces.reduce((sum, space) => sum + space.meters, 0),
            0,
        );
    };

    const handleBack = () => {
        if (isClient) {
            router.push("/design-project/quotation");
        }
    };

    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <HeadQuotation />
            <CreateLevelSpace
                floors={floors}
                setFloors={setFloors}
                calculateTotalBuildingMeters={calculateTotalBuildingMeters}
            />
            <IntegralProject area={calculateTotalBuildingMeters()} />
            <div className="flex justify-end gap-4">
                <Button variant={"destructive"} onClick={handleBack}>
                    Cancelar
                </Button>
                <Button variant={"normal"}>Crear Cotización</Button>
            </div>
        </Shell>
    );
}
