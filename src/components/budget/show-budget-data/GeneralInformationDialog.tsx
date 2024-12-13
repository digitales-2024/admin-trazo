import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";
import { Calendar, FileText, Home, Info, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

type Props = {
    budget: BudgetSummary;
};

const GeneralInformationDialog = ({ budget }: Props) => {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });

    if (!budgetData) return null;

    const infoItems = [
        {
            icon: FileText,
            label: "Proyecto",
            value: budgetData.name,
        },
        {
            icon: Home,
            label: "Ubicación",
            value: budgetData.ubication,
        },
        {
            icon: User,
            label: "Cliente",
            value: (
                <span className="capitalize">
                    {budgetData.clientBudget.name}
                </span>
            ),
        },
        {
            icon: Info,
            label: "Estado",
            value:
                budgetData.status === "APPROVED" ? (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-500"
                    >
                        Aprobado
                    </Badge>
                ) : budgetData.status === "PENDING" ? (
                    <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-500"
                    >
                        Pendiente
                    </Badge>
                ) : budgetData.status === "REJECTED" ? (
                    <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-500"
                    >
                        Rechazado
                    </Badge>
                ) : (
                    <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-500"
                    >
                        Desconocido
                    </Badge>
                ),
        },
        {
            icon: Calendar,
            label: "Fecha del Proyecto",
            value: budgetData.dateProject,
        },
        {
            icon: FileText,
            label: "Proyecto de Diseño",
            value:
                budgetData.designProjectBudget === null
                    ? "Tiene diseño propio"
                    : budgetData.designProjectBudget?.code,
        },
    ];

    return (
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle className="font text-base font-medium">
                        Información General
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-between text-xs sm:text-base">
                    <div>
                        {infoItems.slice(0, 3).map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 py-1"
                            >
                                <item.icon
                                    className="h-4 w-4"
                                    strokeWidth={1.5}
                                />
                                <span className="text-sm font-medium">
                                    {item.label}:
                                </span>
                                <span className="text-sm font-light">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div>
                        {infoItems.slice(3).map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 py-1"
                            >
                                <item.icon
                                    className="h-4 w-4"
                                    strokeWidth={1.5}
                                />
                                <span className="text-sm font-medium">
                                    {item.label}:
                                </span>
                                <span className="text-sm font-light">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default GeneralInformationDialog;
