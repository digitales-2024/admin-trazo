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
    onSuccess: (apuId: string) => void;
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
}) => {
    const { onCreateApuBudget, isSuccessCreateApuBudget, dataCreateApuBudget } =
        useApuBudget();

    useEffect(() => {
        if (isSuccessCreateApuBudget) {
            if (dataCreateApuBudget) {
                console.log("Apu creado", dataCreateApuBudget.data.id);
                onSuccess(dataCreateApuBudget.data.id);
            }
            onOpenChange(false);
        }
    }, [isSuccessCreateApuBudget]);

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
            onCreateApuBudget(payload);
        }
    };

    return (
        <div className="flex w-full flex-row-reverse gap-2">
            <Button className="w-full" onClick={handleClick}>
                {activeTab === "template" ? "Usar Plantilla" : "Crear Nuevo"}
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
