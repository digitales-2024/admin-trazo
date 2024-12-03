import { useWorkItem } from "@/hooks/use-workitem";
import { GenericTableItem } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    unit: z.string().min(2).max(50).optional(),
});

export function EditWorkItemSheet({
    open,
    onOpenChange,
    data,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: GenericTableItem;
}) {
    const { onEditWorkItem, editSuccess, editLoading } = useWorkItem();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name ?? "",
            unit: data.unit ?? "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        onEditWorkItem({
            id: data.id,
            body: values,
        });
    }

    useEffect(() => {
        if (editSuccess) {
            onOpenChange(false);
        }
    }, [editSuccess, form, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex flex-col items-start gap-2">
                        Editar Partida
                    </SheetTitle>
                    <SheetDescription>
                        Actualiza la información de la partida.
                        <br />
                        Para actualizar el APU vinculado a esta partida ve a la
                        sección de APU.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 pt-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="shadcn"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Cómo se llama la subpartida. Ejm:
                                        Concreto en Zapatas
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!!data.apuId && (
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidad de medida</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Cuál es la unidad de medida unitaria
                                            de la subpartida. Ejm: m2
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || editLoading}
                        >
                            Editar
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
