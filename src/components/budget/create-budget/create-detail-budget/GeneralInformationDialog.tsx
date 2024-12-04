import { useBudgets } from "@/hooks/use-budget";
import { BudgetSummary } from "@/types/budget";
import { Calendar, FileText, Home, Info, User } from "lucide-react";

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
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-start sm:justify-around">
                    <div className="">
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
                            {budgetData.clientBudget.name}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 py-1">
                            <Info className="h-4 w-4" />
                            <span className="font-semibold">Estado:</span>{" "}
                            {budgetData.status}
                        </div>
                        <div className="flex items-center gap-2 py-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-semibold">
                                Fecha del Proyecto:
                            </span>{" "}
                            {budgetData.dateProject}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default GeneralInformationDialog;
