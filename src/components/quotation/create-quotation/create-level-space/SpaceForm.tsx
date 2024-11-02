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
        field: "name" | "meters" | "amount" | "selected" | "spaceId",
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
    const [selectedSpaceId, setSelectedSpaceId] = React.useState<string>(
        space.spaceId || "",
    );
    const [selectedSpaceName, setSelectedSpaceName] = React.useState<string>(
        space.name,
    );
    const [amount, setAmount] = React.useState<number>(space.amount || 1);
    const [meters, setMeters] = React.useState<number>(space.meters);
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

    const handleCheckboxChange = (checked: boolean) => {
        setIsSelected(checked);
        updateEnvironment(floorNumber, environmentIndex, "selected", checked);
    };

    const handleSpaceChange = (option: { value: string; label: string }) => {
        setSelectedSpaceId(option.value);
        setSelectedSpaceName(option.label);
        updateEnvironment(
            floorNumber,
            environmentIndex,
            "spaceId",
            option.value,
        );
        updateEnvironment(floorNumber, environmentIndex, "name", option.label);
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
                        htmlFor={`space-${floorNumber}-${environmentIndex}`}
                    >
                        Espacio
                    </Label>

                    <AutoComplete
                        options={dataSpacesAll.map((spaceItem) => ({
                            value: spaceItem.id,
                            label: spaceItem.name,
                        }))}
                        placeholder="Selecciona un espacio"
                        emptyMessage="No se encontraron espacios"
                        value={{
                            value: selectedSpaceId,
                            label: selectedSpaceName,
                        }}
                        onValueChange={handleSpaceChange}
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
