"use client";

import { useClients } from "@/hooks/use-client";
import {
    clientsSchema,
    CreateClientsSchema,
} from "@/schemas/clients/createClientSchema";
import { Client } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Textarea } from "../ui/textarea";

const infoSheet = {
    title: "Actualizar Producto",
    description: "Actualiza la información del producto y guarda los cambios",
};

interface UpdateProductSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    product: Client;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateProductSheet({
    product,
    open,
    onOpenChange,
}: UpdateProductSheetProps) {
    const { onUpdateClient, isSuccessUpdateClient, isLoadingUpdateClient } =
        useClients();

    const form = useForm<CreateClientsSchema>({
        resolver: zodResolver(clientsSchema),
        defaultValues: {
            name: product.name ?? "",
            rucDni: product.rucDni ?? "",
            phone: product.phone ?? "",
            address: product.address ?? "",
            province: product.province ?? "",
            department: product.department ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: product.name ?? "",
                rucDni: product.rucDni ?? "",
                phone: product.phone ?? "",
                address: product.address ?? "",
                province: product.province ?? "",
                department: product.department ?? "",
            });
        }
    }, [open, product, form]);

    const onSubmit = async (input: CreateClientsSchema) => {
        onUpdateClient({
            ...input,
            id: product.id,
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
                            {product.name}
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
                            {/* Nombre */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre del Producto
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Descripción */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ingrese la descripción del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Precio */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el precio del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Categoría */}
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(value)
                                                }
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger className="capitalize">
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {data?.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                    className="capitalize"
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
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
