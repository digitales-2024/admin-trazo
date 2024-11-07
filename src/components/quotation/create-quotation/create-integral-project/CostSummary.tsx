import { LogoSunat } from "@/assets/icons/LogoSunat";
import { useExchangeRate } from "@/hooks/use-exchange-rate-sunat";
import { Costs, QuotationStructure } from "@/types";
import React from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
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
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

interface CostSummaryProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    costs: Costs;
    discount: number;
    exchangeRate: number;
    totalCost: number;
    subtotal: number;
    setDiscount: (value: number) => void;
    setExchangeRate: (value: number) => void;
    form: UseFormReturn<QuotationStructure>;
    area: number;
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
    area,
    form,
}) => {
    const { handleFetchExchangeRate, exchangeRate: fetchedExchangeRate } =
        useExchangeRate();
    const { setValue, clearErrors } = form;

    const handleButtonClick = async () => {
        await handleFetchExchangeRate();
        if (fetchedExchangeRate) {
            setValue("exchangeRate", parseFloat(fetchedExchangeRate));
            clearErrors("exchangeRate");
            setExchangeRate(parseFloat(fetchedExchangeRate));
        }
    };

    return (
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
                        <Label htmlFor="discount">
                            Costo x m² Proyecto (USD):
                        </Label>
                        <Input
                            id="costM2Project"
                            type="number"
                            value={subtotal.toFixed(2)}
                            className="max-w-[100px]"
                            disabled
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="discount">Descuento (USD):</Label>
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem className="justify-items-end">
                                    <Input
                                        id="discount"
                                        type="number"
                                        className="max-w-[100px]"
                                        value={discount}
                                        onChange={(e) => {
                                            const value = Number(
                                                e.target.value,
                                            );
                                            field.onChange(value);
                                            setDiscount(value);
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="exchange-rate">
                            Tasa de Cambio (PEN/USD):
                        </Label>
                        <FormField
                            control={form.control}
                            name="exchangeRate"
                            render={({ field }) => (
                                <FormItem className="justify-items-end">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="exchange-rate"
                                            type="number"
                                            className="max-w-[100px]"
                                            value={exchangeRate}
                                            onChange={(e) => {
                                                const value = Number(
                                                    e.target.value,
                                                );
                                                field.onChange(value);
                                                setExchangeRate(value);
                                            }}
                                        />
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={
                                                            handleButtonClick
                                                        }
                                                    >
                                                        <LogoSunat />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Obtener Tasa de Cambio
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between font-bold">
                        <Label>Costo total sin descuento (PEN):</Label>
                        <span>
                            {(subtotal * exchangeRate * area).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                        <Label>Costo Total (PEN):</Label>
                        <span>{totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CostSummary;
