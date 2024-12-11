"use client";

import { useBudgets } from "@/hooks/use-budget";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BudgetSummary } from "@/types/budget";
import { DialogDescription } from "@radix-ui/react-dialog";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BudgetDetailsDialog from "./BudgetDetailsDialog";
import CategoriesBudget from "./CategoriesBudget";
import GeneralInformationDialog from "./GeneralInformationDialog";

interface Props {
    open: boolean;
    onClose: (open: boolean) => void;
    budget: BudgetSummary;
}

export function BudgetDetailDialog({ budget, open, onClose }: Props) {
    const { budgetById: budgetData } = useBudgets({
        id: budget.id,
    });
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    if (!budgetData) return null;

    console.log("Data", JSON.stringify(budgetData, null, 2));

    const Container = isDesktop ? Dialog : Drawer;
    const ContentComponent = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    const Description = isDesktop ? DialogDescription : DrawerDescription;

    return (
        <Container open={open} onOpenChange={onClose}>
            <ContentComponent className="w-full max-w-5xl p-4">
                <Header>
                    <div>
                        <Title>
                            Detalles del Presupuesto: {budgetData.name}
                        </Title>
                    </div>
                    <div>
                        <Description>
                            Información detallada del presupuesto
                        </Description>
                    </div>
                </Header>

                <div className="max-h-[80vh] overflow-y-auto">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="flex justify-start overflow-auto">
                            <TabsTrigger
                                value="general"
                                className="flex-shrink-0"
                            >
                                Información General
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="flex-shrink-0"
                            >
                                Detalles del Presupuesto
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="flex-shrink-0"
                            >
                                Categorías
                            </TabsTrigger>
                        </TabsList>

                        {/* Información General */}
                        <GeneralInformationDialog budget={budget} />

                        {/* Detalles del Presupuesto */}
                        <BudgetDetailsDialog budget={budget} />

                        {/* Categorías y Subcategorías */}
                        <CategoriesBudget budget={budget} />
                    </Tabs>
                </div>
            </ContentComponent>
        </Container>
    );
}
