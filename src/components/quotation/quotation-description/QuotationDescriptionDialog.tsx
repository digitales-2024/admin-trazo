import { useQuotations } from "@/hooks/use-quotation";
import { QuotationStatusType, QuotationSummary } from "@/types";
import { Home, DollarSign, Layout, Calendar, Building } from "lucide-react";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../ui/accordion";
import { Badge } from "../../ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import CostQuotationDescription from "./CostQuotationDescription";
import HeadQuotationDescription from "./HeadQuotationDescription";
import IntegralProjectQuotationDescription from "./IntegralProjectQuotationDescription";
import PaymentScheduleQuotationDescription from "./PaymentScheduleQuotationDescription";
import ArchitecturalSpaceVisualizer from "./QuotationDescriptionDialog copy";

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-5xl p-4">
                <DialogHeader className="text-left">
                    <div>
                        <DialogTitle className="flex flex-col items-start">
                            Detalles de la Cotización
                        </DialogTitle>
                        <div className="mt-2">
                            {quotationById?.status ===
                            QuotationStatusType.APPROVED ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-emerald-100 text-emerald-500"
                                >
                                    Aprobado
                                </Badge>
                            ) : quotationById?.status ===
                              QuotationStatusType.PENDING ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-500"
                                >
                                    Pendiente
                                </Badge>
                            ) : quotationById?.status ===
                              QuotationStatusType.REJECTED ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-500"
                                >
                                    Rechazado
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-500"
                                >
                                    Desconocido
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div>
                        <DialogDescription>
                            Información detallada de la cotización{" "}
                            <span
                                className={`${
                                    quotationById?.status ===
                                    QuotationStatusType.APPROVED
                                        ? "text-emerald-500"
                                        : quotationById?.status ===
                                            QuotationStatusType.PENDING
                                          ? "text-yellow-500"
                                          : quotationById?.status ===
                                              QuotationStatusType.REJECTED
                                            ? "text-red-500"
                                            : ""
                                } font-light italic`}
                            >
                                COT-DIS-{quotationById?.publicCode}
                            </span>
                        </DialogDescription>
                    </div>
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
                                {quotationById && (
                                    <HeadQuotationDescription
                                        quotationById={quotationById}
                                    />
                                )}
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
                                {quotationById && (
                                    <CostQuotationDescription
                                        quotationById={quotationById}
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="detalles-proyecto">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Layout className="mr-2 h-6 w-6" />
                                    Detalles Integrales del Proyecto
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-4 p-4 md:grid-cols-2">
                                    {Array.isArray(
                                        quotationById?.integratedProjectDetails,
                                    ) &&
                                        quotationById?.integratedProjectDetails.map(
                                            (subproyecto, index) => (
                                                <IntegralProjectQuotationDescription
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
                                <div className="mb-6 grid gap-4 p-4 md:grid-cols-3">
                                    {Array.isArray(
                                        quotationById?.paymentSchedule,
                                    ) &&
                                        quotationById?.paymentSchedule.map(
                                            (fase, index) => (
                                                <PaymentScheduleQuotationDescription
                                                    key={index}
                                                    {...fase}
                                                />
                                            ),
                                        )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="levels-spaces">
                            <AccordionTrigger>
                                <div className="flex items-center">
                                    <Building className="mr-2 h-6 w-6" />
                                    Detalles de los Niveles y Ambientes
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ArchitecturalSpaceVisualizer
                                    levelData={quotationById?.levels ?? []}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
