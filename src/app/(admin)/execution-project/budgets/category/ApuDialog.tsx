import { useApuByIdQuery } from "@/redux/services/apuApi";
import { ApuReturnNested } from "@/types/apu";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorPage } from "@/components/common/ErrorPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
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

import { cn } from "@/lib/utils";

export function ApuDialog({
    apuId,
    parentName,
}: {
    apuId: string;
    parentName: string;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>APU</Button>
            </DialogTrigger>
            <DialogContent className={cn("max-w-4xl")}>
                <DialogTitle>APU - {parentName}</DialogTitle>
                <DialogDescription>
                    Edita el APU, agrega o elimina recursos.
                </DialogDescription>

                <ApuContent id={apuId} />
            </DialogContent>
        </Dialog>
    );
}

function ApuContent({ id }: { id: string }) {
    const { data, isLoading } = useApuByIdQuery(id);

    if (isLoading) {
        return <div>Cargando información del APU</div>;
    }

    if (!data) {
        return (
            <div>
                <ErrorPage />
            </div>
        );
    }

    return (
        <div>
            <ApuForm apu={data} />
        </div>
    );
}

const formSchema = z.object({
    performance: z.coerce.number(),
    workHours: z.coerce.number(),
});
type FormSchema = z.infer<typeof formSchema>;

function ApuForm({ apu }: { apu: ApuReturnNested }) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            performance: apu.performance,
            workHours: apu.workHours,
        },
    });

    function onSubmit(data: FormSchema) {
        console.log(":D", data);
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="workHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Horas de trabajo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Horas de trabajo"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Cuantas horas dura la jornada de la mano
                                        de obra, en horas. Ejm: 8
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="performance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rendimiento</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Rendimiento"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Rendimiento a aplicar a todo el APU.
                                        Ejm: 25.00
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <h2 className="pb-2 font-medium leading-none">
                            Recursos
                        </h2>

                        <div className="grid max-h-[50vh] gap-4 overflow-y-scroll">
                            <Card className="p-4">
                                <h3 className="grid grid-cols-[auto_2.5rem] items-center pb-2 font-medium leading-none">
                                    <span>Mano de obra</span>
                                    <Button variant="outline" size="icon">
                                        <Plus />
                                    </Button>
                                </h3>

                                <div className="grid grid-cols-[auto_repeat(5,5rem)] gap-2">
                                    <span className="text-sm">Descripcion</span>
                                    <span className="text-center text-sm">
                                        Unidad
                                    </span>
                                    <span className="text-center text-sm">
                                        Cuadrilla
                                    </span>
                                    <span className="text-center text-sm">
                                        Cantidad
                                    </span>
                                    <span className="text-right text-sm">
                                        Precio
                                    </span>
                                    <span className="text-right text-sm">
                                        Parcial
                                    </span>

                                    <span>Capataz</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>

                                    <span>Operario</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>

                                    <span>Capataz</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>
                                    <span>Capataz</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>
                                    <span>Capataz</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>
                                    <span>Capataz</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>
                                    <span>Capataz</span>
                                    <span className="text-center">HH</span>
                                    <span className="text-center">0.100</span>
                                    <span className="text-center">0.0320</span>
                                    <span className="text-right">19.89</span>
                                    <span className="text-right">0.64</span>
                                </div>
                                <div className="text-right font-bold">
                                    Subtotal: S/. 322
                                </div>
                            </Card>
                            <Card className="p-4">
                                <h3 className="grid grid-cols-[auto_2.5rem] items-center pb-2 font-medium leading-none">
                                    <span>Herramientas</span>
                                    <Button variant="outline" size="icon">
                                        <Plus />
                                    </Button>
                                </h3>
                            </Card>
                            <Card className="p-4">
                                <h3 className="grid grid-cols-[auto_2.5rem] items-center pb-2 font-medium leading-none">
                                    <span>Suministros</span>
                                    <Button variant="outline" size="icon">
                                        <Plus />
                                    </Button>
                                </h3>
                            </Card>
                            <Card className="p-4">
                                <h3 className="grid grid-cols-[auto_2.5rem] items-center pb-2 font-medium leading-none">
                                    <span>Servicios</span>
                                    <Button variant="outline" size="icon">
                                        <Plus />
                                    </Button>
                                </h3>
                            </Card>
                        </div>
                    </div>

                    <div>
                        <h2 className="pb-2 font-medium leading-none">
                            Costo unitario
                        </h2>
                        <p className="pb-2 text-[0.8rem] text-muted-foreground">
                            Calculado automáticamente considerando el
                            rendimiento, horas de trabajo y recursos.
                        </p>
                        <p>S/. {apu.unitCost}</p>
                    </div>

                    <Button type="submit" disabled={!form.formState.isDirty}>
                        Guardar cambios
                    </Button>
                </form>
            </Form>
        </div>
    );
}
