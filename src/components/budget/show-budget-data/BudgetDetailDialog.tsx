"use client";

import { useBudgets } from "@/hooks/use-budget";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BudgetSummary } from "@/types/budget";
import { DialogDescription } from "@radix-ui/react-dialog";
import { BarChart2, DollarSign, FileUser } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CategoriesBudget from "./CategoriesBudget";
import GeneralInformationDialog from "./GeneralInformationDialog";
import SummaryCostBudgetDialog from "./SummaryCostBudgetDialog";

interface Props {
    open: boolean;
    onClose: (open: boolean) => void;
    budget: BudgetSummary;
}

export function BudgetDetailDialog({ budget, open, onClose }: Props) {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });
    const isDesktop = useMediaQuery("(min-width: 640px)");

    if (!budgetData) return null;

    const Container = isDesktop ? Dialog : Drawer;
    const ContentComponent = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    const Description = isDesktop ? DialogDescription : DrawerDescription;

    return (
        <Container open={open} onOpenChange={onClose}>
            <ContentComponent className="w-full max-w-4xl p-4">
                <Header>
                    <div>
                        <Title>Detalles del Presupuesto</Title>
                        <Badge
                            className="mt-2 bg-emerald-100 capitalize text-emerald-700"
                            variant="secondary"
                        >
                            {budgetData.code}
                        </Badge>
                    </div>
                    <div>
                        <Description>
                            Información detallada del presupuesto
                        </Description>
                    </div>
                </Header>

                <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4 p-4">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger
                                value="general"
                                className="flex-grow text-center"
                            >
                                <FileUser
                                    className="mr-2 h-4 w-4 flex-shrink-0"
                                    strokeWidth={1.5}
                                />
                                <span className="truncate text-ellipsis">
                                    Información General
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="flex-grow text-center"
                            >
                                <DollarSign
                                    className="mr-2 h-4 w-4 flex-shrink-0"
                                    strokeWidth={1.5}
                                />
                                <span className="truncate text-ellipsis">
                                    Resumén de Costos
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="flex-grow text-center"
                            >
                                <BarChart2
                                    className="mr-2 h-4 w-4 flex-shrink-0"
                                    strokeWidth={1.5}
                                />
                                <span className="truncate text-ellipsis">
                                    Estructura del Presupuesto
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Información General */}
                        <GeneralInformationDialog budget={budget} />

                        {/* Detalles del Presupuesto */}
                        <SummaryCostBudgetDialog budget={budget} />

                        {/* Categorías y Subcategorías */}
                        <CategoriesBudget budget={budget} />
                    </Tabs>
                </ScrollArea>
            </ContentComponent>
        </Container>
    );
}
