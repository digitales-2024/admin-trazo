import { Floor } from "@/types";
import { Edit2, Trash, Plus, Copy } from "lucide-react"; // Importa el icono Copy
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
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
    duplicateFloor: (floorNumber: number) => void;
    deleteSpace: (floorNumber: number, spaceIndex: number) => void; // Nueva función
}

export function LevelAccordionItem({
    floor,
    deleteFloor,
    changeFloorName,
    updateSpace,
    addSpace,
    calculateTotalMeters,
    duplicateFloor,
    deleteSpace, // Nueva función
}: LevelAccordionItemProps) {
    const [newName, setNewName] = useState(floor.name);
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <AccordionItem key={floor.number} value={`floor-${floor.number}`}>
            <AccordionTrigger>
                <div className="flex w-full items-center justify-between">
                    <span>{floor.name}</span>
                    <div className="flex items-center">
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
                                        onClick={() =>
                                            duplicateFloor(floor.number)
                                        }
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
                                        onClick={() =>
                                            deleteFloor(floor.number)
                                        }
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
                                    <DialogTitle>
                                        Cambiar nombre del nivel
                                    </DialogTitle>
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
                                deleteSpace={deleteSpace} // Pasar la función deleteSpace
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
