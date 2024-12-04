import { ResourceApu } from "@/types";
import React from "react";

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
}

const ApuActionButtons: React.FC<ApuActionButtonsProps> = ({
    activeTab,
    templatePerformance,
    newPerformance,
    templateWorkHours,
    newWorkHours,
    templateResources,
    newResources,
}) => {
    const handleClick = () => {
        if (activeTab === "template") {
            console.log("Usar plantilla", {
                performance: templatePerformance,
                workHours: templateWorkHours,
                resources: templateResources,
            });
        } else {
            console.log("Crear nuevo", {
                performance: newPerformance,
                workHours: newWorkHours,
                resources: newResources,
            });
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
