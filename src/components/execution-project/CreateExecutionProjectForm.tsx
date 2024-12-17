"use client";

import { departments } from "@/data/department";
import { useClients } from "@/hooks/use-client";
import { useUsers } from "@/hooks/use-users";
import { CreateExecutionProjectSchema } from "@/schemas";
import { BudgetSummary, City } from "@/types";
import { format, parse } from "date-fns";
import { MapPinIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { AutoComplete, Option } from "../ui/autocomplete";
import DatePicker from "../ui/date-time-picker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

interface CreateExecutionProjectFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateExecutionProjectSchema>;
    onSubmit: (data: CreateExecutionProjectSchema) => void;
    dataBudgetCreatableAll: BudgetSummary[];
}

export const CreateExecutionProjectForm = ({
    children,
    form,
    onSubmit,
    dataBudgetCreatableAll,
}: CreateExecutionProjectFormProps) => {
    const { data: usersDataUnfiltered } = useUsers();
    const { dataClientsAll } = useClients();

    // Obtener opciones de cliente
    const clientOptions: Option[] = (dataClientsAll ?? []).map((client) => ({
        value: client.id.toString(),
        label: client.name,
    }));

    // Obtener opciones de cliente
    const budgetOptions: Option[] = (dataBudgetCreatableAll ?? []).map(
        (budget) => ({
            value: budget.id.toString(),
            label: budget.code,
        }),
    );

    const handleBudgetChange = useCallback(
        (budgetId: string) => {
            const selectedBudgetProject = (dataBudgetCreatableAll ?? []).find(
                (budget) => budget.id.toString() === budgetId,
            );

            if (selectedBudgetProject) {
                // Completar los campos automáticamente
                form.setValue("budgetId", selectedBudgetProject.id);
                form.setValue("name", selectedBudgetProject?.name);
                form.setValue(
                    "ubicationProject",
                    selectedBudgetProject.ubication,
                );
                form.setValue(
                    "clientId",
                    selectedBudgetProject.clientBudget.id,
                );
                form.setValue(
                    "startProjectDate",
                    selectedBudgetProject.dateProject,
                );
            } else {
                form.setValue("budgetId", "");
                form.setValue("name", "");
                form.setValue("ubicationProject", "");
                form.setValue("clientId", "");
            }
        },
        [dataBudgetCreatableAll, form],
    );

    // Filtrar superadmin
    const usersData =
        usersDataUnfiltered?.filter((user) => !user.isSuperAdmin) ?? [];

    // Estado para almacenar las ciudades del departamento seleccionado
    const [cities, setCities] = useState<City[]>([]);
    const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

    // Prepara las opciones para el AutoComplete
    const departmentOptions: Option[] = departments.map((department) => ({
        value: department.name,
        label: department.name,
    }));

    const usersOptions: Option[] = (usersData ?? []).map((user) => ({
        value: user.id.toString(),
        label: user.name,
    }));

    // Manejar el cambio de departamento
    const handleDepartmentChange = (departmentName: string) => {
        const selectedDepartment = departments.find(
            (dept) => dept.name === departmentName,
        );
        const selectedCities = selectedDepartment?.cities || [];
        setCities(selectedCities);
        setIsDepartmentSelected(true);
        // Resetear el campo de ciudad cuando se cambia el departamento
        form.setValue("province", "");
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
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
                                        value={
                                            budgetOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || undefined
                                        }
                                        onValueChange={(option) => {
                                            field.onChange(option?.value || "");
                                            if (option?.value) {
                                                handleBudgetChange(
                                                    option.value,
                                                );
                                            }
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
                                                const formattedDate = format(
                                                    date,
                                                    "yyyy-MM-dd",
                                                );
                                                field.onChange(formattedDate);
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
                                            field.onChange(option?.value || "");
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
                                        placeholder="Selecciona un residente"
                                        emptyMessage="No se encontraron residentes"
                                        value={
                                            usersOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || undefined
                                        }
                                        onValueChange={(option) => {
                                            field.onChange(option?.value || "");
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
                                                selectedOption?.value || "",
                                            );
                                            handleDepartmentChange(
                                                selectedOption?.value || "",
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
                                <FormLabel htmlFor="city">Provincia</FormLabel>
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
                                <FormLabel>Plazo de ejecución</FormLabel>
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
                </div>
                {children}
            </form>
        </Form>
    );
};
