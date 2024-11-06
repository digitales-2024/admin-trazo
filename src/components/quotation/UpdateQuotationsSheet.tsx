"use client";

import { useClients } from "@/hooks/use-client";
import { useQuotations } from "@/hooks/use-quotation";
import {
    createQuotationSchema,
    CreateQuotationSchema,
} from "@/schemas/quotations/createQuotationSchema";
import { QuotationSummary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

const infoSheet = {
    title: "Actualizar Cotización",
    description:
        "Actualiza la información de la cotización y guarda los cambios",
};

interface UpdateClientSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    quotation: QuotationSummary;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateClientSheet({
    quotation,
    open,
    onOpenChange,
}: UpdateClientSheetProps) {
    const { onUpdateClient, isSuccessUpdateClient, isLoadingUpdateClient } =
        useClients();

    const { quotationById } = useQuotations({
        id: quotation.id,
    });

    const { dataClientsAll } = useClients();

    const clientOptions: Option[] = (dataClientsAll ?? []).map((client) => ({
        value: client.id,
        label: client.name,
    }));

    const form = useForm<CreateQuotationSchema>({
        resolver: zodResolver(createQuotationSchema),
        defaultValues: {
            name: quotation.name ?? "",
            clientId: quotation.client.id ?? "",
            deliveryTime: quotationById?.deliveryTime ?? 0,
            landArea: quotationById?.landArea ?? 0,
            description: quotationById?.description ?? "",
            discount: quotationById?.discount ?? 0,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: quotation.name ?? "",
                clientId: quotation.client.id ?? "",
                deliveryTime: quotationById?.deliveryTime ?? 0,
                landArea: quotationById?.landArea ?? 0,
                description: quotationById?.description ?? "",
                discount: quotationById?.discount ?? 0,
            });
        }
    }, [open, quotation, quotationById, form]);

    const onSubmit = async (input: CreateQuotationSchema) => {
        onUpdateClient({
            ...input,
            id: quotation.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateClient) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessUpdateClient, form, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="flex flex-col gap-6 sm:max-w-md"
                tabIndex={undefined}
            >
                <SheetHeader className="text-left">
                    <SheetTitle className="flex flex-col items-start">
                        {infoSheet.title}
                        <Badge
                            className="bg-emerald-100 text-emerald-700"
                            variant="secondary"
                        >
                            {quotation.name}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="mt-4 w-full gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 p-4"
                        >
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
                                                        option.value,
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
                                                        ),
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

                            <Separator className="my-4" />

                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="discount">
                                            Descuento (%)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="discount"
                                                type="number"
                                                placeholder="Ingrese el descuento"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoadingUpdateClient}
                                    >
                                        {isLoadingUpdateClient && (
                                            <RefreshCcw
                                                className="mr-2 h-4 w-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Actualizar
                                    </Button>
                                    <SheetClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </SheetClose>
                                </div>
                            </SheetFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
