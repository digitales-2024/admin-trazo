import { Percent } from "lucide-react";
import React from "react";

import { Budget } from "@/components/budget/create-budget/create-detail-budget/types";
import { Input } from "@/components/ui/input";

interface PercentageBudgetProps {
    budget: {
        overheadPercentage: number;
        profitPercentage: number;
        taxPercentage: number;
    };
    setBudget: React.Dispatch<React.SetStateAction<Budget>>;
}

const PercentageBudget: React.FC<PercentageBudgetProps> = ({
    budget,
    setBudget,
}) => {
    return (
        <div>
            <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Percent className="mr-2" /> Porcentajes y Resumen
            </h2>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="overhead"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Gastos Generales (%)
                    </label>
                    <Input
                        type="number"
                        id="overhead"
                        value={budget.overheadPercentage}
                        onChange={(e) =>
                            setBudget((prev) => ({
                                ...prev,
                                overheadPercentage: Number(e.target.value),
                            }))
                        }
                        className="mt-1"
                    />
                </div>
                <div>
                    <label
                        htmlFor="profit"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Utilidad (%)
                    </label>
                    <Input
                        type="number"
                        id="profit"
                        value={budget.profitPercentage}
                        onChange={(e) =>
                            setBudget((prev) => ({
                                ...prev,
                                profitPercentage: Number(e.target.value),
                            }))
                        }
                        className="mt-1"
                    />
                </div>
                <div>
                    <label
                        htmlFor="tax"
                        className="block text-sm font-medium text-gray-700"
                    >
                        IGV (%)
                    </label>
                    <Input
                        type="number"
                        id="tax"
                        value={budget.taxPercentage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setBudget((prev) => ({
                                ...prev,
                                taxPercentage: Number(e.target.value),
                            }))
                        }
                        className="mt-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default PercentageBudget;
