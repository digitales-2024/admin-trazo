import { useApuBudget } from "@/hooks/use-apu-budget";
import { ResourceApu } from "@/types";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface ApuActionButtonsProps {
    activeTab: string;
    templatePerformance: number;
    newPerformance: number;
    templateWorkHours: number;
    newWorkHours: number;
    templateResources: Record<string, ResourceApu[]>;
    newResources: Record<string, ResourceApu[]>;
    onOpenChange: (open: boolean) => void;
    onSuccess: (apuId: string, totalCost: number) => void;
    apuId?: string;
}

const ApuActionButtons: React.FC<ApuActionButtonsProps> = ({
    activeTab,
    templatePerformance,
    newPerformance,
    templateWorkHours,
    newWorkHours,
    templateResources,
    newResources,
    onOpenChange,
    onSuccess,
    apuId,
}) => {
    const { onCreateApuBudget, isSuccessCreateApuBudget, dataCreateApuBudget } =
        useApuBudget();
    const { onUpdateApuBudget, isSuccessUpdateApuBudget, dataUpdateApuBudget } =
        useApuBudget();
    useEffect(() => {
        if (isSuccessCreateApuBudget) {
            if (dataCreateApuBudget) {
                onSuccess(
                    dataCreateApuBudget.data.id,
                    dataCreateApuBudget.data.unitCost,
                );
            }
            onOpenChange(false);
        }
    }, [isSuccessCreateApuBudget]);

    useEffect(() => {
        if (isSuccessUpdateApuBudget) {
            if (dataUpdateApuBudget) {
                onSuccess(
                    dataUpdateApuBudget.data.id,
                    dataUpdateApuBudget.data.unitCost,
                );
            }
            onOpenChange(false);
        }
    }, [isSuccessUpdateApuBudget]);

    const transformResources = (resources: Record<string, ResourceApu[]>) => {
        return Object.values(resources)
            .flat()
            .map((resource) => ({
                resourceId: resource.id,
                quantity: Number(Number(resource.quantity).toFixed(4)),
                group: resource.group
                    ? Math.max(0, Number(resource.group))
                    : undefined,
            }));
    };

    const handleClick = () => {
        if (activeTab === "template") {
            const payload = {
                performance: templatePerformance,
                workHours: templateWorkHours,
                resources: transformResources(templateResources),
            };
            onCreateApuBudget(payload);
        } else {
            const payload = {
                performance: newPerformance,
                workHours: newWorkHours,
                resources: transformResources(newResources),
            };
            if (apuId) {
                onUpdateApuBudget({ id: apuId, ...payload });
            } else {
                onCreateApuBudget(payload);
            }
        }
    };

    return (
        <div className="flex w-full flex-row-reverse gap-2">
            <Button className="w-full" onClick={handleClick}>
                {activeTab === "template"
                    ? "Usar Plantilla"
                    : apuId
                      ? "Actualizar"
                      : "Crear Nuevo"}
            </Button>
            <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                    Cancelar
                </Button>
            </DialogClose>
        </div>
    );
};

export default ApuActionButtons;