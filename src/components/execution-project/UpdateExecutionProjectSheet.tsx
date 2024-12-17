"use client";

import { departments } from "@/data/department";
import { useBudgets } from "@/hooks/use-budget";
import { useClients } from "@/hooks/use-client";
import { useExecutionProject } from "@/hooks/use-execution-project";
import { useUsers } from "@/hooks/use-users";
import {
    CreateExecutionProjectSchema,
    executionProjectSchema,
} from "@/schemas";
import { City, ExecutionProject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { MapPinIcon, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
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

import DatePicker from "../ui/date-time-picker";

const infoSheet = {
    title: "Actualizar Proyecto de Ejecución",
    description: "Actualiza la información del proyecto y guarda los cambios",
};

interface UpdateExecutionProjectSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    project: ExecutionProject;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateExecutionProjectSheet({
    project,
    open,
    onOpenChange,
}: UpdateExecutionProjectSheetProps) {
    const {
        onUpdateExecutionProject,
        isSuccessUpdateExecutionProject,
        isLoadingUpdateExecutionProject,
    } = useExecutionProject();

    const { data: usersDataUnfiltered } = useUsers();
    const { dataClientsAll } = useClients();
    const { dataBudgetCreatableAll } = useBudgets({
        projectExecutionId: project.id,
    });

    // Obtener opciones de cliente
    const clientOptions: Option[] = (dataClientsAll ?? []).map((client) => ({
        value: client.id.toString(),
        label: client.name,
    }));

    // Obtener opciones de cliente
    const budgetOptions: Option[] = (dataBudgetCreatableAll ?? []).map(
        (budget) => ({
            value: budget.id,
            label: budget.code,
        }),
    );

    // Filtrar superadmin
    const usersData =
        usersDataUnfiltered?.filter((user) => !user.isSuperAdmin) ?? [];

    const usersOptions: Option[] = (usersData ?? []).map((user) => ({
        value: user.id.toString(),
        label: user.name,
    }));

    console.log(JSON.stringify(project, null, 2));
    const form = useForm<CreateExecutionProjectSchema>({
        resolver: zodResolver(executionProjectSchema),
        defaultValues: {
            name: project.name ?? "",
            ubicationProject: project.ubicationProject ?? "",
            province: project.province ?? "",
            department: project.department ?? "",
            clientId: project.client.id ?? "",
            budgetId: project.budget.id ?? "",
            residentId: project.resident.id ?? "",
            startProjectDate: project.startProjectDate ?? "",
            executionTime: project.executionTime ?? "",
        },
    });

    const [cities, setCities] = useState<City[]>([]);
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

    const departmentOptions: Option[] = departments.map((department) => ({
        value: department.name,
        label: department.name,
    }));

    const handleDepartmentChange = (departmentName: string) => {
        const selectedDepartment = departments.find(
            (dept) => dept.name === departmentName,
        );
        const selectedCities = selectedDepartment?.cities || [];
        setCities(selectedCities);
        setIsDepartmentSelected(true);
        form.setValue("province", "");
    };

    useEffect(() => {
        if (open) {
            form.reset({
                name: project.name ?? "",
                ubicationProject: project.ubicationProject ?? "",
                province: project.province ?? "",
                department: project.department ?? "",
                clientId: project.client.id ?? "",
                budgetId: project.budget?.id ?? "",
                residentId: project.resident.id ?? "",
                startProjectDate: project.startProjectDate ?? "",
                executionTime: project.executionTime ?? "",
            });

            const selectedDepartment = departments.find(
                (dept) =>
                    dept.name.toLowerCase() ===
                    project.department.toLowerCase(),
            );
            if (selectedDepartment) {
                setCities(selectedDepartment.cities);
                setIsDepartmentSelected(true);

                const selectedCity = selectedDepartment.cities.find(
                    (city) =>
                        city.name.toLowerCase() ===
                        project.province.toLowerCase(),
                );
                form.setValue("department", selectedDepartment.name);
                form.setValue(
                    "province",
                    selectedCity ? selectedCity.name : "",
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, project]);

    const onSubmit = async (input: CreateExecutionProjectSchema) => {
        onUpdateExecutionProject({
            ...input,
            id: project.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateExecutionProject) {
            form.reset();
            onOpenChange(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdateExecutionProject, onOpenChange]);

    console.log("Project budget ID:", project.budget?.id);
    console.log("Default budget ID:", form.getValues("budgetId"));

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
                            className="bg-emerald-100 capitalize text-emerald-700"
                            variant="secondary"
                        >
                            {project.code}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full gap-4 rounded-md border p-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 p-4"
                        >
                            <FormField
                                control={form.control}
                                name="budgetId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="budgetId">
                                            Presupuesto
                                        </FormLabel>
                                        <FormControl>
                                            <AutoComplete
                                                options={budgetOptions}
                                                placeholder="Selecciona un presupuesto"
                                                emptyMessage="No se encontraron presupuestos"
                                                onValueChange={(
                                                    selectedOption,
                                                ) => {
                                                    field.onChange(
                                                        selectedOption?.value ||
                                                            "",
                                                    );
                                                }}
                                                value={
                                                    budgetOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) || undefined
                                                }
                                                className="z-50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ubicationProject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="ubicationProject">
                                            Dirección
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPinIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                                <Input
                                                    id="ubicationProject"
                                                    placeholder="Ingrese la ubicación del proyecto"
                                                    {...field}
                                                    className="pl-8"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startProjectDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="startProjectDate">
                                            Fecha de inicio de proyecto
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={
                                                    field.value
                                                        ? parse(
                                                              field.value,
                                                              "yyyy-MM-dd",
                                                              new Date(),
                                                          )
                                                        : undefined
                                                }
                                                onChange={(date) => {
                                                    if (date) {
                                                        const formattedDate =
                                                            format(
                                                                date,
                                                                "yyyy-MM-dd",
                                                            );
                                                        field.onChange(
                                                            formattedDate,
                                                        );
                                                    } else {
                                                        field.onChange("");
                                                    }
                                                }}
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
                                                        option?.value || "",
                                                    );
                                                }}
                                                className="z-50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="residentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="residentId">
                                            Residente
                                        </FormLabel>
                                        <FormControl>
                                            <AutoComplete
                                                options={usersOptions}
                                                placeholder="Selecciona un diseñador"
                                                emptyMessage="No se encontraron diseñadores"
                                                value={
                                                    usersOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) || undefined
                                                }
                                                onValueChange={(option) => {
                                                    field.onChange(
                                                        option?.value || "",
                                                    );
                                                }}
                                                className="z-50"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Campo de Departamento */}
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departamento</FormLabel>
                                        <FormControl>
                                            <AutoComplete
                                                options={departmentOptions}
                                                emptyMessage="No se encontró el departamento."
                                                placeholder="Seleccione un departamento"
                                                onValueChange={(selectedOption: {
                                                    value?: string;
                                                }) => {
                                                    field.onChange(
                                                        selectedOption?.value ||
                                                            "",
                                                    );
                                                    handleDepartmentChange(
                                                        selectedOption?.value ||
                                                            "",
                                                    );
                                                }}
                                                value={
                                                    departmentOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) || undefined
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Campo de Ciudad */}
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="city">
                                            Provincia
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={!isDepartmentSelected}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione una provincia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {cities.map((city) => (
                                                        <SelectItem
                                                            key={city.id.toString()}
                                                            value={city.name}
                                                        >
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="executionTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Plazo de ejecución
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ingrese el plazo en días"
                                                {...field}
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
                                        disabled={
                                            isLoadingUpdateExecutionProject
                                        }
                                    >
                                        {isLoadingUpdateExecutionProject && (
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
