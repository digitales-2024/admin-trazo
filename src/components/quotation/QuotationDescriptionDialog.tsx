import { useQuotations } from "@/hooks/use-quotation";
import { QuotationSummary } from "@/types";
import { Home, DollarSign, Layout, Calendar } from "lucide-react";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { DesignSummary } from "./QuotationDescriptionDialog copy";

interface SubproyectoCardProps {
    titulo: string;
    area: number;
    cost: number;
    items: { description: string; unit: string }[];
}

const SubproyectoCard = ({
    titulo,
    area,
    cost,
    items,
}: SubproyectoCardProps) => {
    if (cost === 0) {
        return null;
    }

    return (
        <Card className="mb-4 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">{titulo}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    <strong>Área:</strong> {area} m²
                </p>
                <p>
                    <strong>Costo:</strong> S/.{" "}
                    {cost?.toLocaleString() ?? "N/A"}
                </p>
                <ul className="mt-3 list-inside list-disc">
                    {items?.map((item, index) => (
                        <li key={index} className="mb-1">
                            {item.description}: {item.unit}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

interface FasePagoCardProps {
    name: string;
    percentage: number;
    cost: number;
    description: string;
}

const FasePagoCard = ({
    name,
    percentage,
    cost,
    description,
}: FasePagoCardProps) => (
    <Card className="mb-4 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">{name}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="mb-2 flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold">
                    {percentage}%
                </div>
                <p className="text-2xl">
                    S/.{" "}
                    <span className="font-semibold">
                        {cost?.toLocaleString() ?? "N/A"}
                    </span>
                </p>
            </div>
            <p className="mt-2 text-sm">{description}</p>
        </CardContent>
    </Card>
);

interface QuotationDescriptionDialogProps {
    quotation: QuotationSummary;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function QuotationDescriptionDialog({
    quotation,
    open,
    onOpenChange,
}: QuotationDescriptionDialogProps) {
    const { quotationById } = useQuotations({ id: quotation.id });

    console.log(JSON.stringify(quotationById?.levels));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-5xl p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="flex flex-col items-start">
                        Detalles de la Cotización
                    </DialogTitle>
                    <DialogDescription>
                        Información detallada de la cotización.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[80vh] gap-4 p-4">
                    <Accordion type="multiple" className="mb-6">
                        <AccordionItem value="info-general">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Home className="mr-2 h-6 w-6" />
                                    Información General
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-2">
                                    <strong>Cliente:</strong>{" "}
                                    {quotationById?.client.name}
                                </p>
                                <p className="mb-2">
                                    <strong>Descripción:</strong>{" "}
                                    {quotationById?.description}
                                </p>
                                <p>
                                    <strong>Estado:</strong>{" "}
                                    {quotationById?.status}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="costos-presupuestos">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-6 w-6" />
                                    Costos y Presupuestos
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="mb-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p>
                                            <strong>
                                                Costo Arquitectónico:
                                            </strong>{" "}
                                            $.{" "}
                                            {quotationById?.architecturalCost.toLocaleString() ??
                                                "N/A"}
                                        </p>
                                        <p>
                                            <strong>Costo Sanitario:</strong>{" "}
                                            S/.{" "}
                                            {quotationById?.sanitaryCost.toLocaleString() ??
                                                "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Costo Eléctrico:</strong>{" "}
                                            S/.{" "}
                                            {quotationById?.electricCost.toLocaleString() ??
                                                "N/A"}
                                        </p>
                                        <p>
                                            <strong>Costo Estructural:</strong>{" "}
                                            S/.{" "}
                                            {quotationById?.structuralCost.toLocaleString() ??
                                                "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="detalles-proyecto">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Layout className="mr-2 h-6 w-6" />
                                    Detalles Integrados del Proyecto
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {Array.isArray(
                                        quotationById?.integratedProjectDetails,
                                    ) &&
                                        quotationById?.integratedProjectDetails.map(
                                            (subproyecto, index) => (
                                                <SubproyectoCard
                                                    key={index}
                                                    {...subproyecto}
                                                />
                                            ),
                                        )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="cronograma-pagos">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-6 w-6" />
                                    Cronograma de Pagos
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="mb-6 grid gap-4 md:grid-cols-3">
                                    {Array.isArray(
                                        quotationById?.paymentSchedule,
                                    ) &&
                                        quotationById?.paymentSchedule.map(
                                            (fase, index) => (
                                                <FasePagoCard
                                                    key={index}
                                                    {...fase}
                                                />
                                            ),
                                        )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <DesignSummary />
                    </Accordion>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
