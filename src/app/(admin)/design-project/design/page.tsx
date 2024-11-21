"use client";

import { departments } from "@/data/department";
import { useDesignProject } from "@/hooks/use-design-project";
import { useProfile } from "@/hooks/use-profile";
import { useUsers } from "@/hooks/use-users";
import { useGetCreatableQuotationsQuery } from "@/redux/services/quotationApi";
import { City } from "@/types";
import {
    DesignProjectSummaryData,
    DesignProjectStatus,
} from "@/types/designProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { parse, format } from "date-fns";
import { Contact, Download, Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/date-time-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Project() {
    const { data, isLoading } = useDesignProject();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Diseño"
                    description="Lista de proyectos almacenados en el sistema"
                />
                <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={0}
                    cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            </Shell>
        );
    }

    if (!data) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Diseño"
                    description="Lista de proyectos almacenados en el sistema"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Proyectos de Diseño"
                description="Lista de proyectos almacenados en el sistema"
            />
            <DesignProjectTable data={data} />
        </Shell>
    );
}

function DesignProjectTable({
    data,
}: {
    data: Array<DesignProjectSummaryData>;
}) {
    const columns: ColumnDef<DesignProjectSummaryData>[] = [
        {
            id: "select",
            size: 10,
            header: ({ table }) => (
                <div className="px-2">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        className="translate-y-0.5"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-2">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },
        {
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "cliente",
            accessorKey: "client.name",
            header: "Cliente",
            cell: ({ row }) => {
                const clientName = row.getValue("cliente") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {clientName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "designer",
            accessorKey: "designer.name",
            header: "Diseñador",
            cell: ({ row }) => {
                const designerName = row.getValue("designer") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {designerName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "estado",
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const estado: DesignProjectStatus = row.getValue("estado");
                let badge = <></>;
                switch (estado) {
                    case "APPROVED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Aprobado
                            </Badge>
                        );
                        break;
                    case "COMPLETED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Completado
                            </Badge>
                        );
                        break;
                    case "ENGINEERING":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                En ingeniería
                            </Badge>
                        );
                        break;
                    case "CONFIRMATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                Confirmado
                            </Badge>
                        );
                        break;
                    case "PRESENTATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-500"
                            >
                                En presentacion
                            </Badge>
                        );
                        break;
                }

                return <div>{badge}</div>;
            },
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell() {
                return (
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                >
                                    <Ellipsis
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>Ver</DropdownMenuItem>

                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enablePinning: true,
        },
    ];
    return (
        <DataTable
            data={data}
            columns={columns}
            placeholder="Buscar proyectos..."
            toolbarActions={<DesignProjectTableToolbarActions />}
        />
    );
}

function DesignProjectTableToolbarActions() {
    // TODO: bring actual data
    //const table: Table<DesignProjectStatus> = undefined;
    const { user } = useProfile();
    const exportFile = false;

    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            <CreateProjectDialog />
            {exportFile ||
                (user?.isSuperAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            //if (table) {
                            //    console.log("export on click :D");
                            //}
                        }}
                    >
                        <Download className="mr-2 size-4" aria-hidden="true" />
                        Exportar
                    </Button>
                ))}
        </div>
    );
}

const FormSchema = z.object({
    quotationId: z.string({
        message: "Debes seleccionar una cotización",
    }),
    department: z.string({
        message: "Selecciona el departamento",
    }),
    province: z.string({
        message: "Selecciona la provincia",
    }),
    designerId: z.string({
        message: "Debes seleccionar un diseñador",
    }),
    address: z
        .string({
            message: "Ingresa la dirección del proyecto",
        })
        .length(2, {
            message: "La dirección del proyecto debe tener al menos 2 letras",
        }),
    startDate: z.string({
        message: "Ingresa la fecha de inicio del proyecto",
    }),
});

