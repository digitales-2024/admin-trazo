import { useCategory } from "@/hooks/use-category";
import { useSubcategory } from "@/hooks/use-subcategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

const formSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "El nombre debe tener al menos 2 caracteres",
        })
        .max(50, {
            message: "El nombre debe tener 50 caracteres como máximo",
        }),
});
type FormSchema = z.infer<typeof formSchema>;

export function CreateSubCategoryDialog({
    categoryId,
    open,
    setOpen,
}: {
    categoryId: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const { fullCategoryRefetch } = useCategory();
    const { createSubcategory } = useSubcategory();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(values: FormSchema) {
        await createSubcategory({
            name: values.name,
            categoryId,
        });
        fullCategoryRefetch();
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear una Subategoría</DialogTitle>
                    <DialogDescription>
                        Ingrese el nombre de la Subcategoría.
                    </DialogDescription>
                </DialogHeader>

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
                                            placeholder="Nombre"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        El nombre de la nueva subcategoría
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Crear subcategoría</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
