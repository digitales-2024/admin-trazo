import { useCategory } from "@/hooks/use-category";
import { useSubcategory } from "@/hooks/use-subcategory";
import { GenericTableItem } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
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
    name: z
        .string()
        .min(2, {
            message: "El nombre debe tener al menos 2 caracteres",
        })
        .max(50, {
            message: "El nombre debe tener hasta 50 caracteres",
        }),
});

export function EditSubCategorySheet({
    open,
    data,
    setOpen,
}: {
    open: boolean;
    data: GenericTableItem;
    setOpen: (open: boolean) => void;
}) {
    const { fullCategoryRefetch } = useCategory();
    const { updateSubcategory } = useSubcategory();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await updateSubcategory({
            id: data.id,
            name: values.name,
        });
        await fullCategoryRefetch();
        form.reset();
        setOpen(false);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex flex-col items-start gap-2">
                        Editar Subcategoria
                    </SheetTitle>
                    <SheetDescription>
                        Actualiza la información de la Subcategoría.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="nombre"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        El nombre de la subcategoría
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty}
                        >
                            Actualizar
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
