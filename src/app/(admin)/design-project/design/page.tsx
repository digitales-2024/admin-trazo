"use client";

import { useDesignProject } from "@/hooks/use-design-project";
import { useProfile } from "@/hooks/use-profile";
import { useGetCreatableQuotationsQuery } from "@/redux/services/designProjectApi";
import {
    DesignProjectSummaryData,
    DesignProjectStatus,
} from "@/types/designProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Contact, Download, Ellipsis, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Select,
    SelectContent,
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
    const table: Table<any> = undefined;
    const { user } = useProfile();
    const exportFile = false;

    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <></>
            ) : null}
            <CreateProjectDialog />
            {exportFile ||
                (user?.isSuperAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (table) {
                                console.log("export on click :D");
                            }
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
});

function CreateProjectDialog() {
    const [open, setOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const { data, isLoading, isError } = useGetCreatableQuotationsQuery();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("form submit :D");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    Crear Cotización
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear un proyecto de diseño</DialogTitle>
                    <DialogDescription>
                        Seleccione una cotización aprobada y presione el boton
                        Crear.
                    </DialogDescription>
                    {isLoading && <>Cargando cotizaciones</>}
                    {isError && (
                        <div className="text-red-500">
                            Hubo un error cargando las cotizaciones disponibles
                        </div>
                    )}
                    {data && data.length === 0 && (
                        <div className="rounded bg-yellow-100 p-4 font-bold text-yellow-500 shadow">
                            No hay cotizaciones que puedan pasar a fase de
                            Proyecto de Diseño.
                            <br />
                            Cuando una cotización sea Aprobada, y no esté
                            vinculada a otro Proyecto de Diseño, aparecerá aquí.
                        </div>
                    )}
                    {data && data.length > 0 && (
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="">
                                                            <SelectValue placeholder="Cotización" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {data.map((q) => (
                                                            <SelectItem
                                                                key={q.id}
                                                                value={q.id}
                                                            >
                                                                {q.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
                                </form>
                            </Form>
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
