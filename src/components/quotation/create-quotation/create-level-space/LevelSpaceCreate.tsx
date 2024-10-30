"use client";

import { Floor } from "@/types";
import { Plus, ChevronDown, ChevronUp, BrickWall } from "lucide-react";
import { useState } from "react";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { DesignSummary } from "./DesignSummary";
import { LevelAccordionItem } from "./LevelAccordionItem";

interface CreateLevelSpaceProps {
    floors: Floor[];
    setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;
    calculateTotalBuildingMeters: () => number;
}

export function CreateLevelSpace({
    floors,
    setFloors,
    calculateTotalBuildingMeters,
}: CreateLevelSpaceProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const addFloor = () => {
        setFloors([
            ...floors,
            {
                number: floors.length + 1,
                name: `Nivel ${floors.length + 1}`,
                spaces: [],
                expanded: true,
            },
        ]);
    };

    const duplicateFloor = (floorNumber: number) => {
        const floorToDuplicate = floors.find(
            (floor) => floor.number === floorNumber,
        );
        if (floorToDuplicate) {
            const newFloor = {
                ...floorToDuplicate,
                number: floors.length + 1,
                name: `${floorToDuplicate.name} (Copia)`,
                expanded: false,
            };
            setFloors([...floors, newFloor]);
        }
    };

    const deleteFloor = (floorNumber: number) => {
        setFloors(floors.filter((floor) => floor.number !== floorNumber));
    };

    const addSpace = (floorNumber: number) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                return {
                    ...floor,
                    spaces: [
                        ...floor.spaces,
                        { id: "", name: "", meters: 0, amount: 1 },
                    ],
                };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const updateSpace = (
        floorNumber: number,
        spaceIndex: number,
        field: "name" | "meters" | "amount",
        value: string | number,
    ) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                const newSpaces = floor.spaces.map((space, index) => {
                    if (index === spaceIndex) {
                        return { ...space, [field]: value };
                    }
                    return space;
                });
                return { ...floor, spaces: newSpaces };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const changeFloorName = (floorNumber: number, newName: string) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                return { ...floor, name: newName };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const deleteSpace = (floorNumber: number, spaceIndex: number) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                const newSpaces = floor.spaces.filter(
                    (_, index) => index !== spaceIndex,
                );
                return { ...floor, spaces: newSpaces };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const calculateTotalMeters = (floor: Floor) => {
        return floor.spaces.reduce((total, space) => total + space.meters, 0);
    };

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="" onClick={() => setIsOpen(!isOpen)}>
                        <div className="flex w-full justify-between">
                            <Button
                                variant={"withoutline"}
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <BrickWall size={54} />
                                    <span className="text-xl font-bold text-gray-900">
                                        Definir niveles y ambientes
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                {isOpen && (
                    <CardContent>
                        <CollapsibleContent>
                            <div className="container mx-auto p-4">
                                <div className="mb-6 flex flex-wrap gap-4">
                                    <Button onClick={addFloor}>
                                        <Plus className="mr-2" /> Agregar Nivel
                                    </Button>
                                    {/* Removemos los campos de rango y el botón "Añadir Rango" */}
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-6">
                                        <Accordion
                                            type="multiple"
                                            className="w-full"
                                        >
                                            {floors.map((floor) => (
                                                <LevelAccordionItem
                                                    key={floor.number}
                                                    floor={floor}
                                                    deleteFloor={deleteFloor}
                                                    changeFloorName={
                                                        changeFloorName
                                                    }
                                                    updateSpace={updateSpace}
                                                    addSpace={addSpace}
                                                    calculateTotalMeters={
                                                        calculateTotalMeters
                                                    }
                                                    duplicateFloor={
                                                        duplicateFloor
                                                    } // Pasamos la función aquí
                                                    deleteSpace={deleteSpace} // Pasamos la función aquí
                                                />
                                            ))}
                                        </Accordion>
                                    </div>
                                    <div className="sticky top-4 h-fit">
                                        <DesignSummary
                                            floors={floors}
                                            calculateTotalMeters={
                                                calculateTotalMeters
                                            }
                                            calculateTotalBuildingMeters={
                                                calculateTotalBuildingMeters
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
}
