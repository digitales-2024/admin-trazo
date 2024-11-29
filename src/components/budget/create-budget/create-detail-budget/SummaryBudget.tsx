import { DollarSign } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryBudgetProps {
    directCosts: number;
    overhead: number;
    profit: number;
    tax: number;
    total: number;
}

const SummaryBudget: React.FC<SummaryBudgetProps> = ({
    directCosts,
    overhead,
    profit,
    tax,
    total,
}) => {
    return (
        <Card className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                    <DollarSign className="mr-2" /> Resumen del Presupuesto
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p>
                        <strong>Costos Directos:</strong> S/.{" "}
                        {directCosts.toFixed(2)}
                    </p>
                    <p>
                        <strong>Gastos Generales:</strong> S/.{" "}
                        {overhead.toFixed(2)}
                    </p>
                    <p>
                        <strong>Utilidad:</strong> S/. {profit.toFixed(2)}
                    </p>
                    <p>
                        <strong>IGV:</strong> S/. {tax.toFixed(2)}
                    </p>
                    <p className="mt-2 text-xl font-bold">
                        Total: S/. {total.toFixed(2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SummaryBudget;
