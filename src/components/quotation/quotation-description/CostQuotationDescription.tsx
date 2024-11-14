import { Quotation } from "@/types";
import { DollarSign } from "lucide-react";
import React from "react";

interface CostQuotationDescriptionProps {
    quotationById: Quotation;
}

export default function CostQuotationDescription({
    quotationById,
}: CostQuotationDescriptionProps) {
    return (
        <div className="mb-4 grid grid-cols-2 gap-4 p-4">
            <div>
                <div className="flex flex-row items-center">
                    <strong>Costo Arquitectónico:</strong>
                    <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                    {quotationById?.architecturalCost.toLocaleString() ?? "N/A"}
                </div>
                <div className="flex flex-row items-center">
                    <strong>Costo Sanitario:</strong>
                    <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                    {quotationById?.sanitaryCost.toLocaleString() ?? "N/A"}
                </div>
            </div>
            <div>
                <div className="flex flex-row items-center">
                    <strong>Costo Eléctrico:</strong>
                    <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                    {quotationById?.electricCost.toLocaleString() ?? "N/A"}
                </div>
                <div className="flex flex-row items-center">
                    <strong>Costo Estructural:</strong>
                    <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                    {quotationById?.structuralCost.toLocaleString() ?? "N/A"}
                </div>
            </div>
        </div>
    );
}
