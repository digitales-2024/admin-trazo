import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";
import {
    DollarSign,
    Percent,
    TrendingUp,
    ChartNoAxesCombined,
} from "lucide-react";
import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

type Props = {
    budget: BudgetSummary;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        maximumFractionDigits: 2,
    }).format(amount);
};

const SummaryCostBudgetDialog = ({ budget }: Props) => {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });

    if (!budgetData) return null;

    return (
        <TabsContent value="details">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">
                        Resumen del Presupuesto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {budgetData.budgetDetail?.map((detail) => (
                            <div key={detail.id} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:gap-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium">
                                                Costos
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {[
                                                    {
                                                        icon: DollarSign,
                                                        label: "Costo Directo",
                                                        value: formatCurrency(
                                                            detail.directCost,
                                                        ),
                                                    },
                                                    {
                                                        icon: TrendingUp,
                                                        label: "Gastos Generales",
                                                        value: formatCurrency(
                                                            detail.overhead,
                                                        ),
                                                    },
                                                    {
                                                        icon: ChartNoAxesCombined,
                                                        label: "Utilidad",
                                                        value: formatCurrency(
                                                            detail.utility,
                                                        ),
                                                    },
                                                    {
                                                        icon: Percent,
                                                        label: "IGV",
                                                        value:
                                                            detail.igv === 0 ? (
                                                                <span className="text-xs text-slate-300">
                                                                    Sin IGV
                                                                    aplicado
                                                                </span>
                                                            ) : (
                                                                formatCurrency(
                                                                    (detail.igv *
                                                                        detail.directCost) /
                                                                        100,
                                                                )
                                                            ),
                                                    },
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="flex items-center">
                                                            <item.icon
                                                                className="mr-2 h-4 w-4"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                            <span className="text-sm font-light">
                                                                {item.label}
                                                            </span>
                                                        </span>
                                                        <span className="text-sm font-light text-emerald-500">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium">
                                                Porcentajes y Total
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {[
                                                    {
                                                        icon: Percent,
                                                        label: "Porcentaje de gastos generales",
                                                        value: `${detail.percentageOverhead}%`,
                                                    },
                                                    {
                                                        icon: Percent,
                                                        label: "Porcentaje de utilidades",
                                                        value: `${detail.percentageUtility}%`,
                                                    },
                                                    {
                                                        icon: DollarSign,
                                                        label: "Costo sin Descuento Comercial",
                                                        value: formatCurrency(
                                                            detail.totalCost +
                                                                detail.discount,
                                                        ),
                                                    },
                                                    {
                                                        icon: DollarSign,
                                                        label: "Descuento Comercial",
                                                        value: `-${formatCurrency(detail.discount)}`,
                                                    },
                                                    {
                                                        icon: DollarSign,
                                                        label: "Costo Total",
                                                        value: formatCurrency(
                                                            detail.totalCost,
                                                        ),
                                                    },
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="group flex items-center justify-between"
                                                    >
                                                        <span className="flex items-center">
                                                            <item.icon
                                                                className="mr-2 h-4 w-4"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                            <span className="text-sm font-light">
                                                                {item.label}
                                                            </span>
                                                        </span>
                                                        <span
                                                            className={`text-sm font-light ${
                                                                item.label ===
                                                                "Descuento Comercial"
                                                                    ? "text-orange-500"
                                                                    : "text-emerald-500"
                                                            }`}
                                                        >
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* gráfico de Costos */}
                                <div className="grid grid-cols-1 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium">
                                                Gráfico de Costos
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-auto w-full">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={400}
                                                >
                                                    <BarChart
                                                        data={[
                                                            {
                                                                name: "Costo Dir.",
                                                                value: detail.directCost,
                                                            },
                                                            {
                                                                name: "Gastos Gral.",
                                                                value: detail.overhead,
                                                            },
                                                            {
                                                                name: "Utilidad",
                                                                value: detail.utility,
                                                            },
                                                            {
                                                                name: "Costo T.",
                                                                value: detail.totalCost,
                                                            },
                                                        ]}
                                                        margin={{
                                                            top: 20,
                                                            right: 30,
                                                            left: 0,
                                                            bottom: 70,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis
                                                            dataKey="name"
                                                            angle={-65}
                                                            textAnchor="end"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        />
                                                        <YAxis
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        />
                                                        <Tooltip />
                                                        <Bar
                                                            dataKey="value"
                                                            fill="#000"
                                                            label={false}
                                                            barSize={60}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default SummaryCostBudgetDialog;
