import { IntegralProjectDesign } from "@/types";
import { DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntegralProjectQuotationDescription({
    project,
    area,
    cost,
    items,
}: IntegralProjectDesign) {
    if (cost === 0) {
        return null;
    }

    return (
        <Card className="mb-4 p-6">
            <CardHeader>
                <CardTitle className="text-xl">{project}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    <strong>Área:</strong> {area} m²
                </p>
                <p>
                    <div className="flex flex-row items-center">
                        <strong>Costo:</strong>
                        <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                        {cost?.toLocaleString() ?? "N/A"}
                    </div>
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
}
