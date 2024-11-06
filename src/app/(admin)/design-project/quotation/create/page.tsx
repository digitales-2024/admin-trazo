"use client";
import { createQuotationSchema } from "@/schemas/quotations/createQuotationSchema";
import {
    Floor,
    HeadQuotation as HeadQuotationType,
    Costs,
    IntegralProjectItem,
    QuotationStructure,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { HeadQuotation } from "@/components/quotation/create-quotation/create-head-quotation/HeadQuotation";
import IntegralProject from "@/components/quotation/create-quotation/create-integral-project/IntegralProject";
import {
    CreateLevelSpace,
    extractData,
} from "@/components/quotation/create-quotation/create-level-space/LevelSpaceCreate";
import CreateQuotationButton from "@/components/quotation/CreateQuotationButton";
import { Form } from "@/components/ui/form";

export default function CreateQuotationPage() {
    const [floors, setFloors] = useState<Floor[]>([
        { number: 1, name: "Nivel 1", spaces: [], expanded: true },
    ]);

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
            name: form.getValues("name"),
            description: form.getValues("description"),
            deliveryTime: form.getValues("deliveryTime"),
            landArea: form.getValues("landArea"),
            idClient: form.getValues("clientId"),
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

    const form = useForm<QuotationStructure>({
        resolver: zodResolver(createQuotationSchema),
        defaultValues: {
            name: "",
            description: "",
            clientId: "",
            deliveryTime: 1,
            landArea: 1,
            code: "",
            discount: 0,
            exchangeRate: 3.5,
            paymentSchedule: [],
            architecturalCost: 0,
            structuralCost: 0,
            electricCost: 0,
            sanitaryCost: 0,
        },
    });

    const onSubmit = () => {};

    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 p-1"
                >
                    <HeadQuotation form={form} />
                    <CreateLevelSpace
                        floors={floors}
                        setFloors={setFloors}
                        calculateTotalBuildingMeters={
                            calculateTotalBuildingMeters
                        }
                        form={form}
                    />
                    <IntegralProject
                        area={calculateTotalBuildingMeters()}
                        costs={costs}
                        setCosts={setCosts}
                        discount={discount}
                        setDiscount={setDiscount}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                        form={form}
                    />
                </form>
            </Form>
            <CreateQuotationButton
                extractData={() => extractData(floors)}
                obtenerHeadQuotation={obtenerHeadQuotation}
                getAllDataIntegralProject={getAllDataIntegralProject}
                form={form}
            />
        </Shell>
    );
}
