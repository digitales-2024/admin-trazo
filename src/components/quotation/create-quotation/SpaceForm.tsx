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

    return (
        <div className="grid grid-flow-row items-center gap-4 lg:grid-cols-6">
            <div className="w-full">
                <Label htmlFor={`amount-${floorNumber}-${environmentIndex}`}>
                    Cantidad
                </Label>
                <Input
                    id={`amount-${floorNumber}-${environmentIndex}`}
                    type="number"
                    value={space.amount}
                    onChange={(e) =>
                        updateEnvironment(
                            floorNumber,
                            environmentIndex,
                            "amount",
                            Number(e.target.value),
                        )
                    }
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
                    value={space.meters}
                    onChange={(e) =>
                        updateEnvironment(
                            floorNumber,
                            environmentIndex,
                            "meters",
                            Number(e.target.value),
                        )
                    }
                    placeholder="m²"
                />
            </div>
        </div>
    );
}
