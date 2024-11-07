"use client";
import { useClients } from "@/hooks/use-client";
import { QuotationStructure } from "@/types";
import { Captions, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface HeadQuotationProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    form: UseFormReturn<QuotationStructure>;
    clientIdUpdate?: string;
}

export const HeadQuotation = ({ form, clientIdUpdate }: HeadQuotationProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { dataClientsAll } = useClients();

    // Generate client options from fetched clients
    const clientOptions: Option[] = (dataClientsAll ?? []).map((client) => ({
        value: client.id.toString(),
        label: client.name,
    }));

    // Function to update the client ID in the form when selected
    const handleClientChange = useCallback(
        (clientId: string) => {
            const selectedClient = clientOptions.find(
                (option) => option.value === clientId,
            );
            if (selectedClient) {
                form.setValue("clientId", selectedClient.value);
            } else {
                form.setValue("clientId", "");
            }
        },
        [clientOptions, form],
    );

    // Update the selected client when clientIdUpdate or clientOptions change
    useEffect(() => {
        if (clientIdUpdate && clientOptions.length > 0) {
            handleClientChange(clientIdUpdate);
        }
    }, [clientIdUpdate, clientOptions, handleClientChange]);

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="">
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
                            <div className="flex flex-col gap-6 p-4 sm:p-0">
                                {/* Campo de Nombre del Proyecto */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="name">
                                                Nombre del Proyecto
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    placeholder="Ingrese el nombre del proyecto"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Cliente */}
                                <FormField
                                    control={form.control}
                                    name="clientId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="clientId">
                                                Propietario / Cliente
                                            </FormLabel>
                                            <FormControl>
                                                <AutoComplete
                                                    options={clientOptions}
                                                    placeholder="Selecciona un cliente"
                                                    emptyMessage="No se encontraron clientes"
                                                    value={
                                                        clientOptions.find(
                                                            (option) =>
                                                                option.value ===
                                                                field.value,
                                                        ) || undefined
                                                    }
                                                    onValueChange={(option) => {
                                                        field.onChange(
                                                            option?.value || "",
                                                        );
                                                    }}
                                                    className="z-50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Plazo de Entrega */}
                                <FormField
                                    control={form.control}
                                    name="deliveryTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="deliveryTime">
                                                Plazo de Entrega (Meses)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex items-center space-x-2">
                                                    <Slider
                                                        id="deliveryTime"
                                                        min={1}
                                                        max={36}
                                                        value={[field.value]}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            field.onChange(
                                                                value[0],
                                                            )
                                                        }
                                                        className="flex-grow"
                                                    />
                                                    <span className="font-normal text-black">
                                                        {field.value}
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Área del Terreno */}
                                <FormField
                                    control={form.control}
                                    name="landArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="landArea">
                                                Área del Terreno (m²)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="landArea"
                                                    type="number"
                                                    placeholder="Ingrese el área en m²"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo de Descripción */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="description">
                                                Descripción del Proyecto
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Ingrese una breve descripción del proyecto"
                                                    className="min-h-[100px] transition-all duration-200 ease-in-out focus:min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                )}
            </Collapsible>
        </Card>
    );
};
