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
            value: budgetData.budgetDetail[0].percentageOverhead,
        },
        {
            name: "Utilidades",
            value: budgetData.budgetDetail[0].percentageUtility,
        },
        {
            name: "Otros",
            value:
                100 -
                budgetData.budgetDetail[0].percentageOverhead -
                budgetData.budgetDetail[0].percentageUtility,
        },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // Colores para el grafico de porcentajes

    return (
        <TabsContent value="details">
            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Presupuesto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {budgetData.budgetDetail?.map((detail) => (
                            <div key={detail.id} className="space-y-4">
                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2">
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
                                                        {detail.directCost}
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
                                                        Overhead
                                                    </span>
                                                    <span className="font-semibold">
                                                        {detail.overhead}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                                                        Utilidad
                                                    </span>
                                                    <span className="font-semibold">
                                                        {detail.utility}
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
                                                        Costo Total
                                                    </span>
                                                    <span className="font-semibold">
                                                        {detail.totalCost}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* gráfico de Costos */}
                                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2">
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
                                                                name: "Costo Directo",
                                                                value: detail.directCost,
                                                            },
                                                            {
                                                                name: "IGV",
                                                                value: detail.igv,
                                                            },
                                                            {
                                                                name: "Overhead",
                                                                value: detail.overhead,
                                                            },
                                                            {
                                                                name: "Utilidad",
                                                                value: detail.utility,
                                                            },
                                                            {
                                                                name: "Costo Total",
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
                                                            angle={-45}
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
                                                Gráfico de Porcentajes
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
