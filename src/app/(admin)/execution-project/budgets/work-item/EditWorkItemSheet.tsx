import { useSubWorkItem } from "@/hooks/use-subworkitem";
import { useWorkItem } from "@/hooks/use-workitem";
import { GenericTableItem } from "@/types/category";
import { WorkItemEdit } from "@/types/workitem";
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

export function EditWorkItemSheetWrapper({
    open,
    onOpenChange,
    data,
    isSub = false,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: GenericTableItem;
    isSub?: boolean;
}) {
    const { onEditWorkItem, editSuccess, editLoading } = useWorkItem();
    const {
        onEditSubWorkItem,
        editSuccess: subSuccess,
        editLoading: subLoading,
    } = useSubWorkItem();
    const label = isSub ? "Subpartida" : "Partida";

    if (isSub) {
        return (
            <EditWorkItemSheet
                open={open}
                onOpenChange={onOpenChange}
                data={data}
                edit={onEditSubWorkItem}
                success={subSuccess}
                loading={subLoading}
                label={label}
            />
        );
    } else {
        return (
            <EditWorkItemSheet
                open={open}
                onOpenChange={onOpenChange}
                data={data}
                edit={onEditWorkItem}
                success={editSuccess}
                loading={editLoading}
                label={label}
            />
        );
    }
}

export function EditWorkItemSheet({
    open,
    onOpenChange,
    data,
    edit,
    success,
    loading,
    label,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: GenericTableItem;
    isSub?: boolean;
    edit: (v: { body: WorkItemEdit; id: string }) => Promise<string | number>;
    success: boolean;
    loading: boolean;
    label: string;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name ?? "",
            unit: data.unit ?? "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        edit({
            id: data.id,
            body: values,
        });
    }

    useEffect(() => {
        if (success) {
            onOpenChange(false);
        }
    }, [success, form, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex flex-col items-start gap-2">
                        Editar {label}
                    </SheetTitle>
                    <SheetDescription>
                        Actualiza la información de la {label}.
                        <br />
                        {!!data.apuId && (
                            <>
                                Para actualizar el APU vinculado a esta {label}{" "}
                                ve a la sección de APU.
                            </>
                        )}
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
                            disabled={!form.formState.isDirty || loading}
                        >
                            Editar
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
