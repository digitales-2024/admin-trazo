import { Building2 } from "lucide-react";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";

type Space = {
    name: string;
    amount: number;
    area: number;
};

type Level = {
    name: string;
    spaces: Space[];
};

const buildingData: Level[] = [
    {
        name: "Nivel 1",
        spaces: [
            { name: "Dormitorio principal", amount: 1, area: 25 },
            { name: "Baño", amount: 2, area: 8 },
            { name: "Cocina", amount: 1, area: 15 },
            { name: "Sala de estar", amount: 1, area: 30 },
        ],
    },
    {
        name: "Nivel 2",
        spaces: [
            { name: "Dormitorio secundario", amount: 2, area: 20 },
            { name: "Baño", amount: 1, area: 6 },
            { name: "Estudio", amount: 1, area: 12 },
            { name: "Sala de juegos", amount: 1, area: 25 },
        ],
    },
];

// Calcular el área total de un nivel específico
const calculateTotalMeters = (level: Level): number =>
    level.spaces.reduce((total, space) => total + space.area * space.amount, 0);

// Calcular el área total del edificio
const calculateTotalBuildingMeters = (): number =>
    buildingData.reduce(
        (total, level) => total + calculateTotalMeters(level),
        0,
    );

export function DesignSummary() {
    const totalBuildingMeters = calculateTotalBuildingMeters();

    return (
        <TooltipProvider>
            <Card className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 text-white shadow-xl">
                <CardHeader className="bg-be2126 flex items-center justify-between p-6 text-white">
                    <div className="flex items-center space-x-3">
                        <Building2 size={40} color="white" />
                        <CardTitle className="text-2xl font-semibold">
                            Resumen del Diseño
                        </CardTitle>
                    </div>
                    <span className="text-xl font-bold">
                        {totalBuildingMeters} m²
                    </span>
                </CardHeader>

                <CardContent className="space-y-6 bg-gray-800 p-6">
                    {buildingData.map((level, levelIndex) => {
                        const floorTotalMeters = calculateTotalMeters(level);
                        const floorPercentage =
                            (floorTotalMeters / totalBuildingMeters) * 100;

                        return (
                            <Accordion
                                type="single"
                                collapsible
                                key={levelIndex}
                            >
                                <AccordionItem
                                    value={`floor-${levelIndex}`}
                                    className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-md"
                                >
                                    <AccordionTrigger className="bg-be2126/20 flex items-center justify-between border-b px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                variant="outline"
                                                className="bg-be2126 px-2 py-1 text-white"
                                            >
                                                {level.name}
                                            </Badge>
                                            <span className="text-lg font-medium text-gray-300">
                                                {floorTotalMeters} m²
                                            </span>
                                        </div>
                                        <Progress
                                            value={floorPercentage}
                                            className="h-2 w-32 overflow-hidden rounded-full bg-gray-700"
                                        />
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-900 p-6">
                                        <ul className="space-y-4">
                                            {level.spaces.map(
                                                (space, spaceIndex) => (
                                                    <li
                                                        key={spaceIndex}
                                                        className="flex items-center justify-between border-b border-gray-700 py-3"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <span className="font-medium text-gray-300">
                                                                        {
                                                                            space.amount
                                                                        }{" "}
                                                                        x{" "}
                                                                        {
                                                                            space.name
                                                                        }
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    side="right"
                                                                    className="bg-be2126 text-white"
                                                                >
                                                                    Área:{" "}
                                                                    {space.area}{" "}
                                                                    m² cada uno
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <span className="font-semibold text-gray-400">
                                                            {space.area *
                                                                space.amount}{" "}
                                                            m²
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        );
                    })}
                </CardContent>

                <div className="bg-be2126 flex items-center justify-between border-t border-gray-700 p-6 text-white">
                    <strong className="text-lg">Total Construcción:</strong>
                    <span className="text-xl font-semibold">
                        {totalBuildingMeters} m²
                    </span>
                </div>
            </Card>
        </TooltipProvider>
    );
}
