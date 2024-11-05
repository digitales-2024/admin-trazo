"use client";

import { Floor, LevelQuotation, QuotationStructure } from "@/types";
import { Plus, ChevronDown, ChevronUp, BrickWall } from "lucide-react";
import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

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

interface CreateLevelSpaceProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    floors: Floor[];
    setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;
    calculateTotalBuildingMeters: () => number;
    form: UseFormReturn<QuotationStructure>;
}

export function extractData(floors: Floor[]): LevelQuotation[] {
    return floors.map((floor) => ({
        name: floor.name,
        spaces: floor.spaces.map((space) => ({
            amount: space.amount,
            area: space.meters * space.amount,
            spaceId: space.spaceId || "",
        })),
    }));
}

export function CreateLevelSpace({
    floors,
    setFloors,
    calculateTotalBuildingMeters,
    form,
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

    const deleteSelectedSpaces = (floorNumber: number) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                return {
                    ...floor,
                    spaces: floor.spaces.filter((space) => !space.selected),
                };
            }
            return floor;
        });
        setFloors(newFloors);
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
                        {
                            spaceId: "",
                            name: "",
                            meters: 0,
                            amount: 1,
                            selected: false,
                        },
                    ],
                };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const updateSpace = useCallback(
        (
            floorNumber: number,
            spaceIndex: number,
            field: "name" | "meters" | "amount" | "selected" | "spaceId",
            value: string | number | boolean,
        ) => {
            setFloors((prevFloors) =>
                prevFloors.map((floor) => {
                    if (floor.number === floorNumber) {
                        const updatedSpaces = floor.spaces.map(
                            (space, index) =>
                                index === spaceIndex
                                    ? { ...space, [field]: value }
                                    : space,
                        );
                        return { ...floor, spaces: updatedSpaces };
                    }
                    return floor;
                }),
            );
        },
        [setFloors],
    );

    const changeFloorName = (floorNumber: number, newName: string) => {
        const newFloors = floors.map((floor) => {
            if (floor.number === floorNumber) {
                return { ...floor, name: newName };
            }
            return floor;
        });
        setFloors(newFloors);
    };

    const calculateTotalMeters = (floor: Floor) => {
        return floor.spaces.reduce(
            (total, space) => total + space.meters * space.amount,
            0,
        );
    };

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader>
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <BrickWall size={28} strokeWidth={1.5} />
                                    <span className="text-xl font-bold text-gray-900">
                                        Definir niveles y ambientes
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                {isOpen && (
                    <CardContent>
                        <CollapsibleContent>
                            <div className="container mx-auto p-4">
                                <div className="mb-6 flex flex-wrap gap-4">
                                    <Button onClick={addFloor} type="button">
                                        <Plus className="mr-2" /> Agregar Nivel
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                                                    }
                                                    deleteSelectedSpaces={
                                                        deleteSelectedSpaces
                                                    }
                                                    form={form}
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
