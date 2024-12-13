import { useCategory } from "@/hooks/use-category";
import { useWorkItem } from "@/hooks/use-workitem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CreateWorkItemDialog({
    open,
    onOpenChange,
    subcategoryId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subcategoryId: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear una partida</DialogTitle>
                    <DialogDescription>
                        Seleccione el tipo de partida y complete la información.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="apu">
                    <TabsList className="grid w-full grid-cols-2 text-lg">
                        <TabsTrigger value="apu">Partida con APU</TabsTrigger>
                        <TabsTrigger value="subworkitem">
                            Partida con Subpartidas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="apu" className="space-y-4">
                        <CreateWithApuForm
                            setOpen={onOpenChange}
                            subcategoryId={subcategoryId}
                        />
                    </TabsContent>
                    <TabsContent value="subworkitem">
                        <CreateWithSubitemsForm
                            setOpen={onOpenChange}
                            subcategoryId={subcategoryId}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

const withApuSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "El nombre de la partida debe tener al menos 2 caracteres",
        })
        .max(50),
    unit: z
        .string()
        .min(1, {
            message: "La unidad de la partida debe tener al menos 1 caracter",
        })
        .max(50),
    apuPerformance: z.coerce
        .number({
            message: "El rendimiento debe ser un número",
        })
        .min(0, {
            message: "El rendimiento debe ser un número positivo",
        }),
    apuWorkHours: z.coerce
        .number({
            message: "Las horas de trabajo deben ser un número",
        })
        .min(0, {
            message: "Las horas de trabajo deben ser un número",
        }),
});

function CreateWithApuForm({
    setOpen,
    subcategoryId,
}: {
    setOpen: (v: boolean) => void;
    subcategoryId: string;
}) {
    const { fullCategoryRefetch: nestedRefetch } = useCategory();
    const { onCreate, createLoading, createSuccess } = useWorkItem();
    const form = useForm<z.infer<typeof withApuSchema>>({
        resolver: zodResolver(withApuSchema),
        defaultValues: {
            name: "",
            unit: "",
            apuPerformance: undefined,
            apuWorkHours: undefined,
        },
    });

    function onSubmit(values: z.infer<typeof withApuSchema>) {
        onCreate({
            subcategoryId,
            name: values.name,
            unit: values.unit,
            apu: {
                workHours: values.apuWorkHours,
                performance: values.apuPerformance,
                resources: [],
            },
        });
    }

    useEffect(() => {
        if (createSuccess) {
            form.reset();
            nestedRefetch();
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createSuccess, setOpen, nestedRefetch]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nombre de la partida"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Cómo se llama la partida. Ejm: Limpieza de
                                terreno
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unidad de medida</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Unidad de la partida"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Cuál es la unidad de medida unitaria de la
                                partida. Ejm: m2
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tabs para seleccionar APU o subpartida */}
                <hr />

                <FormField
                    control={form.control}
                    name="apuPerformance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rendimiento del APU</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Rendimiento"
                                    {...field}
                                    type="number"
                                />
                            </FormControl>
                            <FormDescription>
                                Rendimiento a aplicar a todo el APU. Ejm: 25.00
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="apuWorkHours"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horas de trabajo</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Horas de trabajo"
                                    type="number"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Cuantas horas dura la jornada de la mano de
                                obra, en horas. Ejm: 8
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <p className="text-sm">
                    Podras agregar recursos a este APU más adelante, despues de
                    confirmar la creación de esta partida
                </p>

                {/* Boton para crear partida */}
                <div className="text-right">
                    <Button disabled={!form.formState.isDirty || createLoading}>
                        Crear partida
                    </Button>
                </div>
            </form>
        </Form>
    );
}

const withSubitemsSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "El nombre de la partida debe tener al menos 1 caracter",
        })
        .max(50),
});

function CreateWithSubitemsForm({
    setOpen,
    subcategoryId,
}: {
    setOpen: (v: boolean) => void;
    subcategoryId: string;
}) {
    const { fullCategoryRefetch: nestedRefetch } = useCategory();
    const { onCreate, createLoading, createSuccess } = useWorkItem();
    const form = useForm<z.infer<typeof withSubitemsSchema>>({
        resolver: zodResolver(withSubitemsSchema),
        defaultValues: {
            name: "",
        },
    });
    function onSubmit(values: z.infer<typeof withSubitemsSchema>) {
        onCreate({
            subcategoryId,
            name: values.name,
        });
    }

    useEffect(() => {
        if (createSuccess) {
            form.reset();
            nestedRefetch();
            setOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createSuccess, setOpen, nestedRefetch]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nombre de la partida"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Cómo se llama la partida. Ejm: Limpieza de
                                terreno
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <p className="text-sm">
                    Podrás crear varias subpartidas despues de confirmar la
                    creación de esta partida.
                </p>

                {/* Boton para crear partida */}
                <div className="text-right">
                    <Button disabled={!form.formState.isDirty || createLoading}>
                        Crear partida
                    </Button>
                </div>
            </form>
        </Form>
    );
}
