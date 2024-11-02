import { Floor } from "@/types";
import { Edit2, Trash, Plus, Copy } from "lucide-react";
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
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

import { SpaceForm } from "./SpaceForm";

interface LevelAccordionItemProps {
    floor: Floor;
    deleteFloor: (floorNumber: number) => void;
    changeFloorName: (floorNumber: number, newName: string) => void;
    updateSpace: (
        floorNumber: number,
        spaceIndex: number,
        field: "name" | "meters" | "amount" | "selected" | "spaceId",
        value: string | number | boolean,
    ) => void;
    addSpace: (floorNumber: number) => void;
    calculateTotalMeters: (floor: Floor) => number;
    duplicateFloor: (floorNumber: number) => void;
    deleteSelectedSpaces: (floorNumber: number) => void;
}

export function LevelAccordionItem({
    floor,
    deleteFloor,
    changeFloorName,
    updateSpace,
    addSpace,
    calculateTotalMeters,
    duplicateFloor,
    deleteSelectedSpaces,
}: LevelAccordionItemProps) {
    const [newName, setNewName] = useState(floor.name);
    const [dialogOpen, setDialogOpen] = useState(false);

    const selectedSpacesCount = floor.spaces.filter(
        (space) => space.selected,
    ).length;

    return (
        <AccordionItem
            key={floor.number}
            value={`floor-${floor.number}`}
            className=""
        >
            <AccordionTrigger>
                <div className="flex w-full items-center justify-between">
                    <span>{floor.name}</span>
                </div>
            </AccordionTrigger>
            <div className="flex items-center justify-end">
                <TooltipProvider>
                    {/* Botón para editar el nombre del nivel */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => setDialogOpen(true)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Editar nivel</span>
                        </TooltipContent>
                    </Tooltip>

                    {/* Botón para duplicar el nivel */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => duplicateFloor(floor.number)}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Duplicar nivel</span>
                        </TooltipContent>
                    </Tooltip>

                    {/* Botón para eliminar el nivel */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => deleteFloor(floor.number)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Eliminar nivel</span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Dialog para editar el nombre */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <></>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cambiar nombre del nivel</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nuevo nombre del nivel"
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
                                    changeFloorName(floor.number, newName);
                                    setDialogOpen(false);
                                }}
                            >
                                Aceptar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <AccordionContent className="z-[999] h-fit">
                <Card>
                    <CardContent className="p-4">
                        <div className="mb-6">
                            <div className="flex flex-col gap-4 xl:flex-row">
                                <Button onClick={() => addSpace(floor.number)}>
                                    <Plus className="mr-2" /> Añadir ambiente
                                </Button>
                                {selectedSpacesCount > 0 && (
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            deleteSelectedSpaces(floor.number)
                                        }
                                    >
                                        <Trash className="mr-2" />
                                        Eliminar ambientes (
                                        {selectedSpacesCount})
                                    </Button>
                                )}
                            </div>
                        </div>
                        {floor.spaces.map((space, index) => (
                            <SpaceForm
                                key={index}
                                space={space}
                                floorNumber={floor.number}
                                environmentIndex={index}
                                updateEnvironment={updateSpace}
                            />
                        ))}
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
