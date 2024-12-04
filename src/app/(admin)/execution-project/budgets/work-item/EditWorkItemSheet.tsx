import { useCategory } from "@/hooks/use-category";
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
    name: z.string().min(2).max(50).optional(),
    unit: z.string().min(1).max(50).optional(),
});

/**
 * Este componente abstrae la edicion de una partida o subpartida.
 * Ambos utilizan el mismo formulario, tienen la misma informacio,
 * y pueden reutilizarse.
 */
export function EditWorkItemSheet({
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
    const label = isSub ? "Subpartida" : "Partida";

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

                <EditWorkItemForm
                    onOpenChange={onOpenChange}
                    label={label}
                    data={data}
                />
            </SheetContent>
        </Sheet>
    );
}

/**
 * Edita partida o subpartida, utilizando las funciones que se pasan como props
 */
export function EditWorkItemForm({
    onOpenChange,
    data,
    label,
}: {
    onOpenChange: (open: boolean) => void;
    data: GenericTableItem;
    label: string;
}) {
    const isRegular = !!data.apuId;

    const { onEditWorkItem, editSuccess, editLoading } = useWorkItem();
    const {
        onEditSubWorkItem,
        editSuccess: subSuccess,
        editLoading: subLoading,
    } = useSubWorkItem();

    const edit = isRegular ? onEditWorkItem : onEditSubWorkItem;
    const success = isRegular ? editSuccess : subSuccess;
    const loading = isRegular ? editLoading : subLoading;

    const { fullCategoryRefetch } = useCategory();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name ?? "",
            unit: data.unit ?? undefined,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const body: WorkItemEdit = {};
        if (!!values.name) {
            body.name = values.name;
        }
        if (!!values.unit) {
            body.unit = values.unit;
        }

        edit({
            id: data.id,
            body: body,
        });
    }

    useEffect(() => {
        if (success) {
            onOpenChange(false);
            fullCategoryRefetch();
        }
    }, [success, form, onOpenChange, fullCategoryRefetch]);

    return (
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
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                Cómo se llama la {label}. Ejm: Concreto en
                                Zapatas
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem className={!data.apuId ? "hidden" : ""}>
                            <FormLabel>Unidad de medida</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="shadcn"
                                    disabled={!data.apuId}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Cuál es la unidad de medida unitaria de la{" "}
                                {label}. Ejm: m2
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={!form.formState.isDirty || loading}
                >
                    Editar
                </Button>
            </form>
        </Form>
    );
}
