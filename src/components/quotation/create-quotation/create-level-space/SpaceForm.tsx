"use client";

import { useSpaces } from "@/hooks/use-space";
import { Space } from "@/types";
import * as React from "react";

import { AutoComplete } from "@/components/ui/autocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EnvironmentFormProps {
    space: Space;
    floorNumber: number;
    environmentIndex: number;
    updateEnvironment: (
        floorNumber: number,
        environmentIndex: number,
        field: "name" | "meters" | "amount" | "selected",
        value: string | number | boolean,
    ) => void;
}

export function SpaceForm({
    space,
    floorNumber,
    environmentIndex,
    updateEnvironment,
}: EnvironmentFormProps) {
    const { dataSpacesAll = [] } = useSpaces();
    const [selectedSpace, setSelectedSpace] = React.useState(space.name);
    const [amount, setAmount] = React.useState(space.amount || 1);
    const [meters, setMeters] = React.useState(space.meters);
    const [isSelected, setIsSelected] = React.useState<boolean>(
        space.selected || false,
    );

    React.useEffect(() => {
        setIsSelected(space.selected || false);
    }, [space.selected]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(e.target.value));
        setAmount(value);
        updateEnvironment(floorNumber, environmentIndex, "amount", value);
    };

    const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setMeters(value);
        updateEnvironment(floorNumber, environmentIndex, "meters", value);
    };

    // Ajuste del manejador para onCheckedChange
    const handleCheckboxChange = (checked: boolean) => {
        setIsSelected(checked);
        updateEnvironment(floorNumber, environmentIndex, "selected", checked);
    };

    return (
        <div className="grid grid-cols-1 items-center gap-2 pb-4">
            <div className="flex flex-row items-end justify-end gap-2">
                <Checkbox
                    id={`checkbox-${floorNumber}-${environmentIndex}`}
                    checked={isSelected}
                    onCheckedChange={handleCheckboxChange}
                    className="mb-4"
                />
                <div>
                    <Label
                        className="truncate"
                        htmlFor={`amount-${floorNumber}-${environmentIndex}`}
                    >
                        Cantidad
                    </Label>
                    <Input
                        id={`amount-${floorNumber}-${environmentIndex}`}
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Cantidad"
                        className="w-16"
                    />
                </div>
                <div className="w-full">
                    <Label
                        className="truncate"
                        htmlFor={`environment-${floorNumber}-${environmentIndex}`}
                    >
                        Nombre
                    </Label>

                    <AutoComplete
                        options={dataSpacesAll.map((space) => ({
                            value: space.name,
                            label: space.name,
                        }))}
                        placeholder="Selecciona un espacio"
                        emptyMessage="No se encontraron espacios"
                        value={{
                            value: selectedSpace,
                            label: selectedSpace,
                        }}
                        onValueChange={(option) => {
                            setSelectedSpace(option.value);
                            updateEnvironment(
                                floorNumber,
                                environmentIndex,
                                "name",
                                option.value,
                            );
                        }}
                        className="z-50"
                    />
                </div>
                <div className="">
                    <Label
                        className="truncate"
                        htmlFor={`meters-${floorNumber}-${environmentIndex}`}
                    >
                        Área (m²)
                    </Label>
                    <Input
                        id={`meters-${floorNumber}-${environmentIndex}`}
                        type="number"
                        value={meters}
                        onChange={handleMetersChange}
                        placeholder="m²"
                        className="w-14"
                    />
                </div>
            </div>
        </div>
    );
}
