// HeadQuotation.tsx

import { useClients } from "@/hooks/use-client";
import {
    Captions,
    ChevronDown,
    ChevronUp,
    Building2,
    User,
    Calendar,
    LayoutDashboard,
    FileText,
} from "lucide-react";
import { useState } from "react";
import * as React from "react";

import { AutoComplete } from "@/components/ui/autocomplete";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface HeadQuotationProps {
    meses: number;
    setMeses: React.Dispatch<React.SetStateAction<number>>;
    selectedClient: string;
    setSelectedClient: React.Dispatch<React.SetStateAction<string>>;
    projectName: string;
    setProjectName: React.Dispatch<React.SetStateAction<string>>;
    landArea: number;
    setLandArea: React.Dispatch<React.SetStateAction<number>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export default function HeadQuotation({
    meses,
    setMeses,
    selectedClient,
    setSelectedClient,
    projectName,
    setProjectName,
    landArea,
    setLandArea,
    description,
    setDescription,
}: HeadQuotationProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { dataClientsAll } = useClients();

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="" onClick={() => setIsOpen(!isOpen)}>
                        <div className="flex w-full justify-between">
                            <div
                                className="flex w-full cursor-pointer items-center justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <Captions size={28} strokeWidth={1.5} />
                                    <span className="text-xl font-bold text-gray-900">
                                        Cabecera de la Cotización
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
                            <div className="space-y-6 p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="proyecto"
                                            className="flex items-center space-x-2"
                                        >
                                            <Building2 className="h-4 w-4" />
                                            <span>Nombre del Proyecto</span>
                                        </Label>
                                        <Input
                                            id="proyecto"
                                            placeholder="Ingrese el nombre del proyecto"
                                            value={projectName}
                                            onChange={(e) =>
                                                setProjectName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="propietario"
                                            className="flex items-center space-x-2"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Propietario / Cliente</span>
                                        </Label>
                                        <AutoComplete
                                            options={(dataClientsAll ?? []).map(
                                                (client) => ({
                                                    value: client.id,
                                                    label: client.name,
                                                }),
                                            )}
                                            placeholder="Selecciona un cliente"
                                            emptyMessage="No se encontraron clientes"
                                            value={{
                                                value: selectedClient,
                                                label:
                                                    dataClientsAll?.find(
                                                        (client) =>
                                                            client.id ===
                                                            selectedClient,
                                                    )?.name || "",
                                            }}
                                            onValueChange={(option) => {
                                                setSelectedClient(option.value);
                                            }}
                                            className="z-50"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="plazo"
                                            className="flex items-center space-x-2"
                                        >
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Plazo de Entrega (Meses)
                                            </span>
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Slider
                                                id="plazo"
                                                min={1}
                                                max={36}
                                                value={[meses]}
                                                onValueChange={(value) =>
                                                    setMeses(value[0])
                                                }
                                                className="flex-grow"
                                            />
                                            <span className="font-normal text-black">
                                                {meses}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="area"
                                            className="flex items-center space-x-2"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Área del Terreno (m²)</span>
                                        </Label>
                                        <Input
                                            id="area"
                                            type="number"
                                            placeholder="Ingrese el área en m²"
                                            value={landArea}
                                            onChange={(e) =>
                                                setLandArea(
                                                    parseFloat(e.target.value),
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="descripcion"
                                        className="flex items-center space-x-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>Descripción del Proyecto</span>
                                    </Label>
                                    <Textarea
                                        id="descripcion"
                                        placeholder="Ingrese una breve descripción del proyecto"
                                        className="min-h-[100px] transition-all duration-200 ease-in-out focus:min-h-[150px]"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
}
