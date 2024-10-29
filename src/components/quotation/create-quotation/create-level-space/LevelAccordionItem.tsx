import { Floor } from "@/types";
import { Edit2, Trash, Plus } from "lucide-react";
import { useState } from "react";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { SpaceForm } from "./SpaceForm";

interface LevelAccordionItemProps {
    floor: Floor;
    deleteFloor: (floorNumber: number) => void;
    changeFloorName: (floorNumber: number, newName: string) => void;
    updateSpace: (
        floorNumber: number,
        spaceIndex: number,
        field: "name" | "meters" | "amount",
        value: string | number,
    ) => void;
    addSpace: (floorNumber: number) => void;
    calculateTotalMeters: (floor: Floor) => number;
}

export function LevelAccordionItem({
    floor,
    deleteFloor,
    changeFloorName,
    updateSpace,
    addSpace,
    calculateTotalMeters,
}: LevelAccordionItemProps) {
    const [newName, setNewName] = useState(floor.name);
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <AccordionItem key={floor.number} value={`floor-${floor.number}`}>
            <AccordionTrigger>
                <div className="flex w-full items-center justify-between">
                    <span>{floor.name}</span>
                    <div className="flex items-center">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => setDialogOpen(true)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Cambiar nombre del nivel
                                    </DialogTitle>
                                </DialogHeader>
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="New floor name"
                                />
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setNewName(floor.name);
                                            setDialogOpen(false);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="ml-2"
                                        onClick={() => {
                                            changeFloorName(
                                                floor.number,
                                                newName,
                                            );
                                            setDialogOpen(false);
                                        }}
                                    >
                                        Aceptar
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() => deleteFloor(floor.number)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="pt-6">
                        {floor.spaces.map((space, index) => (
                            <SpaceForm
                                key={index}
                                space={space}
                                floorNumber={floor.number}
                                environmentIndex={index}
                                updateEnvironment={updateSpace}
                            />
                        ))}
                        <Button
                            onClick={() => addSpace(floor.number)}
                            className="mt-4 w-full"
                        >
                            <Plus className="mr-2" /> Añadir ambiente
                        </Button>
                        <div className="mt-4 text-right">
                            <strong>
                                Total m² del nivel:{" "}
                                {calculateTotalMeters(floor)}
                            </strong>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    );
}
