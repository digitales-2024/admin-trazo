import { Costs } from "@/types";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface CostSummaryProps {
    costs: Costs;
    discount: number;
    exchangeRate: number;
    totalCost: number;
    subtotal: number;
    setDiscount: (value: number) => void;
    setExchangeRate: (value: number) => void;
}

const projectNames: { [key in keyof Costs]: string } = {
    architecturalCost: "Proyecto Arquitectónico",
    structuralCost: "Proyecto Estructural",
    electricCost: "Proyecto de Instalaciones Eléctricas",
    sanitaryCost: "Proyecto de Instalaciones Sanitarias",
};

const CostSummary: React.FC<CostSummaryProps> = ({
    costs,
    discount,
    exchangeRate,
    totalCost,
    subtotal,
    setDiscount,
    setExchangeRate,
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Resumen de Costo</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Costo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(costs).map(([project, cost]) => (
                        <TableRow key={project}>
                            <TableCell className="font-medium">
                                {projectNames[project as keyof Costs]}
                            </TableCell>
                            <TableCell>{cost.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="discount">Costo x m² Proyecto (USD):</Label>
                    <Input
                        id="costM2Project"
                        type="number"
                        value={subtotal}
                        className="max-w-[200px]"
                        disabled
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="discount">Descuento (USD):</Label>
                    <Input
                        id="discount"
                        type="number"
                        value={discount}
                        onChange={(e) =>
                            setDiscount(parseFloat(e.target.value) || 0)
                        }
                        className="max-w-[200px]"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="exchange-rate">
                        Tasa de Cambio (PEN/USD):
                    </Label>
                    <Input
                        id="exchange-rate"
                        type="number"
                        value={exchangeRate}
                        onChange={(e) =>
                            setExchangeRate(parseFloat(e.target.value) || 0)
                        }
                        className="max-w-[200px]"
                    />
                </div>
                <div className="flex items-center justify-between font-bold">
                    <Label>Costo total sin descuento (PEN):</Label>
                    <span>{(subtotal * exchangeRate).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                    <Label>Costo Total (PEN):</Label>
                    <span>{totalCost.toFixed(2)}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default CostSummary;
