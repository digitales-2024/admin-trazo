import { UpdateQuotationSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
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

interface FormFieldsProps {
    form: UseFormReturn<UpdateQuotationSchema>;
    clientOptions: Option[];
}

export function FormFields({ form, clientOptions }: FormFieldsProps) {
    return (
        <>
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
                                            option.value === field.value,
                                    ) || undefined
                                }
                                onValueChange={(option) =>
                                    field.onChange(option.value)
                                }
                                className="z-50"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

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
                                    onValueChange={(value) =>
                                        field.onChange(value[0])
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
                                    field.onChange(parseFloat(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

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
        </>
    );
}
