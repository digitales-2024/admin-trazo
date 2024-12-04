import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApuHeadInformationProps {
    name: string;
    performance: number;
    setPerformance: (value: number) => void;
    workHours: number;
    setWorkHours: (value: number) => void;
    activeTab: string;
}

const ApuHeadInformation: React.FC<ApuHeadInformationProps> = ({
    name,
    performance,
    setPerformance,
    workHours,
    setWorkHours,
    activeTab,
}) => {
    return (
        <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
                <Label
                    htmlFor="itemName"
                    className="text-sm font-medium text-gray-700"
                >
                    Nombre de la Partida
                </Label>
                <Input
                    id="itemName"
                    value={name}
                    className="mt-1 capitalize"
                    readOnly
                />
            </div>
            <div>
                <Label
                    htmlFor="performance"
                    className="text-sm font-medium text-gray-700"
                >
                    Rendimiento
                </Label>
                <Input
                    id="performance"
                    type="number"
                    value={performance}
                    onChange={(e) => setPerformance(Number(e.target.value))}
                    className="mt-1"
                    readOnly={activeTab === "template"}
                />
            </div>
            <div>
                <Label
                    htmlFor="workHours"
                    className="text-sm font-medium text-gray-700"
                >
                    Horas de Trabajo
                </Label>
                <Input
                    id="workHours"
                    type="number"
                    value={workHours}
                    onChange={(e) => setWorkHours(Number(e.target.value))}
                    className="mt-1"
                    readOnly={activeTab === "template"}
                />
            </div>
        </div>
    );
};

export default ApuHeadInformation;
