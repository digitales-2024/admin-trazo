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

    return (
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                        Información General
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-between text-xs sm:text-base">
                    <div>
                        <div className="flex items-center gap-2 py-1">
                            <FileText className="h-4 w-4" />
                            <span className="font-semibold">Código:</span>{" "}
                            {budgetData.code}
                        </div>
                        <div className="flex items-center gap-2 py-1">
                            <Home className="h-4 w-4" />
                            <span className="font-semibold">
                                Ubicación:
                            </span>{" "}
                            {budgetData.ubication}
                        </div>
                        <div className="col-span-2 flex items-center gap-2 py-1">
                            <User className="h-4 w-4" />
                            <span className="font-semibold">Cliente:</span>{" "}
                            <span className="capitalize">
                                {budgetData.clientBudget.name}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 py-1">
                            <Info className="h-4 w-4" />
                            <span className="font-semibold">Estado:</span>{" "}
                            {budgetData.status === "APPROVED" ? (
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
                            )}
                        </div>
                        <div className="flex items-center gap-2 py-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-semibold">
                                Fecha del Proyecto:
                            </span>{" "}
                            {budgetData.dateProject}
                        </div>
                        <div className="flex items-center gap-2 py-1">
                            <FileText className="h-4 w-4" />
                            <span className="font-semibold">
                                Proyecto de Diseño:
                            </span>{" "}
                            {budgetData.designProjectBudget === null
                                ? "Tiene diseño propio"
                                : budgetData.designProjectBudget?.code}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default GeneralInformationDialog;