function CreateProjectDialog() {
    const [open, setOpen] = useState(false);
    const { data, isLoading, isError } = useGetCreatableQuotationsQuery();
    const { onCreateProject, createLoading, createSuccess } =
        useDesignProject();
    const { data: usersData } = useUsers();

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

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: "",
            startDate: "",
        },
    });

    useEffect(() => {
        if (createSuccess) {
            form.reset();
            setOpen(false);
        }
    }, [createSuccess, form]);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const quotation = data?.find((q) => q.id === formData.quotationId);
        if (!quotation) {
            alert("Cotizacion invalida");
            return;
        }

        await onCreateProject({
            name: quotation.name,
            ubicationProject: formData.address,
            province: formData.province,
            department: formData.department,
            clientId: quotation.client.id,
            quotationId: formData.quotationId,
            designerId: formData.designerId,
            startProjectDate: formData.startDate,
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    Crear Proyecto
                </Button>
            </DialogTrigger>
            <DialogContent>
                {isLoading && <DialogLoading />}
                {isError && <DialogError />}
                {data && data.length === 0 && <DialogEmpty />}
                {data && data.length > 0 && (
                    <DialogHeader>
                        <DialogTitle>Crear un proyecto de diseño</DialogTitle>
                        <DialogDescription>
                            Seleccione una cotización aprobada y presione el
                            boton Crear.
                        </DialogDescription>
                        {data && data.length > 0 && (
                            <div>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <div className="flex flex-col gap-6 p-4 sm:p-0">
                                            <FormField
                                                control={form.control}
                                                name="quotationId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Cotización
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="">
                                                                    <SelectValue placeholder="Selecciona un diseño" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {data.map(
                                                                    (q) => (
                                                                        <SelectItem
                                                                            key={
                                                                                q.id
                                                                            }
                                                                            value={
                                                                                q.id
                                                                            }
                                                                        >
                                                                            {
                                                                                q.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="designerId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="designerId">
                                                            Diseñador
                                                        </FormLabel>
                                                        <FormControl>
                                                            <AutoComplete
                                                                options={
                                                                    usersOptions
                                                                }
                                                                placeholder="Selecciona un diseñador"
                                                                emptyMessage="No se encontraron diseñadores"
                                                                value={
                                                                    usersOptions.find(
                                                                        (
                                                                            option,
                                                                        ) =>
                                                                            option.value ===
                                                                            field.value,
                                                                    ) ||
                                                                    undefined
                                                                }
                                                                onValueChange={(
                                                                    option,
                                                                ) => {
                                                                    field.onChange(
                                                                        option?.value ||
                                                                            "",
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
                                                        <FormLabel>
                                                            Departamento
                                                        </FormLabel>
                                                        <FormControl>
                                                            <AutoComplete
                                                                options={
                                                                    departmentOptions
                                                                }
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
                                                                        (
                                                                            option,
                                                                        ) =>
                                                                            option.value ===
                                                                            field.value,
                                                                    ) ||
                                                                    undefined
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
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                            disabled={
                                                                !isDepartmentSelected
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleccione una provincia" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {cities.map(
                                                                        (
                                                                            city,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={city.id.toString()}
                                                                                value={
                                                                                    city.name
                                                                                }
                                                                            >
                                                                                {
                                                                                    city.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="address">
                                                            Dirección
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="address"
                                                                placeholder="Dirección del proyecto"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="startDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="startDate">
                                                            Fecha de inicio de
                                                            proyecto
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
                                                                onChange={(
                                                                    date,
                                                                ) => {
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
                                                                        field.onChange(
                                                                            "",
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="mt-4"
                                                disabled={
                                                    !form.formState.isDirty ||
                                                    createLoading
                                                }
                                            >
                                                Crear Proyecto de Diseño
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </DialogHeader>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DialogLoading() {
    return <>Loading...</>;
}

function DialogError() {
    return (
        <div className="text-red-500">
            Hubo un error cargando las cotizaciones disponibles
        </div>
    );
}

function DialogEmpty() {
    return (
        <>
            <h2 className="text-lg font-semibold">
                No hay cotizaciones listas
            </h2>
            <p className="text-sm text-muted-foreground">
                No hay ninguna cotizacion aprobada y que no esté vinculada a
                otro proyecto de diseño.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button>
                    <Link href="/design-project/quotation">
                        Ir a cotizaciones
                    </Link>
                </Button>
            </div>
        </>
    );
}
