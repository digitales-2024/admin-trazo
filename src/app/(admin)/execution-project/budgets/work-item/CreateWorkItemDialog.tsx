import { useWorkItem } from "@/hooks/use-workitem";
import { WorkItemCreate } from "@/types/workitem";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "El nombre de la partida debe tener al menos 2 caracteres",
        })
        .max(50),
    unit: z
        .string()
        .min(2, {
            message: "La unidad de la partida debe tener al menos 2 caracteres",
        })
        .max(50),
    // both of these are manually validated on submit
    apuPerformance: z.string().optional(),
    apuWorkHours: z.string().optional(),
});

export function CreateWorkItemDialog() {
    const [open, setOpen] = useState(false);
    // Used to show a custom error in the form.
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedTab, setSelectedTab] = useState("apu");
    const { onCreate, createLoading, createSuccess } = useWorkItem();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            unit: "",
            apuPerformance: "",
            apuWorkHours: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setErrorMsg("");
        const createData: WorkItemCreate = {
            unit: values.unit,
            name: values.name,
        };

        if (selectedTab === "apu") {
            // if APU is selected, both fields should be filled, and be numbers
            const apuPerformance = values.apuPerformance;
            const apuWorkHours = values.apuWorkHours;

            if (apuPerformance === "") {
                setErrorMsg("El rendimiento del APU no puede estar vacio.");
                return;
            }
            if (apuWorkHours === "") {
                setErrorMsg(
                    "Las horas de trabajo del APU no pueden estar vacias.",
                );
                return;
            }

            const apuPerformanceNumber = Number(apuPerformance);
            const apuWorkHoursNumber = Number(apuWorkHours);

            if (Number.isNaN(apuPerformanceNumber)) {
                setErrorMsg("El rendimiento del APU debe ser un número.");
                return;
            }
            if (Number.isNaN(apuWorkHoursNumber)) {
                setErrorMsg(
                    "Las horas de trabajo del APU deben ser un número.",
                );
                return;
            }

            if (apuWorkHoursNumber <= 0 || apuPerformanceNumber <= 0) {
                setErrorMsg(
                    "El rendimiento y horas de trabajo del APU deben ser mayores a 0.",
                );
                return;
            }

            // Insert APU data
            createData.apu = {
                performance: apuPerformanceNumber,
                workHours: apuWorkHoursNumber,
                // Resources are always empty on create,
                // those are added in another interface.
                resources: [],
            };
        } else if (selectedTab === "subworkitem") {
            // if SUB is selected, continue
        }

        // do create
        onCreate(createData);
    }

    useEffect(() => {
        if (createSuccess) {
            form.reset();
            setOpen(false);
        }
    }, [createSuccess, form]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    Crear Partida
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear una partida</DialogTitle>
                    <DialogDescription>
                        Ingrese los datos de la partida, y si la nueva partida
                        contiene subpartidas.
                    </DialogDescription>
                </DialogHeader>

                {/* Form de partida */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                        Cómo se llama la partida. Ejm: Limpieza
                                        de terreno
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
                                        Cuál es la unidad de medida unitaria de
                                        la partida. Ejm: m2
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tabs para seleccionar APU o subpartida */}
                        <hr />
                        <Tabs defaultValue="apu" onValueChange={setSelectedTab}>
                            <p className="text-sm">
                                Selecciona si a esta partida le corresponde un
                                APU, o si esta partida tendrá subpartidas:
                            </p>
                            <TabsList className="grid w-full grid-cols-2 text-lg">
                                <TabsTrigger value="apu">
                                    APU (plantilla)
                                </TabsTrigger>
                                <TabsTrigger value="subworkitem">
                                    Subpartidas
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="apu" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="apuPerformance"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Rendimiento del APU
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Rendimiento"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Rendimiento a aplicar a todo el
                                                APU. Ejm: 25.00
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
                                            <FormLabel>
                                                Horas de trabajo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Horas de trabajo"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Cuantas horas dura la jornada de
                                                la mano de obra, en horas. Ejm:
                                                8
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <p className="text-sm">
                                    Podras agregar recursos a este APU más
                                    adelante, despues de confirmar la creación
                                    de esta partida
                                </p>
                            </TabsContent>
                            <TabsContent value="subworkitem">
                                <p className="text-sm">
                                    Podrás crear varias subpartidas despues de
                                    confirmar la creación de esta partida.
                                </p>
                            </TabsContent>
                        </Tabs>

                        <p className="text-[0.8rem] font-medium text-destructive">
                            {errorMsg}
                        </p>

                        {/* Boton para crear partida */}
                        <div className="text-right">
                            <Button
                                disabled={
                                    !form.formState.isDirty || createLoading
                                }
                            >
                                Crear partida
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
