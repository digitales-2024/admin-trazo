"use client";

import { Costs, IntegralProjectItem, QuotationStructure } from "@/types";
import { ChevronDown, ChevronUp, PencilRuler } from "lucide-react";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import CostSummary from "./CostSummary";
import IntegralProjectTable from "./IntegralProjectTable";

interface IntegralProjectProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    area: number;
    costs: Costs;
    setCosts: React.Dispatch<React.SetStateAction<Costs>>;
    discount: number;
    setDiscount: React.Dispatch<React.SetStateAction<number>>;
    exchangeRate: number;
    setExchangeRate: React.Dispatch<React.SetStateAction<number>>;
    form: UseFormReturn<QuotationStructure>;
}

const projectNames: { [key in keyof Costs]: string } = {
    architecturalCost: "Proyecto Arquitectónico",
    structuralCost: "Proyecto Estructural",
    electricCost: "Proyecto de Instalaciones Eléctricas",
    sanitaryCost: "Proyecto de Instalaciones Sanitarias",
};

export default function IntegralProject({
    area,
    costs,
    discount,
    setDiscount,
    exchangeRate,
    setExchangeRate,
    setCosts,
    form,
}: IntegralProjectProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const subtotal =
        Object.values(costs).reduce((sum, cost) => sum + cost, 0) * area;
    const totalCost = discount * exchangeRate;

    const handleCostChange = (project: keyof Costs, value: number) => {
        setCosts((prev) => ({
            ...prev,
            [project]: value || 0,
        }));
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

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="">
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <PencilRuler size={28} strokeWidth={1.5} />
                                    <span className="text-xl font-bold text-gray-900">
                                        Proyecto Integral de la Cotización
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                {isOpen && (
                    <CardContent>
                        <CollapsibleContent>
                            <div className="mx-auto max-w-4xl space-y-6 p-6">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    {Object.entries(projects).map(
                                        ([key, items]) => (
                                            <AccordionItem
                                                key={key}
                                                value={key}
                                            >
                                                <AccordionTrigger>
                                                    {key}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <Card>
                                                        <CardContent className="pt-6">
                                                            <IntegralProjectTable
                                                                items={items}
                                                                project={
                                                                    Object.keys(
                                                                        projectNames,
                                                                    ).find(
                                                                        (k) =>
                                                                            projectNames[
                                                                                k as keyof Costs
                                                                            ] ===
                                                                            key,
                                                                    ) as keyof Costs
                                                                }
                                                                area={area}
                                                                form={form}
                                                                costs={costs}
                                                                handleCostChange={
                                                                    handleCostChange
                                                                }
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )}
                                </Accordion>
                                <CostSummary
                                    costs={costs}
                                    discount={discount}
                                    exchangeRate={exchangeRate}
                                    subtotal={subtotal}
                                    totalCost={totalCost}
                                    setDiscount={setDiscount}
                                    setExchangeRate={setExchangeRate}
                                />
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
}
