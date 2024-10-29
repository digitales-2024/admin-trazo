"use client";

import { useSpaces } from "@/hooks/use-space";
import { Space } from "@/types";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Combobox } from "./ComboboxSpace";

interface EnvironmentFormProps {
    space: Space;
    floorNumber: number;
    environmentIndex: number;
    updateEnvironment: (
        floorNumber: number,
        environmentIndex: number,
        field: "name" | "meters" | "amount",
        value: string | number,
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

    return (
        <div className="grid grid-flow-row items-center gap-4 lg:grid-cols-6">
            <div className="w-full">
                <Label htmlFor={`amount-${floorNumber}-${environmentIndex}`}>
                    Cantidad
                </Label>
                <Input
                    id={`amount-${floorNumber}-${environmentIndex}`}
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Cantidad"
                />
            </div>
            <div className="col-span-3">
                <Label
                    htmlFor={`environment-${floorNumber}-${environmentIndex}`}
                >
                    Nombre
                </Label>
                <div className="col-span-3">
                    <Combobox
                        dataSpacesAll={dataSpacesAll}
                        value={selectedSpace}
                        setValue={(value) => {
                            setSelectedSpace(value);
                            updateEnvironment(
                                floorNumber,
                                environmentIndex,
                                "name",
                                value,
                            );
                        }}
                    />
                </div>
            </div>
            <div className="col-span-2">
                <Label htmlFor={`meters-${floorNumber}-${environmentIndex}`}>
                    Metros cuadrados
                </Label>
                <Input
                    id={`meters-${floorNumber}-${environmentIndex}`}
                    type="number"
                    value={meters}
                    onChange={handleMetersChange}
                    placeholder="m²"
                />
            </div>
        </div>
    );
}
