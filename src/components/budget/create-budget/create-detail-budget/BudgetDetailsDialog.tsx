import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary, DataItem } from "@/types/budget";
import {
    DollarSign,
    Percent,
    TrendingUp,
    ChartNoAxesCombined,
} from "lucide-react";
import {
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    PieLabelRenderProps,
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

const BudgetDetailsDialog = ({ budget }: Props) => {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });

    if (!budgetData) return null;

    // Función para renderizar las etiquetas dentro del gráfico de porcentajes
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        outerRadius,
        value,
        index,
    }: PieLabelRenderProps & { data: DataItem[] }) => {
        // Verificación para evitar valores undefined
        if (
            cx === undefined ||
            cy === undefined ||
            outerRadius === undefined ||
            !data ||
            index === undefined ||
            index >= data.length
        ) {
            return null;
        }

        // Convierte cx, cy, outerRadius a números en caso de que sean strings
        const numericCx = Number(cx);
        const numericCy = Number(cy);
        const numericOuterRadius = Number(outerRadius);

        // Verificar si data y el índice son válidos
        const item = data[index];

        // Verificar si data y el índice son válidos
        if (!item) {
            return null;
        }

        const RADIAN = Math.PI / 180;
        const radius = numericOuterRadius + 10;
        const x = numericCx + radius * Math.cos(-midAngle * RADIAN);
        const y = numericCy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor={x > numericCx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={14}
            >
                {`${data[index]?.name}: ${(value * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Datos para el grafico de porcentajes
    const data = [
        {
            name: "Gastos",
            value: parseFloat(
                (
                    (budgetData.budgetDetail[0].percentageOverhead / 100) *
                    budgetData.budgetDetail[0].directCost
                ).toFixed(3),
            ),
        },
        {
            name: "Utilidades",
            value: parseFloat(
                (
                    (budgetData.budgetDetail[0].percentageUtility / 100) *
                    budgetData.budgetDetail[0].directCost
                ).toFixed(3),
            ),
        },
        {
            name: "Costo Directo",
            value: budgetData.budgetDetail[0].directCost,
        },
    ];

    // Colores para el grafico de porcentajes
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    return (
        <TabsContent value="details">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                        Detalles del Presupuesto
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-xs sm:text-base">
                    <div className="space-y-6">
                        {budgetData.budgetDetail?.map((detail) => (
                            <div key={detail.id} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Costos
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <DollarSign className="mr-2 h-4 w-4" />
                                                        Costo Directo
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            detail.directCost,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <Percent className="mr-2 h-4 w-4" />
                                                        IGV
                                                    </span>
                                                    <span className="font-semibold">
                                                        {detail.igv}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <TrendingUp className="mr-2 h-4 w-4" />
                                                        Gastos Generales
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            detail.overhead,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                                                        Utilidad
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            detail.utility,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Porcentajes y Total
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <Percent className="mr-2 h-4 w-4" />
                                                        Porcentaje de gastos
                                                        generales
                                                    </span>
                                                    <span className="font-semibold">
                                                        {
                                                            detail.percentageOverhead
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <Percent className="mr-2 h-4 w-4" />
                                                        Porcentaje de utilidades
                                                    </span>
                                                    <span className="font-semibold">
                                                        {
                                                            detail.percentageUtility
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <DollarSign className="mr-2 h-4 w-4" />
                                                        Costo sin Descuento
                                                        Comercial
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            detail.totalCost +
                                                                detail.discount,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <DollarSign className="mr-2 h-4 w-4" />
                                                        Descuento Comercial
                                                    </span>
                                                    <span className="font-semibold">
                                                        -
                                                        {formatCurrency(
                                                            detail.discount,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <DollarSign className="mr-2 h-4 w-4" />
                                                        Costo Total
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            detail.totalCost,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* gráfico de Costos */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Gráfico de Costos
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={280}
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
                                                        />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar
                                                            dataKey="value"
                                                            fill="#8884d8"
                                                            label={false}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* gráfico de porcentajes */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Gráfico de Costos sin Descuento
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={data}
                                                            dataKey="value"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            labelLine={false}
                                                            label={
                                                                renderCustomizedLabel
                                                            }
                                                        >
                                                            {data.map(
                                                                (
                                                                    entry,
                                                                    index,
                                                                ) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={
                                                                            COLORS[
                                                                                index
                                                                            ]
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend />
                                                    </PieChart>
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

export default BudgetDetailsDialog;
