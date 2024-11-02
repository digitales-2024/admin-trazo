// page.tsx

"use client";
import {
    Floor,
    HeadQuotation as HeadQuotationType,
    Costs,
    IntegralProjectItem,
} from "@/types";
import React, { useState, useEffect } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import HeadQuotation from "@/components/quotation/create-quotation/create-head-quotation/HeadQuotation";
import IntegralProject from "@/components/quotation/create-quotation/create-integral-project/IntegralProject";
import {
    CreateLevelSpace,
    extractData,
} from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import CreateQuotationButton from "@/components/quotation/CreateQuotationButton";

export default function CreateQuotationPage() {
    const [floors, setFloors] = useState<Floor[]>([
        { number: 1, name: "Nivel 1", spaces: [], expanded: true },
    ]);

    // Estados para HeadQuotation
    const [meses, setMeses] = useState<number>(1);
    const [selectedClient, setSelectedClient] = useState<string>("");
    const [projectName, setProjectName] = useState<string>("");
    const [landArea, setLandArea] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    // Estados para IntegralProject
    const [costs, setCosts] = useState<Costs>({
        architecturalCost: 0,
        structuralCost: 0,
        electricCost: 0,
        sanitaryCost: 0,
    });
    const [discount, setDiscount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(3.5);
    const [totalCost, setTotalCost] = useState(0);

    const projectNames: { [key in keyof Costs]: string } = {
        architecturalCost: "Proyecto Arquitectónico",
        structuralCost: "Proyecto Estructural",
        electricCost: "Proyecto de Instalaciones Eléctricas",
        sanitaryCost: "Proyecto de Instalaciones Sanitarias",
    };

    const projects: { [key: string]: IntegralProjectItem[] } = {
        "Proyecto Arquitectónico": [
            {
                description: "Plano de Ubicación y Localización",
                unit: "escala 1/1000",
            },
            { description: "Plano de Diferentes Niveles", unit: "escala 1/50" },
            { description: "Plano de Elevaciones", unit: "escala 1/50" },
            { description: "Plano de Cortes", unit: "escala 1/50" },
            { description: "Memoria Descriptiva", unit: "" },
        ],
        "Proyecto Estructural": [
            { description: "Plano de Cimentación", unit: "escala 1/50" },
            {
                description: "Plano de Detalles Constructivos",
                unit: "escala 1/50",
            },
            {
                description: "Plano de Aligerado de Niveles",
                unit: "escala 1/50",
            },
            { description: "Memoria Descriptiva", unit: "" },
        ],
        "Proyecto de Instalaciones Eléctricas": [
            { description: "Planos de Tendido Eléctrico", unit: "escala 1/50" },
            { description: "Cálculo Eléctrico", unit: "" },
            { description: "Memoria Justificativa", unit: "" },
        ],
        "Proyecto de Instalaciones Sanitarias": [
            { description: "Planos de Tendido Sanitario", unit: "escala 1/50" },
            { description: "Planos de Agua y Desagüe", unit: "escala 1/50" },
            { description: "Memoria Justificativa", unit: "" },
        ],
    };

    const calculateTotalBuildingMeters = React.useCallback(() => {
        return floors.reduce(
            (total, floor) =>
                total +
                floor.spaces.reduce((sum, space) => sum + space.meters, 0),
            0,
        );
    }, [floors]);

    // Calcular totalCost y subtotal en base a area
    useEffect(() => {
        const totalWithDiscount = discount * exchangeRate;
        setTotalCost(totalWithDiscount);
    }, [costs, discount, exchangeRate, floors, calculateTotalBuildingMeters]);

    const obtenerHeadQuotation = (): HeadQuotationType => {
        return {
            name: projectName,
            description,
            deliveryTime: meses,
            landArea,
            idClient: selectedClient,
        };
    };

    const getAllDataIntegralProject = () => {
        const area = calculateTotalBuildingMeters();
        return {
            exchangeRate,
            discount,
            totalCost,
            area,
            projects: Object.entries(projects).map(
                ([nombreProyecto, items]) => ({
                    nombreProyecto,
                    items,
                    area,
                    cost: costs[
                        Object.keys(projectNames).find(
                            (key) =>
                                projectNames[key as keyof Costs] ===
                                nombreProyecto,
                        ) as keyof Costs
                    ],
                }),
            ),
        };
    };

    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <HeadQuotation
                meses={meses}
                setMeses={setMeses}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                projectName={projectName}
                setProjectName={setProjectName}
                landArea={landArea}
                setLandArea={setLandArea}
                description={description}
                setDescription={setDescription}
            />
            <CreateLevelSpace
                floors={floors}
                setFloors={setFloors}
                calculateTotalBuildingMeters={calculateTotalBuildingMeters}
            />
            <IntegralProject
                area={calculateTotalBuildingMeters()}
                costs={costs}
                setCosts={setCosts}
                discount={discount}
                setDiscount={setDiscount}
                exchangeRate={exchangeRate}
                setExchangeRate={setExchangeRate}
            />
            <CreateQuotationButton
                extractData={() => extractData(floors)}
                obtenerHeadQuotation={obtenerHeadQuotation}
                getAllDataIntegralProject={getAllDataIntegralProject}
            />
        </Shell>
    );
}
