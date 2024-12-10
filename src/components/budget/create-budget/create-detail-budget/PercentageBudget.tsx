import { BudgetCategories } from "@/types";
import {
    BarChart4,
    DollarSign,
    Percent,
    PieChart,
    SquarePercent,
    Tag,
    ToggleLeft,
} from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PercentageBudgetProps {
    budget: {
        overheadPercentage: number;
        profitPercentage: number;
        taxPercentage: number;
        commercialDiscount: number;
        applyTax: boolean | undefined;
    };
    directCosts: number;
    overhead: number;
    profit: number;
    tax: number;
    subtotal: number;
    total: number;
    setBudget: React.Dispatch<React.SetStateAction<BudgetCategories>>;
}

const PercentageBudget: React.FC<PercentageBudgetProps> = ({
    budget,
    setBudget,
    directCosts,
    overhead,
    profit,
    tax,
    subtotal,
    total,
}) => {
    return (
        <div className="w-full">
            <div className="space-y-6 p-2">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center text-sm font-light">
                            <DollarSign
                                className="mr-2 h-4 w-4 flex-shrink-0"
                                strokeWidth={1.5}
                            />
                            <span className="truncate text-ellipsis">
                                Costo Directo
                            </span>
                        </Label>
                        <Badge
                            variant={"outline"}
                            className="flex items-center rounded-lg border-emerald-200 px-2 py-1"
                        >
                            <span className="mr-1 text-sm font-medium text-emerald-500">
                                Costo: S/.
                            </span>
                            <span className="text-sm font-light">
                                {directCosts.toFixed(2)}
                            </span>
                        </Badge>
                    </div>
                </div>
                <BudgetItem
                    label="Gastos Generales"
                    percentage={budget.overheadPercentage}
                    amount={overhead}
                    onChange={(value) =>
                        setBudget((prev) => ({
                            ...prev,
                            overheadPercentage: value,
                        }))
                    }
                />
                <BudgetItem
                    label="Utilidad"
                    percentage={budget.profitPercentage}
                    amount={profit}
                    onChange={(value) =>
                        setBudget((prev) => ({
                            ...prev,
                            profitPercentage: value,
                        }))
                    }
                />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="applyTax"
                            className="flex items-center text-sm font-light"
                        >
                            <ToggleLeft
                                className="mr-2 h-4 w-4 flex-shrink-0"
                                strokeWidth={1.5}
                            />
                            <span className="truncate text-ellipsis">
                                Aplicar IGV
                            </span>
                        </Label>
                        <Switch
                            id="applyTax"
                            checked={budget.applyTax}
                            onCheckedChange={(checked) =>
                                setBudget((prev) => ({
                                    ...prev,
                                    applyTax: checked,
                                }))
                            }
                        />
                    </div>
                </div>
                {budget.applyTax && (
                    <BudgetItem
                        label="IGV"
                        percentage={budget.taxPercentage}
                        amount={tax}
                        onChange={(value) =>
                            setBudget((prev) => ({
                                ...prev,
                                taxPercentage: value,
                            }))
                        }
                    />
                )}

                <Separator className="my-4" />
                <div className="flex items-center justify-between rounded-md">
                    <span className="flex items-center text-sm font-light">
                        <SquarePercent
                            className="mr-2 h-4 w-4 flex-shrink-0"
                            strokeWidth={1.5}
                        />{" "}
                        Total sin descuento:
                    </span>
                    <span className="flex items-center text-sm font-light">
                        S/. {subtotal.toFixed(2)}
                    </span>
                </div>
                <Separator className="my-4" />

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="commercialDiscount"
                            className="flex items-center text-sm font-light"
                        >
                            <Tag
                                className="mr-2 h-4 w-4 flex-shrink-0"
                                strokeWidth={1.5}
                            />
                            <span className="truncate text-ellipsis">
                                Descuento Comercial
                            </span>
                        </Label>
                        <Badge
                            variant={"outline"}
                            className="flex items-center rounded-lg border-orange-200 px-2 py-1"
                        >
                            <span className="mr-1 text-sm font-medium text-orange-500">
                                S/.
                            </span>
                            <span className="text-sm font-light">
                                {budget.commercialDiscount.toFixed(2)}
                            </span>
                        </Badge>
                    </div>

                    <Input
                        type="number"
                        id="commercialDiscount"
                        value={budget.commercialDiscount}
                        onChange={(e) =>
                            setBudget((prev) => ({
                                ...prev,
                                commercialDiscount: Number(e.target.value),
                            }))
                        }
                        className="w-full"
                    />
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between rounded-md">
                    <span className="flex items-center text-lg font-medium">
                        <PieChart className="mr-2 h-4 w-4" /> Total General:
                    </span>
                    <span className="flex items-center text-lg font-medium">
                        S/. {total.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface BudgetItemProps {
    label: string;
    percentage: number;
    amount: number;
    onChange: (value: number) => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({
    label,
    percentage,
    amount,
    onChange,
}) => {
    const getIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case "gastos generales":
                return (
                    <PieChart
                        className="mr-2 h-4 w-4 flex-shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                );
            case "utilidad":
                return (
                    <BarChart4
                        className="mr-2 h-4 w-4 flex-shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                );
            case "igv":
                return (
                    <Percent
                        className="mr-2 h-4 w-4 flex-shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label
                    htmlFor={label.toLowerCase()}
                    className="flex items-center text-sm font-light"
                >
                    {getIcon(label)}
                    <span className="truncate text-ellipsis"> {label} (%)</span>
                </Label>
                <Badge
                    variant={"outline"}
                    className="flex items-center rounded-lg border-emerald-200 px-2 py-1"
                >
                    <span className="mr-1 text-sm font-medium text-emerald-500">
                        S/.
                    </span>
                    <span className="text-sm font-light">
                        {amount.toFixed(2)}
                    </span>
                </Badge>
            </div>
            <div className="relative">
                <Input
                    type="number"
                    id={label.toLowerCase()}
                    value={percentage}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="h-8 w-full pr-10"
                />
                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
            </div>
        </div>
    );
};

export default PercentageBudget;
